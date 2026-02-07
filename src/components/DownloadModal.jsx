import React, { useState } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMusic } from 'react-icons/fa';

const DownloadModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Processing...');

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    type: 'Song Download',
                    message: `User ${formData.name} requested download access.`,
                    created_at: new Date()
                }]);

            if (!error) {
                setStatus('Access Granted! Your download is starting...');
                // Store registration in localStorage
                localStorage.setItem('sm_music_registered', 'true');

                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setStatus('');
                    setFormData({ name: '', email: '' });
                }, 1500);
            } else {
                console.error('Supabase Error:', error);
                setStatus('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error connecting to registration service.');
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
                        className="relative w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaMusic size={28} />
                            </div>
                            <h2 className="text-3xl font-heading font-black text-gray-900 uppercase">
                                Download <span className="text-gold-600">Music</span>
                            </h2>
                            <p className="text-gray-500 mt-2">Enter your details to unlock free downloads.</p>
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

                            <button
                                type="submit"
                                disabled={status === 'Processing...'}
                                className={`w-full py-4 font-heading font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 ${status === 'Processing...' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gold-600'}`}
                            >
                                {status === 'Processing...' ? 'Please wait...' : 'Get Access Now'}
                            </button>

                            {status && (
                                <p className={`text-center text-sm font-bold ${status.includes('Granted') ? 'text-green-600' : 'text-red-500'}`}>
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

export default DownloadModal;
