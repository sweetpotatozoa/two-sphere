// app/page.jsx

'use client';

import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import OpenSpheres from '../components/OpenSpheres';
import ServiceIntro from '../components/ServiceIntro';
import PartnersList from '../components/PartnersList';

export default function Page() {
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('logoutMessage') === 'true') {
            setShowLogoutMessage(true);
            localStorage.removeItem('logoutMessage'); // 메시지를 한 번만 표시하도록 제거

            // 3초 후 메시지를 숨기도록 설정
            setTimeout(() => setShowLogoutMessage(false), 3000);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center max-w-[500px] mx-auto tracking-tighter">
            <main className="flex-grow w-full">
                <Banner />
                <OpenSpheres />
                <ServiceIntro />
                <PartnersList />

                {showLogoutMessage && (
                    <div className="fixed bottom-0 mb-28 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white py-2 px-4 rounded-xl">
                        로그아웃 되었습니다
                    </div>
                )}
            </main>
        </div>
    );
}
