// app/sphere/[id]/joined/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SphereHeader from '../../../../components/SphereHeader';
import { getSphereDetails } from '@/utils/fetcher';

const JoinedPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [sphere, setSphere] = useState(null); // MongoDB에서 가져온 스피어 데이터 상태
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        const fetchSphereData = async () => {
            try {
                const data = await getSphereDetails(id); // fetcher.js의 getSphereDetails 함수 호출
                setSphere(data); // MongoDB에서 가져온 스피어 데이터 설정
            } catch (err) {
                console.error('Failed to fetch sphere data:', err.message);
                setError('스피어 정보를 불러오는 데 실패했습니다.');
            }
        };

        fetchSphereData();
    }, [id]);

    // 참여 완료 후 확인 버튼 클릭 핸들러
    const handleOkayClick = () => {
        router.push(`/my-spheres`);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!sphere) {
        return <div className="text-center py-10">스피어 정보를 불러오는 중입니다...</div>;
    }

    return (
        <div className="max-w-[500px] space-y-8 text-center">
            <div className="w-full max-w-[500px] h-[150px] overflow-hidden">
                <Image
                    src={sphere.thumbnail} // MongoDB 데이터 사용
                    alt="Sphere Image"
                    width={500}
                    height={300}
                    className="w-full object-cover"
                />
            </div>
            <SphereHeader
                title={sphere.title}
                subtitle={sphere.subtitle} // MongoDB 데이터 사용
                place={sphere.place} // MongoDB 데이터 사용
                firstDate={sphere.firstDate} // MongoDB 데이터 사용
                secondDate={sphere.secondDate} // MongoDB 데이터 사용
                time={sphere.time}
            />

            <section className="pb-4 space-y-4">
                <h2 className="text-xl font-bold">참여 신청이 완료되었습니다!</h2>
                <p className="text-sm mx-auto max-w-[300px] py-4 space-y-2 border border-black rounded-xl">
                    참여비 : 20,000원 <br />
                    계좌 : 토스 112119114111 <br />
                </p>
                <p className="text-sm text-gray-600">
                    위 계좌로 참여비 입금 시 참여 확정되며
                    <br />
                    안내 문자를 보내드립니다.
                </p>
            </section>

            {/* 확인 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button onClick={handleOkayClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                    확인
                </button>
            </div>
        </div>
    );
};

export default JoinedPage;
