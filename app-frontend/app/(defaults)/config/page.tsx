'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2,
    KeyRound,
    Loader2,
    Mail,
    Phone,
    ShieldCheck,
    User2,
} from 'lucide-react';

/* ------------------ helpers: máscara e validação ------------------ */
function cpfMask(v: string) {
    return v
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function phoneMask(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10) {
        return d
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return d
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}
function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
// Validação simples de CPF (dígitos verificadores)
function validateCPF(cpf: string) {
    const c = cpf.replace(/\D/g, '');
    if (!c || c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += Number(c[i]) * (10 - i);
    let d1 = 11 - (s % 11);
    if (d1 > 9) d1 = 0;
    if (d1 !== Number(c[9])) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += Number(c[i]) * (11 - i);
    let d2 = 11 - (s % 11);
    if (d2 > 9) d2 = 0;
    return d2 === Number(c[10]);
}
function strength(p: string) {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0..5
}

/* ----------------------------- Page ----------------------------- */

type Tab = 'geral' | 'senha';

export default function SettingsPage() {
    const [tab, setTab] = useState<Tab>('geral');

    // mocks iniciais (substitua pelos dados reais)
    const [name, setName] = useState('Marcos Paulo De Souza');
    const [phone, setPhone] = useState('5543984248181'); // sem máscara
    const [cpf, setCpf] = useState('00832507946');       // sem máscara
    const [email, setEmail] = useState('mps32.ms@gmail.com');
    const [emailVerifiedAt] = useState<Date | null>(new Date());

    // estados de UI
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errs, setErrs] = useState<{ name?: string; phone?: string; cpf?: string; email?: string }>({});

    // senha
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [savingPass, setSavingPass] = useState(false);
    const [savedPass, setSavedPass] = useState(false);
    const st = strength(newPass);

    // valores mascarados na UI
    const phoneUI = useMemo(() => phoneMask(phone), [phone]);
    const cpfUI = useMemo(() => cpfMask(cpf), [cpf]);

    // animação de entrada
    useEffect(() => {
        document.documentElement.classList.add('supports-[animation]');
    }, []);

    const onSave = async () => {
        const errors: typeof errs = {};
        if (!name.trim()) errors.name = 'Informe seu nome completo.';
        if (!validateEmail(email)) errors.email = 'E-mail inválido.';
        const onlyDigits = phone.replace(/\D/g, '');
        if (onlyDigits.length < 10) errors.phone = 'Telefone incompleto.';
        if (!validateCPF(cpfUI)) errors.cpf = 'CPF inválido.';

        setErrs(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        setSaved(false);
        // TODO: enviar para API
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const onSavePassword = async () => {
        const errors: string[] = [];
        if (!currentPass) errors.push('Informe a senha atual.');
        if (st < 3) errors.push('A nova senha é muito fraca.');
        if (newPass !== confirmPass) errors.push('A confirmação não confere.');

        if (errors.length) {
            alert(errors.join('\n'));
            return;
        }

        setSavingPass(true);
        setSavedPass(false);
        // TODO: chamar API
        await new Promise((r) => setTimeout(r, 900));
        setSavingPass(false);
        setSavedPass(true);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setTimeout(() => setSavedPass(false), 2000);
    };

    return (
        <section className="p-6 animate-[fadeIn_.35s_ease]">
            {/* header visual (avatar + infos) */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-[#0d1117]">
                <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-purple-500/15 text-purple-300 dark:bg-purple-500/20 dark:text-purple-200">
                        {name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')}
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h1>
                        <p className="text-sm text-slate-600 dark:text-white/70">{email}</p>
                    </div>
                </div>

                {/* abas */}
                <div className="mt-6 flex gap-2">
                    <button
                        onClick={() => setTab('geral')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            tab === 'geral'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-[#1f2a36] dark:text-white/80 dark:hover:bg-[#19212e]'
                        }`}
                    >
                        Informações gerais
                    </button>

                    <button
                        onClick={() => setTab('senha')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            tab === 'senha'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-[#1f2a36] dark:text-white/80 dark:hover:bg-[#19212e]'
                        }`}
                    >
                        Senha
                    </button>
                </div>
            </div>

            {/* conteúdo das abas */}
            {tab === 'geral' ? (
                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
                    {/* nome */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Nome
                        </label>
                        <div className="relative">
                            <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input pl-9 dark:bg-[#121821]"
                                placeholder="Seu nome completo"
                            />
                        </div>
                        {errs.name && <p className="mt-1 text-xs text-rose-500">{errs.name}</p>}
                    </div>

                    {/* telefone */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Telefone
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={phoneUI}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-input pl-9 dark:bg-[#121821]"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        {errs.phone && <p className="mt-1 text-xs text-rose-500">{errs.phone}</p>}
                    </div>

                    {/* cpf */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            CPF
                        </label>
                        <div className="relative">
                            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={cpfUI}
                                onChange={(e) => setCpf(e.target.value)}
                                className="form-input pl-9 dark:bg-[#121821]"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        {errs.cpf && <p className="mt-1 text-xs text-rose-500">{errs.cpf}</p>}
                    </div>

                    {/* email */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input pl-9 dark:bg-[#121821]"
                                placeholder="voce@exemplo.com"
                            />
                        </div>
                        {errs.email && <p className="mt-1 text-xs text-rose-500">{errs.email}</p>}
                        {emailVerifiedAt ? (
                            <p className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                                Verificado dia {emailVerifiedAt.toLocaleDateString('pt-BR')}
                            </p>
                        ) : (
                            <p className="mt-2 text-xs text-amber-400">E-mail não verificado</p>
                        )}
                    </div>

                    {/* ações */}
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={onSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-purple-500 active:scale-[.98] disabled:opacity-60"
                        >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Salvar alterações
                        </button>
                    </div>

                    {saved && (
                        <div className="mt-1 text-right text-sm font-medium text-emerald-400">
                            Alterações salvas com sucesso!
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
                    {/* senha atual */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Senha atual
                        </label>
                        <div className="relative">
                            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                                className="form-input pl-9 dark:bg-[#121821]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* nova senha */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Nova senha
                        </label>
                        <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="form-input dark:bg-[#121821]"
                            placeholder="Mínimo 8 caracteres"
                        />
                        {/* barra de força */}
                        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
                            <div
                                className={`h-2 rounded-full transition-all ${
                                    st <= 1
                                        ? 'w-1/5 bg-rose-500'
                                        : st === 2
                                            ? 'w-2/5 bg-amber-500'
                                            : st === 3
                                                ? 'w-3/5 bg-yellow-500'
                                                : st === 4
                                                    ? 'w-4/5 bg-lime-500'
                                                    : 'w-full bg-emerald-500'
                                }`}
                            />
                        </div>
                    </div>

                    {/* confirmar */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Confirmar nova senha
                        </label>
                        <input
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="form-input dark:bg-[#121821]"
                            placeholder="Repita a nova senha"
                        />
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={onSavePassword}
                            disabled={savingPass}
                            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-purple-500 active:scale-[.98] disabled:opacity-60"
                        >
                            {savingPass && <Loader2 className="h-4 w-4 animate-spin" />}
                            Atualizar senha
                        </button>
                    </div>

                    {savedPass && (
                        <div className="mt-1 text-right text-sm font-medium text-emerald-400">
                            Senha atualizada com sucesso!
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

/* ----------------------------- styles base -----------------------------
Se você ainda não tem, adicione classes utilitárias em globals:
.form-input / .form-textarea / .form-select seguem o padrão das suas outras telas
--------------------------------------------------------------------------- */
