'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import KakaoTalkButton from '../components/KakaoTalkButton';

export default function ClientLayout({ children }) {
    const pathname = usePathname(); // usePathname을 사용하여 현재 경로 가져오기

    // Header와 BottomNav의 제외 조건
    const isSignupPage = pathname === '/signup';
    const isSigninPage = pathname === '/signin';
    const isWelcomePage = pathname === '/welcome'; // Welcome 페이지 여부 추가

    return (
        <div className="container min-h-screen flex flex-col max-w-[500px] mx-auto relative shadow-2xl">
            {/* Header는 signup, signin, welcome 페이지에서는 표시되지 않음 */}
            {!isSigninPage && !isWelcomePage && <Header />}

            <main className={`flex-grow ${isSigninPage || isWelcomePage ? '' : 'mt-16'}`}>{children}</main>

            {/* Footer는 welcome 페이지에서 표시되지 않음 */}
            {!isWelcomePage && <Footer className="mb-20" />}

            <KakaoTalkButton />

            {/* BottomNav는 signup, welcome 페이지에서 표시되지 않음 */}
            {!isSignupPage && !isWelcomePage && (
                <BottomNav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px]" />
            )}

            <MenuBar />
        </div>
    );
}
