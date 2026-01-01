import React, { useState, useEffect } from 'react';

import { FaMusic, FaCloudUploadAlt, FaTrash, FaChartLine, FaDownload, FaSignOutAlt, FaVideo, FaImage, FaEdit, FaSave } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
    const [songs, setSongs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [pictures, setPictures] = useState([]);
    const [siteContent, setSiteContent] = useState({});
    const [analyticsData, setAnalyticsData] = useState(null);
    const [activeTab, setActiveTab] = useState('music');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoName, setVideoName] = useState('');
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchSongs();
            fetchVideos();
            fetchPictures();
            fetchContent();
            fetchAnalytics();
        }
    }, [isAuthenticated]);

    const fetchSongs = async () => {
        try {
            const response = await fetch('/api/music');
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setSongs(data);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/videos');
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const fetchPictures = async () => {
        try {
            const response = await fetch('/api/pictures');
            if (response.ok) {
                const data = await response.json();
                setPictures(data);
            }
        } catch (error) {
            console.error('Error fetching pictures:', error);
        }
    };

    const fetchContent = async () => {
        try {
            const response = await fetch('/api/content');
            if (response.ok) {
                const data = await response.json();
                setSiteContent(data);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics');
            if (response.ok) {
                const data = await response.json();
                setAnalyticsData(data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple client-side check for now, can be moved to server-side session later
        if (password === 'StreetMoney60') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a file.');
            return;
        }

        setIsUploading(true);
        setStatus('Uploading...');

        const formData = new FormData();

        let endpoint = '';
        if (activeTab === 'music') endpoint = '/api/music/upload';
        else if (activeTab === 'videos') endpoint = '/api/videos/upload';
        else if (activeTab === 'pictures') endpoint = '/api/pictures/upload';

        formData.append(activeTab === 'music' ? 'song' : activeTab === 'videos' ? 'video' : 'picture', file);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            // Safely handle non-JSON responses
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (data.success) {
                    setStatus(`Success! Upload complete.`);
                    setFile(null);
                    if (activeTab === 'music') fetchSongs();
                    else if (activeTab === 'videos') fetchVideos();
                    else if (activeTab === 'pictures') fetchPictures();
                } else {
                    setStatus('Error: ' + data.error);
                }
            } else {
                // Handle cases like 413 Payload Too Large or 404
                if (response.status === 413) {
                    setStatus('Error: File too large (Server Limit)');
                } else {
                    setStatus('Error: Server returned unexpected content (Check logs)');
                }
            }
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!videoUrl || !videoName) {
            setStatus('Please provide both video name and URL.');
            return;
        }

        setIsUploading(true);
        setStatus('Adding video...');

        try {
            const response = await fetch('/api/videos/add-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: videoName, url: videoUrl }),
            });

            // Check if response is OK
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // Safely handle response
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (data.success) {
                    setStatus(`Success! Video added (${data.videoType}).`);
                    setVideoUrl('');
                    setVideoName('');
                    fetchVideos();
                } else {
                    setStatus('Error: ' + (data.error || 'Unknown error occurred'));
                }
            } else {
                // Server didn't return JSON
                const text = await response.text();
                console.error('Non-JSON response:', text);
                setStatus('Error: Server returned unexpected response. Check console for details.');
            }
        } catch (error) {
            console.error('Video URL submission error:', error);
            setStatus('Error: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleContentUpdate = async (key, value) => {
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            if (response.ok) {
                setStatus(`Content updated: ${key}`);
                fetchContent();
                setTimeout(() => setStatus(''), 2000);
            } else {
                setStatus('Failed to update content');
            }
        } catch (error) {
            setStatus('Error updating content');
        }
    };



    const handlePictureDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this picture?')) return;
        try {
            const response = await fetch(`/api/pictures/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchPictures();
            }
        } catch (error) {
            console.error('Error deleting picture', error);
        }
    };

    const handleMusicDelete = async (id) => {
        if (!window.confirm('Delete this track?')) return;
        try {
            await fetch(`/api/music/${id}`, { method: 'DELETE' });
            fetchSongs();
        } catch (error) {
            console.error('Error deleting song', error);
        }
    };

    const handleVideoDelete = async (id) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await fetch(`/api/videos/${id}`, { method: 'DELETE' });
            fetchVideos();
        } catch (error) {
            console.error('Error deleting video', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaMusic className="text-white text-3xl" />
                        </div>
                        <h1 className="text-2xl font-heading font-black uppercase text-gray-900">Admin Login</h1>
                        <p className="text-gray-500 text-sm mt-2">Manage your StreetMoney content</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Access Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-gold-500 transition-all font-sans"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gray-900 text-white font-heading font-bold uppercase tracking-widest rounded-2xl hover:bg-gold-600 transition-all shadow-lg active:scale-95"
                        >
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white p-8 flex flex-col">
                <div className="mb-12">
                    <h2 className="text-xl font-heading font-black uppercase tracking-tighter">Street<span className="text-gold-500">Money</span></h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Management Hub</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('music')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'music' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FaMusic /> Music
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'videos' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FaVideo /> Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('pictures')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'pictures' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FaImage /> Pictures
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'content' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FaEdit /> Site Content
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FaChartLine /> Insights
                    </button>
                </nav>

                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition-colors mt-auto"
                >
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-black text-gray-900 uppercase">Dashboard</h1>
                        <p className="text-gray-500">Content Overview & Music Management</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center">
                                {activeTab === 'music' ? <FaMusic size={20} /> : activeTab === 'videos' ? <FaVideo size={20} /> : activeTab === 'pictures' ? <FaImage size={20} /> : <FaEdit size={20} />}
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {activeTab === 'music' ? songs.length : activeTab === 'videos' ? videos.length : activeTab === 'pictures' ? pictures.length : Object.keys(siteContent).length}
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                                    Total {activeTab === 'music' ? 'Tracks' : activeTab === 'videos' ? 'Clips' : activeTab === 'pictures' ? 'Images' : 'Fields'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'insights' && analyticsData ? (
                    <div className="space-y-8">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Page Views</h4>
                                <div className="text-4xl font-heading font-black text-gray-900">{analyticsData.overview.totalViews}</div>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Unique Visitors</h4>
                                <div className="text-4xl font-heading font-black text-gray-900">{analyticsData.overview.uniqueVisitors}</div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Traffic (Last 7 Days)</h4>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={analyticsData.traffic}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#111827', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="visits" stroke="#D4AF37" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Pages */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Top Pages</h4>
                            <div className="space-y-4">
                                {analyticsData.pages.map((page, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span className="font-heading font-bold text-gray-700">{page.page}</span>
                                        <span className="font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200">{page.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Upload Section */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-6">
                                {activeTab === 'music' ? 'Upload New Track' : activeTab === 'videos' ? 'Add New Video' : activeTab === 'pictures' ? 'Upload Image' : 'Edit Content'}
                            </h3>

                            {/* Mode Toggle for Videos */}
                            {activeTab === 'videos' && (
                                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('file')}
                                        className={`flex-1 py-3 px-4 rounded-lg font-heading font-bold uppercase text-sm tracking-wider transition-all ${uploadMode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('url')}
                                        className={`flex-1 py-3 px-4 rounded-lg font-heading font-bold uppercase text-sm tracking-wider transition-all ${uploadMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Add URL
                                    </button>
                                </div>
                            )}

                            {/* File Upload Form */}
                            {(activeTab === 'music' || activeTab === 'pictures' || (activeTab === 'videos' && uploadMode === 'file')) && (
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-3xl py-12 px-6 hover:border-gold-400 transition-colors group cursor-pointer">
                                        <input
                                            type="file"
                                            accept={activeTab === 'music' ? '.mp3' : activeTab === 'pictures' ? 'image/*' : 'video/*'}
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-center space-y-2">
                                            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-300 group-hover:text-gold-500 transition-colors" />
                                            <p className="text-sm font-medium text-gray-700">
                                                {file ? file.name : `Click to select ${activeTab === 'music' ? 'MP3' : activeTab === 'pictures' ? 'Image' : 'Video'}`}
                                            </p>
                                            <p className="text-xs text-gray-400">Max file size: {activeTab === 'music' ? '20MB' : activeTab === 'pictures' ? '10MB' : '100MB'}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className={`w-full py-4 rounded-2xl font-heading font-bold uppercase tracking-widest transition-all ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gold-600 text-white hover:bg-gold-700 shadow-lg active:scale-95'}`}
                                    >
                                        {isUploading ? 'Uploading...' : `Publish ${activeTab === 'music' ? 'Track' : activeTab === 'pictures' ? 'Image' : 'Video'}`}
                                    </button>
                                    {status && (
                                        <p className={`text-center text-sm font-bold ${status.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                                            {status}
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* URL Input Form */}
                            {activeTab === 'videos' && uploadMode === 'url' && (
                                <form onSubmit={handleUrlSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Video Name</label>
                                            <input
                                                type="text"
                                                value={videoName}
                                                onChange={(e) => setVideoName(e.target.value)}
                                                placeholder="Enter video title"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Video URL</label>
                                            <input
                                                type="url"
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Supports YouTube, Vimeo, and direct video URLs</p>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className={`w-full py-4 rounded-2xl font-heading font-bold uppercase tracking-widest transition-all ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gold-600 text-white hover:bg-gold-700 shadow-lg active:scale-95'}`}
                                    >
                                        {isUploading ? 'Adding...' : 'Add Video'}
                                    </button>
                                    {status && (
                                        <p className={`text-center text-sm font-bold ${status.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                                            {status}
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* Site Content Editor */}
                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-500 mb-4">Edit text content displayed on the website.</p>
                                    {[
                                        { label: 'Hero Title', key: 'hero_title', type: 'text' },
                                        { label: 'Hero Subtitle', key: 'hero_subtitle', type: 'text' },
                                        { label: 'About Heading', key: 'about_heading', type: 'text' },
                                        { label: 'About Text', key: 'about_text', type: 'textarea' },
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 uppercase">{field.label}</label>
                                            <div className="flex gap-2">
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all font-sans"
                                                        rows="4"
                                                        value={siteContent[field.key] || ''}
                                                        onChange={(e) => setSiteContent({ ...siteContent, [field.key]: e.target.value })}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all font-sans"
                                                        value={siteContent[field.key] || ''}
                                                        onChange={(e) => setSiteContent({ ...siteContent, [field.key]: e.target.value })}
                                                    />
                                                )}
                                                <button
                                                    onClick={() => handleContentUpdate(field.key, siteContent[field.key])}
                                                    className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gold-600 transition-colors"
                                                >
                                                    <FaSave />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {status && (
                                        <p className={`text-center text-sm font-bold ${status.includes('Error') || status.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                                            {status}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content List */}
                        {activeTab !== 'content' && (
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-6">Published {activeTab === 'music' ? 'Tracks' : activeTab === 'pictures' ? 'Images' : 'Videos'}</h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                    {activeTab === 'pictures' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {pictures.map(pic => (
                                                <div key={pic.id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                                                    <img src={pic.url} alt={pic.name} className="w-full h-32 object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <a href={pic.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-gray-900 hover:text-gold-600">
                                                            <FaDownload size={14} />
                                                        </a>
                                                        <button onClick={() => handlePictureDelete(pic.id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50">
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        (activeTab === 'music' ? songs : videos).map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gold-600 shadow-sm">
                                                        {activeTab === 'music' ? <FaMusic /> : <FaVideo />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{item.name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(item.upload_date).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a href={item.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                        <FaDownload size={14} />
                                                    </a>
                                                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {(activeTab === 'music' ? songs : activeTab === 'pictures' ? pictures : videos).length === 0 && <p className="text-center text-gray-400 py-12 italic">No {activeTab === 'music' ? 'tracks' : activeTab === 'pictures' ? 'images' : 'videos'} yet.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
