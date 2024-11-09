// app/ClientLayout.jsx
'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

export default function ClientLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="container min-h-screen flex flex-col max-w-[500px] mx-auto relative">
            <Header toggleMenu={toggleMenu} />
            <main className="flex-grow mt-16">{children}</main>
            <Footer className="mb-20" />
            <BottomNav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px]" />
            <MenuBar isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
    );
}
