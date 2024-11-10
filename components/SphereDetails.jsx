// components/SphereDetails.jsx
import React from 'react';
import Image from 'next/image';
import locationIcon from '/public/location-icon-black.svg';

const SphereDetails = ({ briefIntro, location, address, additionalImages, placeStory }) => (
    <section className="pb-4 space-y-4">
        <p className="text-lg pb-4" style={{ whiteSpace: 'pre-line' }}>
            {briefIntro}
        </p>
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
            <h2 className="text-xl font-bold">{location}</h2>
            <div className="flex items-center justify-center space-x-2">
                <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                <span>{address}</span>
            </div>
        </div>
        {additionalImages.map((img, index) => (
            <Image
                key={index}
                src={img}
                alt={`Location Image ${index + 1}`}
                width={500}
                height={300}
                className="w-full pt-4"
            />
        ))}
        <p className="text-lg pt-4 pb-4" style={{ whiteSpace: 'pre-line' }}>
            {placeStory}
        </p>
    </section>
);

export default SphereDetails;
