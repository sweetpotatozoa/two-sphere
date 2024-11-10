// app/layout.js
import './globals.css';
import ClientLayout from './ClientLayout';
import clientPromise from '@/lib/mongodb';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
    title: '투스피어',
    description: '취향의 궤도가 만나는 두 번의 특별한 순간, TwoSphere',
};

export default function RootLayout({ children }) {
    clientPromise.then(() => {
        // 연결 테스트
    });

    return (
        <html lang="en">
            <body className="antialiased">
                <AuthProvider>
                    <ClientLayout>{children}</ClientLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
