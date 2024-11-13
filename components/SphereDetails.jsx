// components/SphereDetails.jsx
import React from 'react';
import Image from 'next/image';
import locationIcon from '/public/location-icon-black.svg';

// sphere location,city 로딩 코드 수정(wrong child 문제)

const SphereDetails = ({ briefIntro, location, address, additionalImages = [], placeStory }) => (
    <section className="pb-4 space-y-2">
        {/* 스피어 설명 */}
        <p className="text-lg pb-4" style={{ whiteSpace: 'pre-line' }}>
            {briefIntro}
        </p>
        {/* 장소 기본정보 */}
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 ">
            <h2 className="text-xl font-bold">
                {typeof location === 'object' && location !== null ? location.address || '주소 정보 없음' : location}
            </h2>
            <div className="flex items-center justify-center space-x-2">
                <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                <span>{address || '세부 주소 정보 없음'}</span>
            </div>
        </div>
        {/* 장소 사진 */}
        <div className="pt-4 space-y-4">
            {additionalImages.length > 0 ? (
                additionalImages.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt={`Location Image ${index + 1}`}
                        width={500}
                        height={300}
                        className="w-full"
                    />
                ))
            ) : (
                <p className="text-center text-gray-600">이미지가 없습니다.</p>
            )}
        </div>
        {/* 장소 스토리 */}
        <p className="text-lg pt-8" style={{ whiteSpace: 'pre-line' }}>
            {placeStory || '장소에 대한 설명이 없습니다.'}
        </p>
    </section>
);

export default SphereDetails;
