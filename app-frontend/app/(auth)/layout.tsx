import { ReactNode } from 'react';

export const metadata = {
    title: 'Acesso — Cash2Comex',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0B0F12] text-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
            <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">{children}</div>
            </div>
        </div>
    );
}
