'use client';
import Image from 'next/image';
import { NETWORKS } from '@/app/buy/data/networks';

export default function NetworkLogo({ id, size = 20 }: { id: string; size?: number }) {
    const net = NETWORKS.find((n) => n.id.toLowerCase() === id.toLowerCase());
    if (!net)
        return (
            <div
                style={{ width: size, height: size }}
                className="rounded-full bg-white/10 inline-block"
            />
        );

    return (
        <Image
            src={net.icon}
            alt={net.name}
            width={size}
            height={size}
            className="rounded-full object-contain"
        />
    );
}
