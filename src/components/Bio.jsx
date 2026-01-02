import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';

const Bio = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header with Back Button */}
            {/* Header Removed - Using Global Navbar */}
            <div className="pt-20"></div>

            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/graffiti.jpg')] bg-cover bg-center" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-6xl md:text-8xl font-heading font-black uppercase mb-6 leading-none">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">StreetMoney</span> Story
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-sans">
                            From the streets to the stage—a journey of hustle, authenticity, and raw talent.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Bio Content */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-16">
                        {/* Image Column */}
                        <div className="md:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="sticky top-24"
                            >
                                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                                    <img
                                        src="/assets/hero-bg.jpg"
                                        alt="StreetMoney"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-sm font-heading font-black uppercase tracking-widest text-gray-400">Connect</h3>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold-500 hover:text-white transition-all">
                                            <FaInstagram size={20} />
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold-500 hover:text-white transition-all">
                                            <FaTwitter size={20} />
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold-500 hover:text-white transition-all">
                                            <FaYoutube size={20} />
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gold-500 hover:text-white transition-all">
                                            <FaTiktok size={20} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Content Column */}
                        <div className="md:col-span-2 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-heading font-black text-gray-900 mb-6 uppercase">The Beginning</h3>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        Born from the gritty streets and the hustle mentality, <span className="text-black font-bold">StreetMoney</span> represents more than just music—it's a pursuit of wealth, authenticity, and securing the bag. Every track, every performance, every moment is about staying true to the grind.
                                    </p>
                                    <p>
                                        Evolving from the massive success of the <span className="text-black font-bold">Million Dollaz Worth Of Game</span> universe, StreetMoney/Fighter is a core force in the <span className="text-black font-bold">Knockout Party</span> series. Founded by legends <span className="text-black font-bold">Gillie Da King</span> and <span className="text-black font-bold">Wallo267</span>, these events blend the raw intensity of celebrity boxing with the fire of live musical performances.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border-l-4 border-gold-500 pl-8 py-4 bg-gold-50/50"
                            >
                                <p className="text-2xl font-heading font-bold text-gray-900 italic">
                                    "It's not just about the music. It's about the movement, the culture, and the relentless pursuit of greatness."
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-heading font-black text-gray-900 mb-6 uppercase">The Knockout Party Era</h3>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        As a star of the KO Party, StreetMoney brings that "unapologetically real" vibe to the stage and the ring. It's about the game, the hustle, and the raw energy that defines the community. Each event is a spectacle—combining the adrenaline of combat sports with electrifying live performances that leave audiences breathless.
                                    </p>
                                    <p>
                                        The Knockout Party series has become a cultural phenomenon, drawing massive crowds and creating unforgettable moments. StreetMoney's involvement has elevated the brand, bringing a unique fusion of street credibility and entertainment value that resonates with fans worldwide.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-heading font-black text-gray-900 mb-6 uppercase">The Music</h3>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        StreetMoney's sound is raw, unfiltered, and authentic. Drawing from real-life experiences and the struggles of the streets, every lyric hits hard and every beat demands attention. The music isn't just entertainment—it's a reflection of a lifestyle, a mindset, and a relentless drive to succeed.
                                    </p>
                                    <p>
                                        From hard-hitting anthems to introspective tracks, the discography showcases versatility while maintaining that signature street edge. Collaborations with industry heavyweights and underground legends alike have solidified StreetMoney's position as a force to be reckoned with in the game.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-heading font-black text-gray-900 mb-6 uppercase">The Future</h3>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        The journey is far from over. With new music on the horizon, upcoming Knockout Party events, and an ever-growing fanbase, StreetMoney continues to push boundaries and break barriers. The mission remains the same: stay authentic, stay hungry, and never stop grinding.
                                    </p>
                                    <p>
                                        This is just the beginning. The streets are watching, and StreetMoney is ready to deliver.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Stats Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200"
                            >
                                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                    <div className="text-4xl font-heading font-black text-gray-900 mb-2">100%</div>
                                    <div className="text-sm text-gold-600 font-bold uppercase tracking-widest">Hustle Mentality</div>
                                </div>
                                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                                    <div className="text-4xl font-heading font-black text-gray-900 mb-2">RAW</div>
                                    <div className="text-sm text-gold-600 font-bold uppercase tracking-widest">Authentic Artist</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-4xl md:text-5xl font-heading font-black uppercase mb-6">
                            Join The <span className="text-gold-500">Movement</span>
                        </h3>
                        <p className="text-xl text-gray-300 mb-10">
                            Stay connected and be part of the StreetMoney journey.
                        </p>
                        <Link
                            to="/"
                            className="inline-block px-12 py-5 bg-gold-600 text-white font-heading font-bold uppercase tracking-widest rounded-2xl hover:bg-gold-700 transition-all shadow-xl active:scale-95"
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Bio;
