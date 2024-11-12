import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SphereParticipants = ({ participants }) => {
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    useEffect(() => {
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [selectedParticipant]);

    const handleParticipantClick = (participant) => {
        setSelectedParticipant(participant);
    };

    const closeModal = () => {
        setSelectedParticipant(null);
    };

    const questions = [
        '현재 어떤 일을 하고 있는지 알려주세요.',
        '나를 가장 잘 표현하는 세 가지 단어는 무엇인가요?',
        '가장 몰입하는 순간은 언제인가요?',
        '인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
        '다른 사람들에게 어떻게 기억되고 싶나요?',
    ];

    return (
        <section className="pb-12 space-y-4">
            <div className="border-t border-b border-black mx-auto max-w-[300px] py-4">
                <h2 className="text-xl font-bold">참여자 현황</h2>
                <p className="text-sm text-gray-600">버튼을 눌러 프로필을 조회해보세요</p>
            </div>
            <div className="pt-16 flex justify-center items-center">
                <div className="relative w-32 h-32">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className={`absolute w-20 h-20 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                                participants[index] ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'
                            }`}
                            style={{
                                top: index === 0 ? '0%' : index === 2 ? '100%' : '50%',
                                left: index === 1 ? '0%' : index === 3 ? '100%' : '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                            onClick={() => participants[index] && handleParticipantClick(participants[index])}
                        >
                            {participants[index] ? (
                                <div className="text-center text-sm font-bold">
                                    <p>{participants[index].name}</p>
                                    <p className="text-xs">{participants[index].career}</p>
                                </div>
                            ) : (
                                <span>&nbsp;</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 모달 */}
            {selectedParticipant && (
                <div
                    className="fixed left-0 top-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    style={{ margin: 0, padding: 0 }}
                >
                    <div className="bg-white rounded-xl max-w-[400px] w-full mx-4 p-6 space-y-4 text-center relative">
                        <h2 className="text-xl font-bold">{selectedParticipant.name}의 프로필</h2>
                        <p className="text-gray-600">{selectedParticipant.career}</p>
                        <div className="space-y-4 text-left">
                            {questions.map((question, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold">
                                        Q{index + 1}. {question}
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedParticipant.answers && selectedParticipant.answers[index]
                                            ? selectedParticipant.answers[index]
                                            : '아직 프로필을 완성하지 않았습니다.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-black text-white rounded-xl">
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SphereParticipants;
