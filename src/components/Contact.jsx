import React, { useState } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'Booking / Performance',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    type: formData.type,
                    message: formData.message,
                    created_at: new Date()
                }]);

            if (!error) {
                setStatus('Message Sent! We will get back to you soon.');
                setFormData({ name: '', email: '', type: 'Booking / Performance', message: '' });
            } else {
                console.error('Supabase Error:', error);
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error sending message.');
        }
    };

    return (
        <section id="contact" className="py-24 bg-white relative">
            {/* Background graffiti hint */}
            <div className="absolute inset-0 opacity-5 pointer-events-none grayscale" style={{
                backgroundImage: 'url(/assets/graffiti.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]"
                >
                    <div className="text-center mb-12">
                        <div className="inline-block bg-gold-100 text-gold-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] mb-4">
                            Contact / Booking
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-gray-900 mb-4 uppercase leading-none">
                            GET THE <span className="text-gold-600">GAME</span>
                        </h2>
                        <p className="text-gray-500 font-sans max-w-sm mx-auto">
                            For fights, features, or appearances. Secure the bag.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/5 transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/5 transition-all"
                                    placeholder="contact@business.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Inquiry Type</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 appearance-none focus:outline-none focus:bg-white focus:border-gold-500 transition-all cursor-pointer"
                                >
                                    <option>Booking / Performance</option>
                                    <option>Feature / Collaboration</option>
                                    <option>Press / Media</option>
                                    <option>Other</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/5 transition-all resize-none"
                                placeholder="Tell us about the project..."
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-5 bg-gray-900 hover:bg-gold-600 text-white hover:text-black font-heading font-black text-xl uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-2xl"
                            >
                                {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status && <p className={`text-center mt-6 text-sm font-bold uppercase tracking-widest ${status.includes('Sent') ? 'text-green-600' : 'text-gold-600'}`}>{status}</p>}
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
