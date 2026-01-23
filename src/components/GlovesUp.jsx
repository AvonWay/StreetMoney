import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SignUpModal from './SignUpModal';

const GlovesUp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="pt-20 min-h-screen bg-white">
            <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <section className="relative min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        src="/assets/gugd/hero.mp4"
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <img
                            src="/assets/gugd/logo.jpg"
                            alt="Gloves Up Logo"
                            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-gold-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] object-cover max-w-full"
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter mb-6"
                    >
                        Gloves Up <br />
                        <span className="text-gold-500">Guns Down</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl md:text-2xl text-gray-200 font-sans max-w-2xl font-light tracking-wide"
                    >
                        Put down the weapon. Pick up the gloves.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <img
                                src="/assets/gugd/action.jpg"
                                alt="Training Session"
                                className="w-full h-full object-cover max-w-full"
                            />
                            <div className="absolute inset-0 bg-gold-500/10 mix-blend-overlay"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 leading-tight">
                                TRAINING. DISCIPLINE. <br />
                                <span className="text-gold-600">A BETTER WAY.</span>
                            </h2>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-sans">
                                <p className="border-l-4 border-gold-500 pl-6 bg-white p-4 rounded-r-xl shadow-sm">
                                    <span className="font-bold text-gray-900 block mb-2">A Free Society Initiative</span>
                                    Gloves Up Guns Down is a revolutionary program created by Free Society designed to give our youth a fighting chance—literally and figuratively.
                                </p>

                                <p>
                                    We believe that conflict is inevitable, but violence doesn't have to be lethal. Our program provides a structured environment where kids learn the art of boxing, instilling discipline, respect, and emotional control.
                                </p>

                                <p>
                                    It's more than just fighting; it's about settling issues in the ring, shaking hands afterwards, and leaving the guns behind. We're building character and saving lives, one round at a time.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-10 py-4 bg-gray-900 text-white font-heading font-black uppercase tracking-widest rounded-xl hover:bg-gold-600 transition-colors shadow-lg"
                            >
                                Join The Movement
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GlovesUp;
