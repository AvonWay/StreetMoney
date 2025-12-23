import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white py-20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="mb-10">
                    <span className="font-heading text-3xl tracking-tighter text-gray-900">
                        STREET<span className="text-gold-600">MONEY</span>
                    </span>
                </div>

                <div className="flex space-x-10 mb-10">
                    <a href="https://instagram.com" className="text-gray-400 hover:text-gold-600 transition-all transform hover:-translate-y-1">
                        <FaInstagram size={28} />
                    </a>
                    <a href="https://twitter.com" className="text-gray-400 hover:text-gold-600 transition-all transform hover:-translate-y-1">
                        <FaTwitter size={28} />
                    </a>
                    <a href="https://facebook.com/street.moneyman" className="text-gray-400 hover:text-gold-600 transition-all transform hover:-translate-y-1">
                        <FaFacebook size={28} />
                    </a>
                    <a href="https://youtube.com" className="text-gray-400 hover:text-gold-600 transition-all transform hover:-translate-y-1">
                        <FaYoutube size={28} />
                    </a>
                </div>

                <div className="text-center space-y-4">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} StreetMoney Worldwide</p>
                    <div className="w-12 h-px bg-gold-500 mx-auto opacity-30"></div>
                    <p className="text-gray-300 text-[10px] italic font-sans">Securing the bag since Day One.</p>
                    <div className="pt-4">
                        <Link to="/admin" className="text-gray-300 hover:text-gold-500 text-[10px] uppercase tracking-widest transition-colors font-sans">
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
