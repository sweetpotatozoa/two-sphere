// app/layout.js
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
    title: '투스피어',
    description: '취향의 궤도가 만나는 두 번의 특별한 순간, TwoSphere',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
