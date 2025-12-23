import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

                {/* New Album Announcement Wrap */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 mb-10 max-w-2xl mx-auto"
                >
                    <div className="relative group p-1 bg-gradient-to-r from-gold-500/50 via-gold-400 to-gold-500/50 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                        <div className="bg-white/90 backdrop-blur-3xl rounded-[2.9rem] p-6 md:p-8 flex items-center gap-6 md:gap-10">
                            {/* Album Cover Thumbnail */}
                            <div className="relative w-24 h-24 md:w-40 md:h-40 flex-shrink-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="/assets/gift-from-streets.jpg"
                                    alt="Gift From The Streets Cover"
                                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gold-600/80 text-white text-[8px] font-black py-1 uppercase tracking-widest text-center">New Album</div>
                            </div>

                            {/* Album Text */}
                            <div className="text-left">
                                <h3 className="text-xl md:text-3xl font-heading font-black text-gray-900 leading-none mb-3 uppercase tracking-tighter">
                                    Gift From <span className="text-gold-600 underline decoration-4 underline-offset-4">The Streets</span>
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Coming Soon</span>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest hidden md:block">Dropping 2025</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <div className="w-8 h-1 bg-gold-500 rounded-full" />
                                    <div className="w-16 h-1 bg-gray-200 rounded-full group-hover:bg-gold-300 transition-colors" />
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
