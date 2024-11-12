'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../../data/sphereData';
import SphereHeader from '../../../../components/SphereHeader';
import { cancelReservation } from '@/utils/fetcher';

const bankList = [
    '한국은행',
    '산업은행',
    '기업은행',
    '국민은행',
    '외환은행',
    '수협중앙회',
    '수출입은행',
    '농협은행',
    '지역농.축협',
    '우리은행',
    'SC은행',
    '한국씨티은행',
    '대구은행',
    '부산은행',
    '광주은행',
    '제주은행',
    '전북은행',
    '경남은행',
    '새마을금고중앙회',
    '신협중앙회',
    '우체국',
    '신용보증기금',
    '기술보증기금',
    'KEB하나은행',
    '신한은행',
    '케이뱅크',
    '카카오뱅크',
    '토스뱅크',
];

const CancelComplete = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [showReasonOptions, setShowReasonOptions] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [showBankOptions, setShowBankOptions] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false); // State for completion modal

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
        setShowReasonOptions(false);
    };

    const handleAccountChange = (e) => {
        setAccountNumber(e.target.value);
    };

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setShowBankOptions(false);
    };

    const handleConfirmClick = async () => {
        if (!isFormComplete) return; // 입력이 완료되지 않은 경우 함수 실행 중단

        try {
            // API로 전송할 데이터 구성
            const cancelData = {
                bank: selectedBank,
                accountNumber,
                reason: selectedReason === '직접 입력' ? cancelReason : selectedReason,
            };

            // 취소 API 호출
            await cancelReservation(id, cancelData);

            // 성공적으로 처리된 경우 모달 표시
            setShowCompletionModal(true);
        } catch (error) {
            // 에러 발생 시 로그 출력 및 사용자 알림
            console.error('취소 요청 실패:', error.message);
            alert('취소 요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleCompletionConfirm = () => {
        router.push('/');
    };

    // 모든 필수 항목이 입력되었는지 확인
    const isFormComplete =
        accountNumber && selectedBank && selectedReason && (selectedReason !== '직접 입력' || cancelReason);

    return (
        <div className="max-w-[500px] mx-auto space-y-8 text-center">
            <div className="w-full max-w-[500px] h-[100px] overflow-hidden">
                <Image
                    src={sphere.image}
                    alt="Sphere Image"
                    width={500}
                    height={300}
                    className="w-full object-cover object-center"
                />
            </div>
            <SphereHeader
                title={sphere.title}
                description={sphere.description}
                location={sphere.location}
                date={sphere.date}
            />

            <div className="max-w-[500px] mx-auto px-4 space-y-4">
                {/* Bank Selection */}
                <div className="space-y-4">
                    <label className="block text-left font-medium">은행 선택</label>
                    <div
                        className="w-full p-3 border border-gray-300 rounded-xl cursor-pointer"
                        onClick={() => setShowBankOptions(!showBankOptions)}
                    >
                        {selectedBank || '은행을 선택해주세요'}
                    </div>
                    {showBankOptions && (
                        <div className="w-full border border-gray-300 rounded-xl mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                            {bankList.map((bank) => (
                                <div
                                    key={bank}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleBankSelect(bank)}
                                >
                                    {bank}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Account Number Input */}
                <div className="space-y-4">
                    <label className="block text-left font-medium">계좌번호</label>
                    <input
                        type="text"
                        placeholder="참여를 환불받을 계좌를 입력해주세요"
                        value={accountNumber}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                            handleAccountChange({ target: { value: onlyNumbers } });
                        }}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                        입력해주신 계좌로 참여비 환불 완료 시 안내 문자를 보내드립니다.
                    </p>
                </div>

                {/* Cancel Reason */}
                <div className="space-y-4">
                    <label className="block text-left font-medium">취소사유</label>
                    <div
                        className="w-full p-3 border border-gray-300 rounded-xl cursor-pointer"
                        onClick={() => setShowReasonOptions(!showReasonOptions)}
                    >
                        {selectedReason || '취소사유를 선택해주세요'}
                    </div>
                    {showReasonOptions && (
                        <div className="w-full border border-gray-300 rounded-xl mt-2 bg-white shadow-lg">
                            {['단순 변심', '일정 변동', '다른 참여자에 대한 불만', '직접 입력'].map((reason) => (
                                <div
                                    key={reason}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleReasonSelect(reason)}
                                >
                                    {reason}
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedReason === '직접 입력' && (
                        <input
                            type="text"
                            placeholder="취소사유를 직접 입력해주세요"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl mt-2"
                        />
                    )}
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleConfirmClick}
                        disabled={!isFormComplete} // 버튼 비활성화 조건 추가
                        className={`w-full py-3 font-bold rounded-xl ${
                            isFormComplete ? 'bg-black text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                    >
                        확인
                    </button>
                </div>
            </div>

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-80 p-6 rounded-xl shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">취소 신청이 완료되었습니다</p>
                        <button
                            onClick={handleCompletionConfirm}
                            className="w-full py-2 bg-black text-white font-bold rounded-xl"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancelComplete;
