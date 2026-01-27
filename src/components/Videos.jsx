import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { FaPlay, FaVideo, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const VideoPlayer = ({ video, index }) => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = (e) => {
        e.stopPropagation(); // Prevent potentially triggering other click handlers
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    // Construct iframe URL with autoplay and mute
    const getIframeUrl = (urlString) => {
        try {
            const url = new URL(urlString);
            url.searchParams.set('autoplay', '1');
            url.searchParams.set('mute', '1');
            return url.toString();
        } catch (e) {
            // Fallback for relative URLs or invalid URLs
            console.warn('Invalid URL for video:', urlString);
            return urlString;
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
        >
            <div className="aspect-video relative overflow-hidden bg-black">
                {video.video_type === 'youtube' || video.video_type === 'url' ? (
                    <iframe
                        src={getIframeUrl(video.embed_url || video.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.name}
                    />
                ) : (
                    <>

                        <video
                            ref={videoRef}
                            src={video.video_url}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted={isMuted}
                            defaultMuted={true}
                            loop
                            playsInline
                            onLoadedMetadata={() => {
                                if (videoRef.current) {
                                    videoRef.current.muted = true; // Force mute for autoplay policy
                                    videoRef.current.play().catch(e => console.warn("Autoplay blocked:", e));
                                }
                            }}
                            onError={(e) => console.error("Video load error:", video.video_url, e)}
                        />
                        {/* Unmute Button Overlay */}
                        <button
                            onClick={toggleMute}
                            className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                        </button>
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
    );
};

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching videos:', error);
            } else {
                setVideos(data || []);
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
                            <VideoPlayer key={video.id} video={video} index={index} />
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
