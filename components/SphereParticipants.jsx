// components/SphereParticipants.jsx
import React from 'react';

const SphereParticipants = ({ participants }) => (
    <section className="pb-28 pb-16 space-y-4">
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
            <h2 className="text-xl font-bold">참여자 현황</h2>
            <p className="text-sm text-gray-600">버튼을 눌러 프로필을 조회해보세요</p>
        </div>
        <div className="relative w-32 h-32 mx-auto">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className={`absolute w-20 h-20 flex items-center justify-center rounded-full border-2 ${
                        participants[index] ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'
                    }`}
                    style={{
                        top: index === 0 ? '0%' : index === 2 ? '100%' : '50%',
                        left: index === 1 ? '0%' : index === 3 ? '100%' : '50%',
                        transform: 'translate(-50%, 0%)',
                    }}
                >
                    {participants[index] ? (
                        <span className="text-center text-sm font-bold">{participants[index]}</span>
                    ) : (
                        <span>&nbsp;</span>
                    )}
                </div>
            ))}
        </div>
    </section>
);

export default SphereParticipants;
