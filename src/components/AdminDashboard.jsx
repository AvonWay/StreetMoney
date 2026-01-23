import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
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

    // --- Data Fetching ---

    const fetchSongs = async () => {
        const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (!error) setSongs(data || []);
    };

    const fetchVideos = async () => {
        const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (!error) setVideos(data || []);
    };

    const fetchPictures = async () => {
        // Assuming user wants to store uploaded pics in a 'pictures' bucket or table?
        // Detailed implementation: List files from 'images' bucket or a 'gallery' table.
        // For now, let's assume a 'pictures' table exists or we LIST storage.
        // Let's use a 'pictures' table as a registry.
        const { data, error } = await supabase.from('pictures').select('*').order('created_at', { ascending: false });
        if (!error) setPictures(data || []);
    };

    const fetchContent = async () => {
        const { data, error } = await supabase.from('content').select('*');
        if (data) {
            const contentMap = data.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            setSiteContent(contentMap);
        }
    };

    const fetchAnalytics = async () => {
        // Mock analytics based on DB counts since we don't have a real analytics backend
        // fetching fetches are expensive, so we just do count
        const { count: songCount } = await supabase.from('songs').select('*', { count: 'exact', head: true });
        const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });

        setAnalyticsData({
            overview: {
                totalViews: "N/A", // We can't track views without backend/GA
                uniqueVisitors: "N/A"
            },
            traffic: [], // No historical traffic data
            pages: [
                { page: '/music', count: songCount || 0 },
                { page: '/videos', count: videoCount || 0 }
            ]
        });
    };

    // --- Authentication ---

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Check hardcoded first for legacy support, but THEN try to sign in for RLS
            // Actually, for RLS to work, we MUST sign in.
            // If the user hasn't set up this user in Supabase yet, this will fail.
            // But strict RLS 'insert' requires it.

            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'admin@streetmoney.com', // Assuming this is the admin email
                password: password
            });

            if (error) {
                // Determine if it's "Invalid login credentials" or something else
                console.error("Login failed:", error.message);

                // FALLBACK: If they don't have an account yet, maybe they are just using the bypass?
                // But the bypass WON'T WORK for RLS uploads.
                // We'll show an error but allow the bypass for 'viewing' if that's desired, 
                // BUT explicitly warn them that uploads might fail.

                if (password === 'StreetMoney60') {
                    alert("Warning: Local admin bypass used. Uploads may fail due to database security. Please create an admin user in Supabase.");
                    setIsAuthenticated(true);
                } else {
                    alert('Login failed: ' + error.message);
                }
            } else {
                setIsAuthenticated(true);
            }
        } catch (err) {
            alert('Login error: ' + err.message);
        }
    };

    // --- Handlers ---

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload Helper
    async function uploadFileToSupabase(file, bucket) {
        const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { data, error } = await supabase.storage.from(bucket).upload(cleanName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(cleanName);
        return publicUrl;
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a file.');
            return;
        }

        setIsUploading(true);
        setStatus('Uploading...');

        try {
            let bucket = 'media';
            let table = '';

            if (activeTab === 'music') {
                bucket = 'media';
                table = 'songs';
            } else if (activeTab === 'videos') {
                bucket = 'media';
                table = 'videos';
            } else if (activeTab === 'pictures') {
                bucket = 'images'; // or 'media'
                table = 'pictures';
            }

            const publicUrl = await uploadFileToSupabase(file, bucket);

            // Insert into DB
            let record = {
                name: file.name,
                created_at: new Date()
            };

            // Handle table-specific columns
            if (activeTab === 'videos') {
                record.video_url = publicUrl;
                record.video_type = 'upload';
            } else if (activeTab === 'music') {
                record.url = publicUrl; // Assuming 'songs' table uses 'url'
            } else if (activeTab === 'pictures') {
                record.url = publicUrl; // Assuming 'pictures' uses 'url'
                record.filename = file.name; // Pictures might need filename
            }

            // Specific fields
            if (activeTab === 'videos') record.video_type = 'upload';

            const { error } = await supabase.from(table).insert(record);
            if (error) throw error;

            setStatus('Success! Upload complete.');
            setFile(null);

            // Refresh
            if (activeTab === 'music') fetchSongs();
            else if (activeTab === 'videos') fetchVideos();
            else if (activeTab === 'pictures') fetchPictures();

        } catch (error) {
            console.error(error);
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
            const { error } = await supabase.from('videos').insert({
                name: videoName,
                video_url: videoUrl, // CORRECT COLUMN: video_url
                video_type: 'url', // or youtube detection logic
                created_at: new Date()
            });

            if (error) throw error;

            setStatus('Success! Video added.');
            setVideoUrl('');
            setVideoName('');
            fetchVideos();

        } catch (error) {
            console.error("URL Submit Error:", error);
            setStatus('Error: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleContentUpdate = async (key, value) => {
        try {
            // Upsert content
            const { error } = await supabase.from('content').upsert({ key, value });

            if (!error) {
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

    const handleDelete = async (table, id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (!error) {
                if (table === 'songs') fetchSongs();
                if (table === 'videos') fetchVideos();
                if (table === 'pictures') fetchPictures();
            }
        } catch (error) {
            console.error('Delete error', error);
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
                    <button onClick={() => setActiveTab('music')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'music' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}>
                        <FaMusic /> Music
                    </button>
                    <button onClick={() => setActiveTab('videos')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'videos' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}>
                        <FaVideo /> Videos
                    </button>
                    <button onClick={() => setActiveTab('pictures')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'pictures' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}>
                        <FaImage /> Pictures
                    </button>
                    <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'content' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}>
                        <FaEdit /> Site Content
                    </button>
                    <button onClick={() => setActiveTab('insights')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-white/10 text-gold-400' : 'text-gray-400 hover:bg-white/5'}`}>
                        <FaChartLine /> Insights
                    </button>
                </nav>

                <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition-colors mt-auto">
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
                </div>

                {activeTab === 'insights' ? (
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-heading font-black mb-4">Quick Stats (Database)</h3>
                        <p>Total Songs: {analyticsData?.pages.find(p => p.page === '/music')?.count || 0}</p>
                        <p>Total Videos: {analyticsData?.pages.find(p => p.page === '/videos')?.count || 0}</p>
                        <p className="text-sm text-gray-400 mt-4">Full analytics not available in static mode.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Upload Section */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-6">
                                {activeTab === 'music' ? 'Upload New Track' : activeTab === 'videos' ? 'Add New Video' : activeTab === 'pictures' ? 'Upload Image' : 'Edit Content'}
                            </h3>

                            {/* Standard File Upload */}
                            {(activeTab === 'music' || activeTab === 'pictures' || (activeTab === 'videos' && uploadMode === 'file')) && activeTab !== 'content' && (
                                <form onSubmit={handleUpload} className="space-y-6">
                                    {/* Simple File Input for Reliability */}
                                    <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" accept={activeTab === 'music' ? '.mp3' : activeTab === 'pictures' ? 'image/*' : 'video/*'} />

                                    <button type="submit" disabled={isUploading} className="w-full py-4 bg-gold-600 text-white font-heading font-bold uppercase rounded-2xl">
                                        {isUploading ? 'Uploading...' : 'Publish'}
                                    </button>
                                    {status && <p className="text-center font-bold">{status}</p>}
                                </form>
                            )}

                            {/* Videos URL Mode Toggle & Form */}
                            {activeTab === 'videos' && (
                                <div className="mt-4">
                                    <div className="flex gap-2 mb-4"><button type="button" onClick={() => setUploadMode('file')} className="px-3 py-1 bg-gray-200 rounded">File</button><button type="button" onClick={() => setUploadMode('url')} className="px-3 py-1 bg-gray-200 rounded">URL</button></div>
                                    {uploadMode === 'url' && (
                                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                                            <input type="text" placeholder="Video Name" value={videoName} onChange={e => setVideoName(e.target.value)} className="w-full p-3 border rounded-xl" />
                                            <input type="url" placeholder="Video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full p-3 border rounded-xl" />
                                            <button type="submit" className="w-full py-4 bg-gold-600 text-white font-heading font-bold rounded-2xl">Add Video URL</button>
                                        </form>
                                    )}
                                </div>
                            )}


                            {/* Site Content Editor */}
                            {activeTab === 'content' && (
                                <div className="space-y-6">
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
                                                    <textarea className="w-full p-2 border rounded" rows="4" value={siteContent[field.key] || ''} onChange={(e) => setSiteContent({ ...siteContent, [field.key]: e.target.value })} />
                                                ) : (
                                                    <input type="text" className="w-full p-2 border rounded" value={siteContent[field.key] || ''} onChange={(e) => setSiteContent({ ...siteContent, [field.key]: e.target.value })} />
                                                )}
                                                <button onClick={() => handleContentUpdate(field.key, siteContent[field.key])} className="p-2 bg-black text-white rounded"><FaSave /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {status && <p className="text-center">{status}</p>}
                                </div>
                            )}
                        </div>

                        {/* Content List */}
                        {activeTab !== 'content' && activeTab !== 'insights' && (
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-heading font-black text-gray-900 uppercase mb-6">Existing Items</h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {(activeTab === 'music' ? songs : activeTab === 'pictures' ? pictures : videos).map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <div className="truncate w-1/2">{item.name}</div>
                                            <button onClick={() => handleDelete(activeTab === 'music' ? 'songs' : activeTab === 'pictures' ? 'pictures' : 'videos', item.id)} className="text-red-500"><FaTrash /></button>
                                        </div>
                                    ))}
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
