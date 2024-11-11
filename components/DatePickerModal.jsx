// components/DatePickerModal.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

const DatePickerModal = ({ onClose, onSelectDate }) => {
    const [selectedYear, setSelectedYear] = useState(2000);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);

    const itemHeight = 40; // 각 항목의 높이
    const years = Array.from({ length: 100 }, (_, i) => 2023 - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const yearRef = useRef(null);
    const monthRef = useRef(null);
    const dayRef = useRef(null);

    const centerIndex = 2; // 중앙에 표시되는 인덱스 (0부터 시작하므로 2는 3번째 항목)

    // 중앙에 있는 항목 선택을 위한 함수
    const handleScrollEnd = (ref, items, setFunction) => {
        const index = Math.round(ref.current.scrollTop / itemHeight);
        ref.current.scrollTo({
            top: index * itemHeight,
            behavior: 'smooth',
        });
        setFunction(items[index]);
    };

    // 스크롤 및 드래그 설정 함수
    const addDragFunctionality = (ref, items, setFunction) => {
        let isDown = false;
        let startY;
        let scrollTop;

        const handleMouseDown = (e) => {
            isDown = true;
            startY = e.pageY - ref.current.offsetTop;
            scrollTop = ref.current.scrollTop;
        };

        const handleMouseLeave = () => {
            isDown = false;
        };

        const handleMouseUp = () => {
            isDown = false;
            handleScrollEnd(ref, items, setFunction);
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - ref.current.offsetTop;
            const walk = (y - startY) * 1.5;
            ref.current.scrollTop = scrollTop - walk;
        };

        return {
            handleMouseDown,
            handleMouseLeave,
            handleMouseUp,
            handleMouseMove,
        };
    };

    const yearHandlers = addDragFunctionality(yearRef, years, setSelectedYear);
    const monthHandlers = addDragFunctionality(monthRef, months, setSelectedMonth);
    const dayHandlers = addDragFunctionality(dayRef, days, setSelectedDay);

    const formatSelectedDate = () => {
        return `${selectedYear}년 ${selectedMonth}월 ${selectedDay}일`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-72 p-6 rounded-lg text-center">
                <h2 className="text-lg font-bold mb-4">생년월일 선택</h2>
                <div className="flex justify-around items-center space-x-2 overflow-hidden relative">
                    {/* 중앙 선택 배경 */}
                    <div
                        className="absolute w-full"
                        style={{
                            top: `${centerIndex * itemHeight}px`,
                            height: `${itemHeight}px`,
                            backgroundColor: 'rgba(200, 200, 200, 0.3)',
                            borderRadius: '8px',
                            zIndex: 0,
                        }}
                    ></div>

                    {/* Year Picker */}
                    <div
                        className="flex flex-col items-center overflow-hidden"
                        ref={yearRef}
                        onMouseDown={yearHandlers.handleMouseDown}
                        onMouseLeave={yearHandlers.handleMouseLeave}
                        onMouseUp={yearHandlers.handleMouseUp}
                        onMouseMove={yearHandlers.handleMouseMove}
                        style={{ height: `${itemHeight * 5}px` }}
                    >
                        <div className="overflow-y-scroll scrollbar-hide h-full">
                            {years.map((year, index) => (
                                <div
                                    key={year}
                                    className={`py-2 text-center ${
                                        year === selectedYear ? 'text-black font-bold' : 'text-gray-400'
                                    }`}
                                    style={{
                                        height: `${itemHeight}px`,
                                        fontWeight: index === centerIndex ? 'bold' : 'normal',
                                    }}
                                >
                                    {year}년
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Month Picker */}
                    <div
                        className="flex flex-col items-center overflow-hidden"
                        ref={monthRef}
                        onMouseDown={monthHandlers.handleMouseDown}
                        onMouseLeave={monthHandlers.handleMouseLeave}
                        onMouseUp={monthHandlers.handleMouseUp}
                        onMouseMove={monthHandlers.handleMouseMove}
                        style={{ height: `${itemHeight * 5}px` }}
                    >
                        <div className="overflow-y-scroll scrollbar-hide h-full">
                            {months.map((month, index) => (
                                <div
                                    key={month}
                                    className={`py-2 text-center ${
                                        month === selectedMonth ? 'text-black font-bold' : 'text-gray-400'
                                    }`}
                                    style={{
                                        height: `${itemHeight}px`,
                                        fontWeight: index === centerIndex ? 'bold' : 'normal',
                                    }}
                                >
                                    {month}월
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day Picker */}
                    <div
                        className="flex flex-col items-center overflow-hidden"
                        ref={dayRef}
                        onMouseDown={dayHandlers.handleMouseDown}
                        onMouseLeave={dayHandlers.handleMouseLeave}
                        onMouseUp={dayHandlers.handleMouseUp}
                        onMouseMove={dayHandlers.handleMouseMove}
                        style={{ height: `${itemHeight * 5}px` }}
                    >
                        <div className="overflow-y-scroll scrollbar-hide h-full">
                            {days.map((day, index) => (
                                <div
                                    key={day}
                                    className={`py-2 text-center ${
                                        day === selectedDay ? 'text-black font-bold' : 'text-gray-400'
                                    }`}
                                    style={{
                                        height: `${itemHeight}px`,
                                        fontWeight: index === centerIndex ? 'bold' : 'normal',
                                    }}
                                >
                                    {day}일
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        onSelectDate(formatSelectedDate());
                        onClose();
                    }}
                    className="mt-4 w-full py-3 bg-black text-white rounded-full font-bold"
                >
                    선택하기
                </button>
            </div>
        </div>
    );
};

export default DatePickerModal;
