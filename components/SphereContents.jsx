// components/SphereContents.jsx
import React from 'react';

const SphereContents = ({ questions }) => (
    <section className="pb-6 space-y-4">
        <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
            <h2 className="text-xl font-bold">Sphere Contents</h2>
        </div>
        <ul className="list-disc ml-6 space-y-1 text-left inline-block">
            {questions.map((question, index) => (
                <li key={index}>{question}</li>
            ))}
        </ul>
    </section>
);

export default SphereContents;
