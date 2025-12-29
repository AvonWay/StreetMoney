import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaVideo } from 'react-icons/fa';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="videos" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-none text-gray-900">
                        High <span className="text-gold-600">Energy</span> Clips
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] mt-4 ml-2">Performance & Raw Content</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-gray-100 animate-pulse rounded-[2rem]" />
                        ))
                    ) : videos.length > 0 ? (
                        videos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="aspect-video relative overflow-hidden bg-black">
                                    {video.video_type === 'youtube' || video.video_type === 'url' ? (
                                        <iframe
                                            src={video.embed_url || video.url}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={video.name}
                                        />
                                    ) : (
                                        <>
                                            <video
                                                src={video.url}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                controls
                                                preload="metadata"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                                <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                                    <FaPlay className="ml-1" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-gold-600 mb-2">
                                        <FaVideo size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Official Content</span>
                                    </div>
                                    <h3 className="text-xl font-heading font-black text-gray-900 uppercase truncate">
                                        {video.name}
                                    </h3>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-100 rounded-[3rem]">
                            <FaVideo className="mx-auto text-6xl text-gray-100 mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No clips uploaded yet</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Videos;
