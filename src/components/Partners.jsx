import React from 'react';
import { motion } from 'framer-motion';

const Partners = () => {
    const partners = [
        {
            name: "Luxary Media Art",
            description: "A premier creative agency and media production partner, bringing high-end production and artistic vision to every project.",
            logo: "/assets/luxary-media-logo.png",
            link: "https://book.squareup.com/appointments/6a8pwopjy5zqeh/location/LXDWD8PYX6YJ8/services",
            type: "Media & Production"
        }
    ];

    return (
        <section id="partners" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 mb-6 uppercase">
                        Our <span className="text-gold-600">Partners</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Proudly working with industry leaders to bring the best experience to the streets.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-1 gap-12 max-w-4xl mx-auto">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 md:p-12 bg-white rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-8 flex items-center justify-center h-48 w-full">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="inline-block px-4 py-1 bg-gold-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                                    {partner.type}
                                </div>

                                <h3 className="text-3xl font-heading font-black text-gray-900 mb-4 uppercase tracking-tighter">
                                    {partner.name}
                                </h3>

                                <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-2xl mb-8">
                                    {partner.description}
                                </p>

                                <a
                                    href={partner.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-gray-900 text-white font-heading font-black uppercase tracking-widest rounded-xl hover:bg-gold-500 hover:text-black transition-all shadow-lg active:scale-95 mb-12"
                                >
                                    Book Services
                                </a>

                                {/* Booking Embed */}
                                <div className="w-full max-w-4xl mx-auto mt-8 border border-gray-100 rounded-[2rem] overflow-hidden shadow-inner bg-gray-50 aspect-[4/3] md:aspect-video">
                                    <iframe
                                        src={partner.link}
                                        style={{ border: 'none', width: '100%', height: '100%' }}
                                        title="Square Booking"
                                        allow="payment"
                                    />
                                </div>
                            </div>

                            {/* Decorative Edge */}
                            <div className="absolute top-0 right-0 w-2 h-full bg-gold-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
