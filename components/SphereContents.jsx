// components/SphereContents.jsx
import React from 'react';

const SphereContents = ({ questions }) => (
    <section className="pb-8 space-y-4">
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
            <h2 className="text-xl font-bold">사전 과제</h2>
            <p className="text-sm text-gray-600">아래의 질문에 대한 미리 답변을 준비해주세요</p>
        </div>
        <ul className="list-disc ml-6 pt-8 space-y-1 text-left inline-block">
            {questions.map((question, index) => (
                <li key={index}>{question}</li>
            ))}
        </ul>
    </section>
);

export default SphereContents;
