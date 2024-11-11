// context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태

    // 컴포넌트가 마운트될 때 로컬 스토리지에서 토큰을 확인하여 로그인 상태와 사용자 정보를 설정
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Retrieved Token:', token); // 토큰 값을 콘솔에 출력합니다.

        if (token) {
            setIsAuthenticated(true);
            fetchUserData(token); // 토큰으로 사용자 정보 가져오기
        }
    }, []);

    // 로그인 시 호출하여 로그인 상태와 사용자 정보를 업데이트
    const login = async (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
        console.log('Token saved in localStorage:', token); // 저장된 토큰을 콘솔에 출력
        await fetchUserData(token); // 토큰으로 사용자 정보 가져오기
    };

    // 로그아웃 시 로그인 상태와 사용자 정보를 초기화
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    };

    // 사용자 정보를 가져오는 비동기 함수
    const fetchUserData = async (token) => {
        try {
            const response = await fetch('/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData); // 사용자 정보를 상태에 저장
            } else if (response.status === 403) {
                logout(); // 인증 실패 시 로그아웃 처리
                console.error('Unauthorized access - logging out.');
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('An error occurred while fetching user data:', error);
        }
    };

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
