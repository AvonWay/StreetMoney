import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
    const [content, setContent] = useState({});

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section id="about" className="py-24 bg-white text-gray-900 relative overflow-hidden">
            {/* Massive Background Stroke Text */}
            <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none select-none opacity-5">
                <span className="text-[20vw] font-heading font-black text-transparent stroke-text whitespace-nowrap leading-none">
                    STREET MONEY
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-16 items-center">

                    {/* Image Side - Spans 5 columns */}
                    <div className="md:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden border border-gray-100 shadow-2xl"
                        >
                            <img
                                src="/assets/hero-bg.jpg"
                                alt="StreetMoney Artist"
                                className="w-full h-full object-cover filter contrast-110 hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Texture */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent" />
                        </motion.div>
                        {/* Decorative Box */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* Text Side - Spans 7 columns */}
                    <div className="md:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <h2 className="text-xl text-gold-600 font-bold tracking-[0.2em] uppercase mb-4">The Origin</h2>
                            <h3 className="text-5xl md:text-7xl font-heading font-black text-gray-900 leading-none mb-8">
                                {content.about_heading ? (
                                    <span dangerouslySetInnerHTML={{ __html: content.about_heading.replace(/\n/g, '<br />') }} />
                                ) : (
                                    <>
                                        RAW ENERGY. <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400">UNFILTERED.</span>
                                    </>
                                )}
                            </h3>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-sans max-w-2xl">
                                {content.about_text ? (
                                    <div dangerouslySetInnerHTML={{ __html: content.about_text.replace(/\n/g, '<br />') }} />
                                ) : (
                                    <>
                                        <p className="border-l-4 border-gold-500 pl-6 italic">
                                            Born from the gritty streets and the hustle mentality, StreetMoney represents more than just music—it's a pursuit of wealth, authenticity, and securing the bag.
                                        </p>

                                        <p>
                                            Evolving from the massive success of the <span className="text-black font-bold">Million Dollaz Worth Of Game</span> universe, StreetMoney/Fighter is a core force in the <span className="text-black font-bold">Knockout Party</span> series. Founded by legends <span className="text-black font-bold">Gillie Da King</span> and <span className="text-black font-bold">Wallo267</span>, these events blend the raw intensity of celebrity boxing with the fire of live musical performances.
                                        </p>

                                        <p>
                                            As a star of the KO Party, StreetMoney brings that "unapologetically real" vibe to the stage and the ring. It's about the game, the hustle, and the raw energy that defines the community.
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-12 pt-4 border-t border-gray-100"
                        >
                            <div>
                                <h4 className="text-5xl font-heading font-bold text-gray-900">100%</h4>
                                <p className="text-sm text-gold-600 font-bold uppercase tracking-widest">Hustle Mentality</p>
                            </div>
                            <div>
                                <h4 className="text-5xl font-heading font-bold text-gray-900">RAW</h4>
                                <p className="text-sm text-gold-600 font-bold uppercase tracking-widest">Authentic Artist</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
