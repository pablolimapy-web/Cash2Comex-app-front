'use client';
import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    right?: React.ReactNode;
    placeholder?: string;
};

export default function AmountInput({ label, value, onChange, right, placeholder }: Props) {
    const id = useId();
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <label htmlFor={id} className="text-xs text-white/60">{label}</label>
            <div className="mt-2 flex items-center gap-3">
                <input
                    id={id}
                    inputMode="decimal"
                    placeholder={placeholder ?? "0,00"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-lg text-white/90 outline-none focus:border-white/25"
                />
                {right}
            </div>
        </div>
    );
}
