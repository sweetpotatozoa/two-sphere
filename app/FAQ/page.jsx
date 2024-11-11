'use client';

import { useState } from 'react';
import arrowDownIcon from '/public/arrow-down-icon.svg';
import arrowRightIcon from '/public/arrow-right-icon.svg';
import Image from 'next/image';

function FAQSection({ title, content, isOpen, onToggle }) {
    return (
        <div className="mb-4">
            <div className="flex items-center cursor-pointer" onClick={onToggle}>
                <Image
                    src={isOpen ? arrowDownIcon : arrowRightIcon}
                    alt="Toggle"
                    width={16}
                    height={16}
                    className="mr-2"
                />
                <span className="text-zinc-800 text-s font-extrabold font-['Pretendard']">{title}</span>
            </div>
            {isOpen && <div className="ml-7 text-zinc-800 text-s font-normal mt-2 font-['Pretendard']">{content}</div>}
        </div>
    );
}

export default function FAQPage() {
    const [openSections, setOpenSections] = useState({
        section1: false,
        section2: false,
        section3: false,
        section4: false,
        section5: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const faqData = [
        {
            id: 'section1',
            title: 'Two Sphere는 왜 두번의 모임으로 진행되나요?',
            content: (
                <>
                    프리미엄 소셜 살롱 서비스 ‘Two Sphere’의 최우선 가치는 참여자분들에게 양질의 모임을 제공하는
                    것입니다. 하나의 Sphere를 2번의 모임으로 운영하면서 참여자 간 더욱 활발한 인터렉션이 가능하도록 하고
                    있습니다.
                </>
            ),
        },
        {
            id: 'section2',
            title: 'Sphere 신청과 취소는 언제까지 가능한가요?',
            content: (
                <>
                    Sphere 신청 및 취소는 첫 모임 시작시간 기준 <span className="font-bold">24시간 전</span>까지
                    가능합니다.
                </>
            ),
        },
        {
            id: 'section3',
            title: '다른 유저의 정보를 어디까지 열람할 수 있나요?',
            content: (
                <>
                    - Sphere 참여 이전 : 나이대/성별/신분/프로필 질문 답변
                    <br />- Sphere 참여 확정 이후 : <span className="font-bold">프로필 사진/이름</span>
                    /나이대/성별/신분/프로필 질문 답변
                </>
            ),
        },
        {
            id: 'section4',
            title: '1회차 모임 참여 이후 2회차 모임은 어떻게 진행되나요?',
            content: (
                <>
                    1회차 모임이 진행된 이후 참여자들에게 개별적으로 모임에 대한 피드백을 묻고 2회차 모임을 취소할 수
                    있는 기간이 주어집니다.
                    <br />
                    2회차 참여 희망 인원이 <span className="underline">3명 이상이라면 모임이 그대로 진행</span>되고,
                    <br />
                    만약 <span className="underline">모임이 취소되었다면 참여자들에게 참여비 50%를 환불</span>
                    해드립니다.
                </>
            ),
        },
        {
            id: 'section5',
            title: 'Sphere 리더는 어떤 역할을 하며 어떻게 정해지나요?',
            content: (
                <>
                    Sphere 리더는 해당 Sphere의 활동을 주도적으로 이끄는 참여자입니다.
                    <br />
                    참여 신청 시 희망여부를 조사하며, 희망자가 2명 이상일 경우 2명 중 임의로 결정되며 희망자가 없을
                    경우에도 참여자 중 임의로 결정됩니다.
                </>
            ),
        },
    ];

    return (
        <div className="px-4">
            <div className="bg-white relative">
                <h1 className="text-center text-zinc-800 text-2xl font-bold font-['Pretendard'] mt-8 mb-8">FAQ</h1>
                <div className="border-t border-[#2b2b2b] my-4" style={{ borderWidth: '0.5px' }}></div>

                {faqData.map((faq) => (
                    <div key={faq.id}>
                        <FAQSection
                            title={faq.title}
                            content={faq.content}
                            isOpen={openSections[faq.id]}
                            onToggle={() => toggleSection(faq.id)}
                        />
                        <div className="border-t border-[#2b2b2b] my-4" style={{ borderWidth: '0.5px' }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
