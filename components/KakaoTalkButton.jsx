// components/KakaoTalkButton.jsx
'use client';

import React from 'react';
import Image from 'next/image';

const KakaoTalkButton = () => {
    return (
        <div className="fixed bottom-24 kakaobutton-right z-50 bg-transparent rounded-full overflow-hidden">
            <a href="https://pf.kakao.com/_DxabVn" target="_blank" rel="noopener noreferrer" className="block">
                <Image
                    src="/kakaotalk-button.svg"
                    alt="KakaoTalk Channel"
                    width={60}
                    height={60}
                    className="shadow-lg"
                />
            </a>
        </div>
    );
};

export default KakaoTalkButton;
