// components/ServiceIntro.jsx
'use client';

import React from 'react';
import Image from 'next/image';

const ServiceIntro = () => {
    return (
        <div className="w-full py-10 p-4 bg-white-100 items-center justify-center text-center border-b border-black flex flex-col">
            {' '}
            <h2 className="text-lg font-semibold">
                {' '}
                <Image src="/twosphere-logo-black.svg" alt="TwoSphere Logo" width={183} height={70} />{' '}
            </h2>{' '}
            <p className="mt-4 font-bold">
                {' '}
                투스피어는 비슷한 관심사와 직군을 가진 <br /> 사람들을 연결해주는 프리미엄 모임 서비스입니다{' '}
            </p>{' '}
        </div>
    );
};

export default ServiceIntro;
