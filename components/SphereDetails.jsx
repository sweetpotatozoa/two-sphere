// components/SphereDetails.jsx
import React from 'react';
import Image from 'next/image';
import locationIcon from '/public/location-icon-black.svg';

const SphereDetails = ({ description, place, subImage1, subImage2, placeStory }) => (
    <section className="pb-4 space-y-4">
        {/* 스피어 설명 */}
        <p className="text-md pb-4" style={{ whiteSpace: 'pre-line' }}>
            {description}
        </p>

        {/* 장소 기본정보 */}
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 ">
            <h2 className="text-xl font-bold">
                {typeof place === 'object' && place !== null ? place.name || '장소 이름 없음' : place}
            </h2>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-2">
                <Image src={locationIcon} alt="Location Icon" width={12} height={12} />
                <span>{place.address || '장소 주소 없음'}</span>
            </div>
        </div>

        {/* 장소 사진 */}
        <div className="pt-8 space-y-4">
            {subImage1 ? (
                <Image
                    src={subImage1}
                    alt="Location Image 1"
                    width={500}
                    height={300}
                    className="w-full object-cover rounded-lg"
                />
            ) : (
                <p className="text-center text-gray-600">이미지가 없습니다.</p>
            )}
            {subImage2 ? (
                <Image
                    src={subImage2}
                    alt="Location Image 2"
                    width={500}
                    height={300}
                    className="w-full object-cover rounded-lg"
                />
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
