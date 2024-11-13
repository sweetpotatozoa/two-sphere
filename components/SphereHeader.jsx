// components/SphereHeader.jsx
import React from 'react';
import Image from 'next/image';
import locationIcon from '/public/location-icon-black.svg';
import calendarIcon from '/public/calendar-icon-black.svg';

const SphereHeader = ({ title, description, location, date }) => (
    <section className="border-b border-black pb-8">
        <h1 className="text-2xl font-extrabold mb-1">{title}</h1>
        <p className="mb-4 font-bold">{description}</p>
        <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center justify-center space-x-2">
                <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                <span>{location}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <Image src={calendarIcon} alt="Calendar Icon" width={16} height={16} />
                <span>{date}</span>
            </div>
        </div>
    </section>
);

export default SphereHeader;
