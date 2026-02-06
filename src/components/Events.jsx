import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const Events = () => {
    const [selectedId, setSelectedId] = useState(null);

    const flyers = [
        { id: 1, title: 'Michael Smith vs Wooski Dumbout', date: 'March 13', image: '/assets/gugd-event-michael-smith.jpg', info: 'Gloves Up Guns Down 609 - Main Event' },
        { id: 2, title: 'Zac Miller vs Ray Ray', date: 'March 13', image: '/assets/gugd-event-zac-miller.jpg', info: 'Heavyweight Clash' },
        { id: 3, title: 'Demetrius Lindsey vs Zach Tucker', date: 'March 13', image: '/assets/gugd-event-demetrius.jpg', info: 'Undercard Battle' },
        { id: 4, title: 'Vendor Registration', date: 'March 13', image: '/assets/gugd-event-vendor.jpg', info: 'Join the Movement - Calling All Vendors!' }
    ];

    return (
        <section id="events" className="py-24 bg-gray-50 text-gray-900 relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-500/5 rotate-12 transform scale-150 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-5xl md:text-7xl font-heading font-black mb-4 uppercase tracking-tighter">
                        Fight <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold-600 to-gold-400">Night</span>
                    </h2>
                    <p className="text-xl text-gray-500 font-sans max-w-2xl mx-auto">
                        Witness the action. Gloves Up, Guns Down.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-gold-300 transition-all duration-500 shadow-xl hover:shadow-2xl h-full">
                                {/* Image */}
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={flyer.image}
                                        alt={flyer.title}
                                        className="w-full h-full object-cover transform transition duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                                    <div className="bg-gold-500 text-black text-[10px] font-black px-2 py-1 inline-block rounded items-center mb-2 uppercase tracking-widest shadow-lg">
                                        {flyer.date}
                                    </div>
                                    <h3 className="text-lg font-heading font-black mb-1 uppercase text-white tracking-tight leading-tight">{flyer.title}</h3>
                                    <div className="flex items-center gap-2 text-gold-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
                                        View <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-sm border border-gold-100"
                >
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-3xl font-heading font-black uppercase mb-4">Be Part of the Experience</h3>
                        <p className="text-gray-500 mb-8">Secure your seats for the main event or register your business to become a vendor.</p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button className="px-8 py-4 bg-gold-500 text-black font-heading font-black uppercase tracking-widest rounded-xl hover:bg-gold-400 transition-all shadow-lg hover:shadow-gold-500/20 active:scale-95">
                                Purchase Tickets
                            </button>
                            <a href="#contact" className="px-8 py-4 bg-gray-900 text-white font-heading font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                Vendor Registration
                            </a>
                        </div>
                    </div>
                </motion.div>
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
                                <div className="md:w-3/5 h-[40vh] md:h-auto bg-black">
                                    <img src={flyer.image} alt={flyer.title} className="w-full h-full object-contain" />
                                </div>
                                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="text-gold-600 font-black text-sm uppercase tracking-widest mb-4">Official Flyer</div>
                                    <h3 className="text-3xl md:text-5xl font-heading font-black mb-4 uppercase text-gray-900 leading-none">{flyer.title}</h3>
                                    <p className="text-gray-500 text-lg mb-10 font-sans">{flyer.info}</p>
                                    <button className="w-full py-5 bg-gold-500 text-black font-heading font-black text-xl uppercase tracking-widest hover:bg-gold-400 transition-all shadow-xl active:scale-95 rounded-xl">
                                        Get Tickets
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
