import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const [content, setContent] = useState({});

    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase.from('content').select('*');
            if (data) {
                // Convert array of key-value pairs to object
                const contentMap = data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setContent(contentMap);
            }
        };
        fetchContent();
    }, []);

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

                {/* Super Bowl Party Event - THIS SUNDAY */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 mb-10 max-w-3xl mx-auto"
                >
                    <div className="relative group p-1 bg-gradient-to-r from-red-500/50 via-blue-500/50 to-red-500/50 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                        <div className="bg-white/95 backdrop-blur-3xl rounded-[2.9rem] p-4 md:p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                {/* Event Poster */}
                                <div className="relative w-full md:w-48 h-64 md:h-56 flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/assets/superbowl-party.jpg"
                                        alt="Super Bowl Party"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">This Sunday</div>
                                </div>

                                {/* Event Details */}
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="text-2xl md:text-4xl font-heading font-black text-gray-900 leading-tight mb-2 uppercase tracking-tighter">
                                        Super Bowl <span className="text-blue-600">Party</span>
                                    </h3>
                                    <div className="flex flex-col gap-2 mb-3">
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Feb 8, 2026</span>
                                            <span className="text-gray-600 text-sm font-bold">This Sunday!</span>
                                        </div>
                                        <p className="text-gray-700 text-sm font-bold">Hosted by Luxary Group Arts</p>
                                        <p className="text-gray-500 text-xs">BYOB • BYOW • Snacks & Food Provided</p>
                                    </div>
                                    <a href="#contact" className="inline-block px-6 py-2 bg-blue-600 text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                                        DM for Location
                                    </a>
                                </div>
                            </div>
                        </div>
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
