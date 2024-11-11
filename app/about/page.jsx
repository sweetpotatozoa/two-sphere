// app/about/page.jsx

// app/about/page.jsx
'use client';

import Image from 'next/image';
import NetworkingIcon from '/public/networking.svg';
import FBIcon from '/public/f&b.svg';

export default function AboutPage() {
    return (
        <div className=" flex flex-col items-center bg-white relative">
            {/* Main Content */}
            <div className="text-center mt-8 px-4">
                <h2 className="text-s mb-6 font-bold text-zinc-800 font-['Pretendard Variable'] leading-none mb-4">
                    취향의 궤도가 만나는 두 번의 특별한 순간
                </h2>

                <Image
                    src="/twosphere-logo-black.svg"
                    alt="Two Sphere Title"
                    width={212}
                    height={72}
                    className="mx-auto"
                />

                <div className="border-t border-zinc-800 w-full my-8"></div>
            </div>

            <div className="px-4">
                <p className="text-s text-zinc-800 font-normal font-['Pretendard Variable'] leading-tight text-center mb-6">
                    Two Sphere는 일회성 만남이 아닌, 나와 관련된 주제로 맞닿아 있는 사람들과
                    <br />
                    양질의 네트워킹을 통해 스피어를 확장할 수 있도록 돕는 서비스입니다.
                    <br />
                    <br />
                    ‘스피어’는 멤버들이 속하는 특별한 공간과 순간을 의미합니다
                    <br />
                    <br />
                    각각의 ‘스피어’는 둥글고 완전한 형태처럼
                    <br />
                    다양한 참여자가 하나로 모여 조화롭게 소통하고 교류할 수 있는 장입니다.
                    <br />
                </p>
            </div>

            {/* Icons and Line */}
            <div className="flex items-center justify-center mt-2 mb-6 relative">
                <Image src={NetworkingIcon} alt="Networking" width={144} height={144} className="mr-4" />
                <div className="border-t border-zinc-800 w-24"></div>
                <Image src={FBIcon} alt="F&B" width={144} height={144} className="ml-4" />
            </div>
            <div>
                <p className="text- text-zinc-800 font-extrabold font-['Pretendard Variable'] text-center">
                    Two Sphere에서 취향의 궤도가 겹치는
                    <br />
                    특별한 순간을 맞이해보세요!
                </p>
            </div>
        </div>
    );
}
