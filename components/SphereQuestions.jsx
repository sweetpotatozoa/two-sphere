// components/SphereQuestions.jsx
// 메서드 호출 TypeError 수정
import React from 'react';

const SphereContents = ({ questions }) => (
    <section className="pb-12 space-y-4">
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4">
            <h2 className="text-xl font-bold">사전 과제</h2>
            <p className="text-sm text-gray-600">아래의 질문을 참고해 답변을 작성해주세요.</p>
        </div>
        <ul className="list-disc ml-6 pt-4 space-y-1 text-left inline-block">
            {(questions || []).map((question, index) => (
                <li key={index}>{question}</li>
            ))}
        </ul>
    </section>
);

export default SphereContents;
