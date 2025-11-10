'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, UserRound, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    function validate() {
        const e: Partial<typeof form> = {};
        if (!form.name) e.name = 'Informe seu nome.';
        if (!form.email) e.email = 'Informe seu e-mail.';
        if (!form.password) e.password = 'Crie uma senha.';
        if (form.password && form.password.length < 6) e.password = 'Mínimo de 6 caracteres.';
        if (form.password !== form.confirm) e.confirm = 'As senhas não coincidem.';
        if (!form.agree) e.agree = 'Confirme os termos.';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // FRONT-ONLY: simula cadastro
        setTimeout(() => {
            setLoading(false);
            console.log('Cadastro ✅', form);
            window.location.href = '/login';
        }, 1000);
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
                <h1 className="text-xl font-semibold">Criar sua conta</h1>
                <p className="mt-1 text-sm text-white/60">Leva menos de 1 minuto</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                    <label className="mb-1 block text-xs text-white/60">Nome completo</label>
                    <div className={`flex items-center gap-2 rounded-xl border bg-black/20 px-3 ${errors.name ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/25'}`}>
                        <UserRound size={16} className="text-white/50" />
                        <input
                            type="text"
                            placeholder="Seu nome"
                            className="w-full bg-transparent py-3 outline-none"
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

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

                {/* Confirmar senha */}
                <div>
                    <label className="mb-1 block text-xs text-white/60">Confirmar senha</label>
                    <div className={`flex items-center gap-2 rounded-xl border bg-black/20 px-3 ${errors.confirm ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/25'}`}>
                        <Lock size={16} className="text-white/50" />
                        <input
                            type={showPass2 ? 'text' : 'password'}
                            placeholder="Repita a senha"
                            className="w-full bg-transparent py-3 outline-none"
                            value={form.confirm}
                            onChange={(e) => setForm((s) => ({ ...s, confirm: e.target.value }))}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass2((s) => !s)}
                            className="rounded-lg p-2 text-white/60 hover:bg-white/10"
                            aria-label="Alternar visibilidade da senha"
                        >
                            {showPass2 ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm}</p>}
                </div>

                {/* Termos */}
                <div className="flex items-start gap-2 text-sm">
                    <button
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, agree: !s.agree }))}
                        className={`mt-0.5 grid h-5 w-5 place-content-center rounded border ${form.agree ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20'} `}
                        aria-pressed={form.agree}
                    >
                        {form.agree && <CheckCircle2 size={16} className="text-emerald-400" />}
                    </button>
                    <span className="text-white/70">
            Li e concordo com os{' '}
                        <a href="#" className="text-emerald-300 hover:text-emerald-200">
              Termos de Uso
            </a>{' '}
                        e{' '}
                        <a href="#" className="text-emerald-300 hover:text-emerald-200">
              Política de Privacidade
            </a>.
          </span>
                </div>
                {errors.agree && <p className="text-xs text-red-400">{String(errors.agree)}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 w-full overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-400/20 disabled:opacity-50"
                >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition group-hover:translate-x-full" />
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Criando conta...
            </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
              Criar conta <ArrowRight size={16} />
            </span>
                    )}
                </button>

                {/* Link to login */}
                <p className="mt-4 text-center text-sm text-white/60">
                    Já tem conta?{' '}
                    <Link href="/login" className="text-emerald-300 hover:text-emerald-200">
                        Entrar
                    </Link>
                </p>
            </form>
        </motion.div>
    );
}
