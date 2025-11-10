'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    function validate() {
        const e: typeof errors = {};
        if (!form.email) e.email = 'Informe seu e-mail.';
        if (!form.password) e.password = 'Digite sua senha.';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // FRONT-ONLY: simula login
        setTimeout(() => {
            setLoading(false);
            console.log('Login ✅', form);
            // redirecione para o dashboard/compra/etc conforme sua navegação
            window.location.href = '/buy';
        }, 900);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur"
        >
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-2xl bg-emerald-500/15">
                    <span className="text-emerald-400">C2C</span>
                </div>
                <h1 className="text-xl font-semibold">Bem-vindo de volta</h1>
                <p className="mt-1 text-sm text-white/60">Acesse sua conta para continuar</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div className={`overflow-hidden rounded-xl border bg-black/20
                 ${errors.email ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/25'}`}>
                    <div className="grid grid-cols-[1fr_auto] items-center px-3">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-white/50" />
                            <input
                                type="email"
                                placeholder="voce@email.com"
                                autoComplete="email"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                value={form.email}
                                onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
                                className="h-12 w-full bg-transparent text-white/90 placeholder-white/40 outline-none border-0"
                            />
                        </div>
                        {/* botão opcional do lado direito, se quiser (ex: limpar) */}
                        {/* <button className="rounded-lg p-2 text-white/60 hover:bg-white/10">…</button> */}
                    </div>
                </div>

                {/* Senha */}
                <div className={`overflow-hidden rounded-xl border bg-black/20
                 ${errors.password ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/25'}`}>
                    <div className="grid grid-cols-[1fr_auto] items-center px-3">
                        <div className="flex items-center gap-2">
                            <Lock size={16} className="text-white/50" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Sua senha"
                                autoComplete="new-password" /* no login use current-password */
                                value={form.password}
                                onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
                                className="h-12 w-full bg-transparent text-white/90 placeholder-white/40 outline-none border-0"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPass(s => !s)}
                            className="ml-2 rounded-lg p-2 text-white/60 hover:bg-white/10"
                            aria-label="Alternar visibilidade da senha"
                        >
                            {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-white/70">
                        <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
                        Lembrar de mim
                    </label>
                    <Link href="#" className="text-emerald-300 hover:text-emerald-200">Esqueci minha senha</Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 w-full overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-400/20 disabled:opacity-50"
                >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition group-hover:translate-x-full" />
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Entrando...
            </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
              Entrar <ArrowRight size={16} />
            </span>
                    )}
                </button>

                {/* Divider */}
                <div className="my-2 flex items-center gap-3 text-xs text-white/40">
                    <div className="h-px flex-1 bg-white/10" />
                    ou
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Social Placeholder */}
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-white/80 hover:border-white/25">
                        Google
                    </button>
                    <button type="button" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-white/80 hover:border-white/25">
                        Apple
                    </button>
                </div>

                {/* Link to register */}
                <p className="mt-4 text-center text-sm text-white/60">
                    Não tem conta?{' '}
                    <Link href="/register" className="text-emerald-300 hover:text-emerald-200">
                        Criar conta
                    </Link>
                </p>
            </form>
        </motion.div>
    );
}
