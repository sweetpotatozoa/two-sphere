import React from 'react';
import Image from 'next/image';
import locationIcon from '/public/location-icon-black.svg';
import calendarIcon from '/public/calendar-icon-black.svg';

// wrong child 문제로 sphere 하위 객체 불러오는 코드 수정
const SphereHeader = ({ title, subtitle, place, firstDate }) => (
    <section className="border-b border-black pb-8">
        <h1 className="text-2xl font-extrabold mb-1">{title}</h1>
        <p className="mb-4 font-bold">{subtitle}</p>
        <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center justify-center space-x-2">
                <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                <span>{typeof place === 'object' && place !== null ? place.address || '주소 정보 없음' : place}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <Image src={calendarIcon} alt="Calendar Icon" width={16} height={16} />
                <span>{firstDate}</span>
            </div>
        </div>
    </section>
);

export default SphereHeader;
