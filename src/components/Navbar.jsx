import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { title: 'Home', href: '/#home' },
        { title: 'About', href: '/#about' },
        { title: 'Videos', href: '/#videos' },
        { title: 'Events', href: '/#events' },
        { title: 'Music', href: '/#music' },
        { title: 'Contact', href: '/#contact' },
        { title: 'Social', href: '/#social' },
        { title: 'Gloves Up', href: '/gloves-up', isRoute: true },
        { title: 'Dashboard', href: '/admin', isRoute: true },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0 relative z-50">
                        <a href="#" className="font-heading text-2xl tracking-tighter text-gray-900">
                            STREET<span className="text-gold-600">MONEY</span>
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                link.isRoute ? (
                                    <Link
                                        key={link.title}
                                        to={link.href}
                                        className={`relative group font-heading text-lg transition-colors duration-300 uppercase tracking-wide overflow-hidden ${scrolled ? 'text-gray-600 hover:text-black' : 'text-gray-900 hover:text-black'}`}
                                    >
                                        <span className="relative z-10">{link.title}</span>
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                                    </Link>
                                ) : (
                                    <a
                                        key={link.title}
                                        href={link.href}
                                        className={`relative group font-heading text-lg transition-colors duration-300 uppercase tracking-wide overflow-hidden ${scrolled ? 'text-gray-600 hover:text-black' : 'text-gray-900 hover:text-black'}`}
                                    >
                                        <span className="relative z-10">{link.title}</span>
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="md:hidden z-50">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-900 bg-white/90 hover:bg-white hover:text-gold-600 focus:outline-none p-2 rounded-lg shadow-md transition-all backdrop-blur-sm"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 bg-white z-40 flex items-center justify-center md:hidden"
                    >
                        <div className="flex flex-col space-y-8 text-center">
                            {navLinks.map((link, i) => (
                                link.isRoute ? (
                                    <motion.div
                                        key={link.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                    >
                                        <Link
                                            to={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="font-heading text-4xl text-gray-900 hover:text-gold-600 uppercase tracking-widest"
                                        >
                                            {link.title}
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <motion.a
                                        key={link.title}
                                        href={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        onClick={() => setIsOpen(false)}
                                        className="font-heading text-4xl text-gray-900 hover:text-gold-600 uppercase tracking-widest"
                                    >
                                        {link.title}
                                    </motion.a>
                                )
                            ))}
                        </div>

                        {/* Background Texture for Menu */}
                        <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none bg-[url('/assets/logo.png')] bg-no-repeat bg-center bg-contain filter blur-sm h-full w-full" />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
