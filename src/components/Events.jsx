import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
    const [selectedId, setSelectedId] = useState(null);

    const flyers = [
        { id: 1, title: 'Knockout Party', date: 'Dec 19', image: '/assets/fight-card-updated.jpg', info: 'Gillie & Wallo\'s Knockout Party' },
        { id: 2, title: 'DK vs StreetMoney', date: 'Main Event', image: '/assets/face-off.png', info: 'Official Watch Party' }
    ];

    return (
        <section id="events" className="py-24 bg-gray-50 text-gray-900 relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-500/5 rotate-12 transform scale-150 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-heading font-black mb-4 uppercase tracking-tighter">
                        Fight <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold-600 to-gold-400">Night</span>
                    </h2>
                    <p className="text-xl text-gray-500 font-sans max-w-2xl mx-auto">
                        Witness history. The streets are watching.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {flyers.map((flyer, index) => (
                        <motion.div
                            key={flyer.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            layoutId={flyer.id}
                            onClick={() => setSelectedId(flyer.id)}
                            className="group relative cursor-pointer"
                        >
                            {/* Card Container */}
                            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-gold-300 transition-all duration-500 shadow-xl hover:shadow-2xl">
                                {/* Image */}
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={flyer.image}
                                        alt={flyer.title}
                                        className="w-full h-full object-cover transform transition duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-10">
                                    <div className="bg-gold-500 text-black text-[10px] font-black px-2 py-1 inline-block rounded items-center mb-3 uppercase tracking-widest shadow-lg">
                                        {flyer.date}
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-heading font-black mb-1 uppercase text-white tracking-tight">{flyer.title}</h3>
                                    <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">{flyer.info}</p>
                                    <div className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-[0.3em]">
                                        Explore <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Expanded View */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xl p-4 md:p-8"
                        onClick={() => setSelectedId(null)}
                    >
                        {flyers.filter(f => f.id === selectedId).map(flyer => (
                            <motion.div
                                layoutId={selectedId}
                                className="relative bg-white rounded-[2rem] overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.1)] border border-gray-100"
                                onClick={(e) => e.stopPropagation()}
                                key={flyer.id}
                            >
                                <div className="md:w-3/5 h-[40vh] md:h-auto">
                                    <img src={flyer.image} alt={flyer.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="text-gold-600 font-black text-sm uppercase tracking-widest mb-4">Official Flyer</div>
                                    <h3 className="text-4xl md:text-6xl font-heading font-black mb-4 uppercase text-gray-900 leading-none">{flyer.title}</h3>
                                    <p className="text-gray-500 text-lg mb-10 font-sans">{flyer.info}</p>
                                    <button className="w-full py-5 bg-gray-900 text-white font-heading font-black text-xl uppercase tracking-widest hover:bg-gold-600 transition-all shadow-xl active:scale-95">
                                        Secure Tickets
                                    </button>
                                    <button
                                        className="mt-6 text-gray-400 hover:text-gray-900 uppercase text-[10px] font-black tracking-[0.4em] transition-colors"
                                        onClick={() => setSelectedId(null)}
                                    >
                                        [ Close Window ]
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Events;
