import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSpotify, FaApple, FaYoutube, FaSoundcloud, FaPlay, FaPause, FaDownload } from 'react-icons/fa';

const Music = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSongs(data || []);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const togglePlay = (song) => {
        if (currentSong?.id === song.id) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            // Audio will play via useEffect when currentSong changes
        }
    };

    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.src = currentSong.url;
            audioRef.current.play();
        }
    }, [currentSong]);

    return (
        <section id="music" className="py-24 bg-white border-t border-gray-100 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 mb-6 uppercase">
                        Latest <span className="text-gold-600">Music</span>
                    </h2>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors"><FaSpotify size={32} /></a>
                        <a href="#" className="text-gray-400 hover:text-[#FA243C] transition-colors"><FaApple size={32} /></a>
                        <a href="#" className="text-gray-400 hover:text-[#FF0000] transition-colors"><FaYoutube size={32} /></a>
                        <a href="#" className="text-gray-400 hover:text-[#FF5500] transition-colors"><FaSoundcloud size={32} /></a>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Player / Art */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl group">
                            <img
                                src="/assets/track-selection-updated.jpg"
                                alt="Album Art"
                                className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                                    {currentSong ? currentSong.name : "Select a Track"}
                                </h3>
                                <p className="text-gold-400 font-medium">StreetMoney Worldwide</p>
                            </div>
                        </div>

                        {/* Hidden Audio Element */}
                        <audio
                            ref={audioRef}
                            onEnded={() => setIsPlaying(false)}
                            onPause={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                        />
                    </motion.div>

                    {/* Tracklist */}
                    <div className="space-y-3">
                        {songs.length > 0 ? songs.map((song, index) => (
                            <motion.div
                                key={song.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-xl flex justify-between items-center group transition-all duration-300 border ${currentSong?.id === song.id ? 'bg-gold-50 border-gold-200' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md hover:border-gold-300'}`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <button
                                        onClick={() => togglePlay(song)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentSong?.id === song.id && isPlaying ? 'bg-gold-600 text-white animate-pulse' : 'bg-white text-gray-900 shadow-sm group-hover:bg-gold-600 group-hover:text-white'}`}
                                    >
                                        {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                                    </button>
                                    <div className="overflow-hidden">
                                        <h4 className={`font-bold transition-colors truncate ${currentSong?.id === song.id ? 'text-gold-700' : 'text-gray-900 group-hover:text-gold-600'}`}>{song.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Digital Single</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 ml-4">
                                    <a
                                        href={song.url}
                                        download
                                        className="p-3 text-gray-400 hover:text-gold-600 transition-colors"
                                        title="Download track"
                                    >
                                        <FaDownload size={20} />
                                    </a>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                <p className="text-gray-500 font-medium">No songs uploaded yet.</p>
                                <a href="#admin" className="text-gold-600 text-sm hover:underline mt-2 inline-block">Upload from Manager</a>
                            </div>
                        )}

                        <div className="pt-8">
                            <Link to="/bio" className="inline-block px-8 py-4 bg-gray-900 text-white font-heading font-bold uppercase tracking-widest hover:bg-gold-600 transition-all w-full md:w-auto shadow-xl text-center">
                                Full Bio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Music;
