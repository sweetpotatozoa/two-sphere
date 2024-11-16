import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SphereParticipants = ({ participants = [], canNotViewNamesAndImages }) => {
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [user, setUser] = useState(null);

    // 사용자 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // 토큰 가져오기
            if (!token) return; // 토큰이 없으면 아무 작업도 하지 않음

            try {
                const response = await fetch('/api/my-profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // 사용자 데이터 설정
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

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

    const canViewAllDetails = user?.role === 'admin' || !canNotViewNamesAndImages;

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
                            {/* 여기 아래서 페이지 원 안의 텍스트 수정할 수 있음!!!!!! */}
                            {participants[index] ? (
                                canNotViewNamesAndImages && user?.role !== 'admin' ? (
                                    <div className="text-center text-xs font-bold">
                                        <p>{participants[index]?.age || '나이대 정보 없음'}</p>
                                        {/* <p className="text-xs">{participants[index]?.sex || '성별 정보 없음'}</p> */}
                                        <p className="text-sm">{participants[index]?.job || '직업 간략소개 없음'}</p>
                                        {/* 공백 포함 15글자 */}
                                        {/* <p className="text-sm">{participants[index]?.jobStatus || '직업 정보 없음'}</p> */}
                                    </div>
                                ) : participants[index]?.image ? (
                                    <Image
                                        src={participants[index].image}
                                        alt="Participant Image"
                                        width={40}
                                        height={40}
                                        className="size-full rounded-full"
                                    />
                                ) : (
                                    <p className="text-base font-bold text-white">
                                        {participants[index]?.name || '이름 없음'}
                                    </p>
                                )
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
                    <div className="bg-white rounded-xl max-w-[400px] w-full mx-4 p-6 space-y-4 text-center relative overflow-y-auto max-h-[80vh]">
                        {/* 검정색 원 */}
                        <div className="relative w-32 h-32 mx-auto">
                            {/* 여기 아래서 모달 원 안의 텍스트 수정할 수 있음!!!!!! */}
                            {canNotViewNamesAndImages && user?.role !== 'admin' ? (
                                <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center mx-auto">
                                    <div className="text-center text-base font-bold text-white">
                                        <p>{selectedParticipant?.age || '나이대 정보 없음'}</p>
                                        {/* <p className="text-xs">{selectedParticipant?.sex || '성별 정보 없음'}</p> */}
                                        <p className="text-lg">{selectedParticipant?.job || '직업 간략소개 없음'}</p>
                                        {/* 공백 포함 15글자 */}
                                        {/* <p className="text-lg">{selectedParticipant?.jobStatus || '직업 정보 없음'}</p> */}
                                    </div>
                                </div>
                            ) : selectedParticipant?.image ? (
                                <Image
                                    src={selectedParticipant.image}
                                    alt="Participant Image"
                                    width={90}
                                    height={90}
                                    className="size-full rounded-full mx-auto"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center mx-auto">
                                    <p className="text-2xl font-bold text-white">
                                        {selectedParticipant?.name || '이름 없음'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 이름이 한 번 더 표시 (career 보다 한 계층 높음) */}
                        {/* 입금 완료 한 사람에게 뜨는 실명 프로필 */}
                        {!canNotViewNamesAndImages && (
                            <div className="text-xl font-bold mt-4">
                                {selectedParticipant?.name || '이름 없음'} |{'  '}
                                {selectedParticipant?.age || '나이대 정보 없음'} |{'  '}
                                {selectedParticipant?.job || '직업 정보 없음'}
                            </div>
                        )}

                        {canViewAllDetails && (
                            <>
                                <div className="text-xl font-bold mt-4">
                                    {selectedParticipant?.name || '이름 없음'} |{' '}
                                    {selectedParticipant?.age || '나이대 정보 없음'} |{' '}
                                    {selectedParticipant?.job || '직업 정보 없음'}
                                </div>
                                <p className="text-gray-600">
                                    전화번호: {selectedParticipant?.phoneNumber || '전화번호 없음'}
                                </p>
                            </>
                        )}

                        {/* career */}
                        <p className="text-gray-500 font-bold">{selectedParticipant?.career || '경력 정보 없음'}</p>

                        {/* 질문 및 답변 */}
                        <div className="space-y-4 text-left mt-16">
                            {questions.map((question, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold">
                                        Q{index + 1}. {question}
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedParticipant?.answers && selectedParticipant.answers[index]
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
