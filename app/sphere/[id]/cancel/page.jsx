// app/sphere/[id]/cancel/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getIsRefundable, cancelReservation } from '@/utils/fetcher'; // fetcher.js 함수 사용
import SphereHeader from '../../../../components/SphereHeader';
import jwt from 'jsonwebtoken';

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
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [sphereStatus, setSphereStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReasonOptions, setShowReasonOptions] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [showBankOptions, setShowBankOptions] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
        const fetchSphereStatus = async () => {
            try {
                const status = await getIsRefundable(id); // fetcher.js 함수 호출
                setSphereStatus(status);
            } catch (err) {
                setError('스피어 상태를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSphereStatus();
    }, [id]);

    if (isLoading) {
        return <div className="text-center py-10">스피어 상태를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!sphereStatus) {
        return <div className="text-center py-10 text-gray-500">스피어 상태를 확인할 수 없습니다.</div>;
    }

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
        setShowReasonOptions(false);
    };

    const handleAccountChange = (e) => {
        setAccountNumber(e.target.value.replace(/\D/g, '')); // 숫자만 허용
    };

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setShowBankOptions(false);
    };

    const handleConfirmClick = async () => {
        if (!isFormComplete) return;

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwt.decode(token);
                const userId = decodedToken?.user?.id || decodedToken?.userId;

                if (!userId) throw new Error('UserId is missing in token payload');

                const cancelData = {
                    bank: selectedBank,
                    account: accountNumber,
                    reason: selectedReason === '직접 입력' ? cancelReason : selectedReason,
                };

                await cancelReservation(id, cancelData, token);
                setShowCompletionModal(true);
            } else {
                setError('유효하지 않은 토큰입니다.');
            }
        } catch (error) {
            console.error('취소 요청 실패:', error.message);
            alert('취소 요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const isFormComplete =
        (!sphereStatus.isRefundable || (accountNumber.trim() && selectedBank.trim())) && // 환불 가능 시 필수 입력
        selectedReason.trim() && // 취소 사유 선택
        (selectedReason !== '직접 입력' || cancelReason.trim()); // '직접 입력'일 경우 이유 필요

    const handleCompletionConfirm = () => {
        router.push('/');
    };

    return (
        <div className="max-w-[500px] mx-auto space-y-8 text-center px-4 pt-8">
            {/* 환불 가능할 경우 UI */}
            {sphereStatus.isRefundable && (
                <div className="max-w-[500px] mx-auto px-4 space-y-4">
                    {/* 은행 선택 */}
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

                    {/* 계좌번호 입력 */}
                    <div className="space-y-4">
                        <label className="block text-left font-medium">계좌번호</label>
                        <input
                            type="text"
                            placeholder="참여를 환불받을 계좌를 입력해주세요"
                            value={accountNumber}
                            onChange={handleAccountChange}
                            className="w-full p-3 border border-gray-300 rounded-xl"
                        />
                        <p className="text-xs text-gray-500">
                            입력해주신 계좌로 참여비 환불 완료 시 안내 문자를 보내드립니다.
                        </p>
                    </div>
                </div>
            )}

            {/* 취소 사유 선택 */}
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

            {/* 확인 버튼 */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleConfirmClick}
                    disabled={!isFormComplete}
                    className={`w-full py-3 font-bold rounded-xl ${
                        isFormComplete ? 'bg-black text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                >
                    확인
                </button>
            </div>

            {/* 완료 모달 */}
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
