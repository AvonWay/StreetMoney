import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';
import DownloadModal from './DownloadModal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const [content, setContent] = useState({});
    const [songs, setSongs] = useState([]);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch content
            const { data: contentData } = await supabase.from('content').select('*');
            if (contentData) {
                const contentMap = contentData.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setContent(contentMap);
            }

            // Fetch songs for album download
            const { data: songsData } = await supabase.from('songs').select('*');
            if (songsData) setSongs(songsData);
        };
        fetchData();
    }, []);

    const handleDownloadClick = () => {
        const isRegistered = localStorage.getItem('sm_music_registered') === 'true';
        if (isRegistered) {
            downloadAlbum();
        } else {
            setShowDownloadModal(true);
        }
    };

    const downloadAlbum = async () => {
        if (songs.length === 0) {
            alert("No songs found to download.");
            return;
        }
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const folder = zip.folder("Gift From The Streets");

            // Add Cover Art (using the provided banner image as fallback or primary)
            const coverRes = await fetch('/assets/gift-from-streets.jpg');
            if (coverRes.ok) {
                const coverBlob = await coverRes.blob();
                folder.file("Cover.png", coverBlob);
            }

            // Add Songs
            await Promise.all(songs.map(async (song) => {
                try {
                    const songRes = await fetch(song.url);
                    if (songRes.ok) {
                        const songBlob = await songRes.blob();
                        const filename = song.name.replace(/[^a-zA-Z0-9.\-_ ]/g, "") + ".mp3";
                        folder.file(filename, songBlob);
                    }
                } catch (e) {
                    console.error("Failed to fetch song for zip:", song.name, e);
                }
            }));

            const contentZip = await zip.generateAsync({ type: "blob" });
            saveAs(contentZip, "Gift From The Streets.zip");
        } catch (error) {
            console.error("Error creating album zip:", error);
            alert("Failed to create album zip. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <section id="home" ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent z-10" />
                <img
                    src="/assets/hero-bg.jpg"
                    alt="StreetMoney Hero Background"
                    className="w-full h-full object-cover object-top"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-6xl mx-auto w-full">


                {/* Glitch Text Effect Placeholder - purely CSS/Motion based */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative"
                >
                    <h1 className="text-6xl md:text-9xl font-heading font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none relative inline-block">
                        <span className="relative z-10">Street<span className="text-gold-600">Money</span></span>
                        <span className="absolute top-0 left-[2px] -z-10 text-red-500 opacity-40 animate-pulse">StreetMoney</span>
                        <span className="absolute top-0 -left-[2px] -z-10 text-blue-500 opacity-40 animate-pulse delay-75">StreetMoney</span>
                    </h1>
                </motion.div>

                {/* Album Progress Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-12 mb-10 max-w-2xl mx-auto group"
                >
                    <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 shadow-2xl bg-white p-4 md:p-6 transition-all duration-500 hover:shadow-gold-500/20">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative w-48 h-48 flex-shrink-0 animate-float">
                                <img
                                    src="/assets/gift-from-streets.jpg"
                                    alt="Album Artwork"
                                    className="w-full h-full object-contain rounded-xl shadow-lg"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent rounded-xl" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="inline-block px-3 py-1 bg-gold-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                                    New Album
                                </div>
                                <h3 className="text-3xl font-heading font-black text-gray-900 uppercase leading-none mb-2">
                                    Gift <span className="text-gold-600">From The</span> Streets
                                </h3>
                                <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                                    The wait is over. Experience the raw energy and hustle of the streets through this definitive collection.
                                </p>
                                <button
                                    onClick={handleDownloadClick}
                                    disabled={isDownloading}
                                    className={`w-full md:w-auto px-8 py-4 font-heading font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${isDownloading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gold-500 hover:text-black'}`}
                                >
                                    {isDownloading ? 'Downloading...' : (
                                        <>
                                            Download Album <FaDownload className="text-sm" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center mt-4"
                >
                    <a href="#events" className="group relative px-10 py-5 bg-gold-600 overflow-hidden text-white font-heading text-xl md:text-2xl font-bold uppercase tracking-wide transition-all hover:scale-105 clip-path-slant shadow-xl">
                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative">Upcoming Fights</span>
                    </a>
                    <a href="#music" className="group px-10 py-5 border-2 border-gray-900 backdrop-blur-sm text-gray-900 font-heading text-xl md:text-2xl font-bold uppercase tracking-wide transition-all hover:bg-gray-900 hover:text-white">
                        Latest Tracks
                    </a>
                </motion.div>

                <DownloadModal
                    isOpen={showDownloadModal}
                    onClose={() => setShowDownloadModal(false)}
                    onSuccess={downloadAlbum}
                />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-bold">Scroll</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-gold-600 to-transparent" />
            </motion.div>
        </section>
    );
};

export default Hero;
