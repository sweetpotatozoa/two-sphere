import React from 'react';
import { useRouter } from 'next/navigation';

const CancelNoRefundModal = ({ onClose, id }) => {
    const router = useRouter();

    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-[calc(100vh-3rem)] z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-80 p-6 rounded-lg shadow-lg text-center">
                    <p className="text-sm font-medium mb-4">
                        참여 취소한 Sphere는 다시 참여할 수 없습니다.
                        <br />
                        <br />
                        시작 전 24시간 이내 취소 또는 참여비 미입금으로
                        <br />
                        참여비가 환불되지 않습니다
                        <br />
                        <br />
                        정말 취소하시겠습니까?
                    </p>
                    <div className="flex space-x-4 justify-center mt-4">
                        <button onClick={onClose} className="w-full py-2 bg-black text-white font-bold rounded-xl">
                            아니요
                        </button>
                        <button
                            onClick={() => {
                                router.push(`/sphere/${id}/cancel`);
                            }}
                            className="w-full py-2 bg-gray-200 text-black font-bold rounded-xl"
                        >
                            네
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelNoRefundModal;
