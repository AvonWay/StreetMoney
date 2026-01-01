import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const SignUpModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'Gloves Up Registration'
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('Registration Complete! See you in the ring.');
                setTimeout(() => {
                    onClose();
                    setStatus('');
                    setFormData({ name: '', email: '', phone: '', type: 'Gloves Up Registration' });
                }, 2000);
            } else {
                setStatus('Failed to register. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error sending registration.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-heading font-black text-gray-900 uppercase">
                                Join The <span className="text-gold-600">Fight</span>
                            </h2>
                            <p className="text-gray-500 mt-2">Sign up for the Gloves Up Guns Down program.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500 transition-all"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gray-900 text-white font-heading font-black uppercase tracking-widest rounded-xl hover:bg-gold-600 transition-all shadow-lg active:scale-95"
                            >
                                {status === 'Sending...' ? 'Registering...' : 'Sign Up Now'}
                            </button>

                            {status && (
                                <p className={`text-center text-sm font-bold ${status.includes('Complete') ? 'text-green-600' : 'text-red-500'}`}>
                                    {status}
                                </p>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SignUpModal;
