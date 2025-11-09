// components/LoadingOnce.tsx
'use client';
import { useEffect, useState } from 'react';

export default function LoadingOnce() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShow(false), 300); // some depois de 300ms
        return () => clearTimeout(t);
    }, []);

    if (!show) return null;

    return (
        <div className="screen_loader fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
            {/* ... seu SVG aqui ... */}
        </div>
    );
}
