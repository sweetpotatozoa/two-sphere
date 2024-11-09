// components/Footer.jsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full pb-20 bg-white-200 text-center">
            <div className="py-8 flex justify-center space-x-6 text-xs">
                <Link href="/about" className="hover:underline">
                    서비스 소개
                </Link>
                <a href="mailto:team.twosphere@gmail.com" className="hover:underline">
                    문의
                </a>
                <a
                    href="https://www.instagram.com/twosphere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    인스타그램
                </a>
            </div>
        </footer>
    );
};

export default Footer;
