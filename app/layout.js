import './globals.css';
import ClientLayout from './ClientLayout';
import clientPromise from '@/lib/mongodb';

export const metadata = {
    title: '투스피어 - 취향의 궤도가 만나는 두 번의 특별한 순간',
    description: '소규모 프리미엄 소셜 살롱. 일회성 만남이 아닐 양질의 네트워킹을 추구합니다.',
    icons: {
        icon: '/favicon.svg',
    },
    openGraph: {
        title: '투스피어 - 취향의 궤도가 만나는 두 번의 특별한 순간',
        description: '소규모 프리미엄 소셜 살롱. 일회성 만남이 아닐 양질의 네트워킹을 추구합니다.',
        siteName: '투스피어 - 취향의 궤도가 만나는 두 번의 특별한 순간',
        images: [
            {
                url: 'https://twosphere.kr/og_image.svg',
                width: 800,
                height: 400,
                alt: '투스피어 - 취향의 궤도가 만나는 두 번의 특별한 순간',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '투스피어 - 취향의 궤도가 만나는 두 번의 특별한 순간',
        description: '소규모 프리미엄 소셜 살롱. 일회성 만남이 아닐 양질의 네트워킹을 추구합니다.',
        images: ['https://twosphere.kr/og_image.svg'],
    },
};

export default function RootLayout({ children }) {
    clientPromise.then(() => {
        // 연결 테스트
    });

    return (
        <html lang="en">
            <body className="antialiased tracking-tighter">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
