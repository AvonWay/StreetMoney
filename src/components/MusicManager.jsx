import React, { useState } from 'react';
import { FaCloudUploadAlt, FaMusic } from 'react-icons/fa';

const MusicManager = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a file first.');
            return;
        }

        setIsUploading(true);
        setStatus('Uploading...');

        const formData = new FormData();
        formData.append('song', file);

        try {
            const response = await fetch('/api/music/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setStatus('Success! Song uploaded.');
                setFile(null);
            } else {
                setStatus('Error: ' + (data.error || 'Upload failed'));
            }
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section id="admin" className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="mb-4 inline-flex items-center justify-center p-3 bg-gold-100 rounded-full text-gold-600">
                    <FaMusic size={24} />
                </div>
                <h2 className="text-3xl font-heading font-black text-gray-900 mb-2 uppercase">Manage Your Music</h2>
                <p className="text-gray-600 mb-8">Upload MP3 files for fans to preview and download.</p>

                <form onSubmit={handleUpload} className="max-w-md mx-auto space-y-4">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl py-12 px-4 hover:border-gold-500 transition-colors cursor-pointer group">
                        <input
                            type="file"
                            accept=".mp3"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2 pointer-events-none">
                            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 group-hover:text-gold-500 transition-colors" />
                            <p className="text-sm font-medium text-gray-700">
                                {file ? file.name : "Click to select or drag and drop MP3"}
                            </p>
                            <p className="text-xs text-gray-500">Only .mp3 files are allowed</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-4 px-6 rounded-lg font-heading font-bold uppercase tracking-wider transition-all shadow-lg ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gold-600 hover:bg-gold-700 text-white active:scale-95'}`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Song'}
                    </button>

                    {status && (
                        <p className={`text-sm font-medium ${status.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {status}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default MusicManager;
