'use client';

import React from 'react';
import AuthGate from './AuthGate';
import AdminShell from './AdminShell';

export interface AdminPageProps {
  title: string;
  description?: string;
  /** Buttons rendered on the right of the page header. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/** Auth gate + sidebar + page header. Every admin screen except login uses it. */
export default function AdminPage({ title, description, actions, children }: AdminPageProps) {
  return (
    <AuthGate>
      <AdminShell>
        <header className="mb-10 flex flex-col gap-5 border-b border-[#26231f] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-syne text-[clamp(1.375rem,2.5vw,1.875rem)] font-bold leading-tight tracking-[-0.01em] text-[#ede8e0]">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-[78ch] text-[13px] leading-relaxed text-[#8a8378]">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </header>

        {children}
      </AdminShell>
    </AuthGate>
  );
}

/* -------------------------------------------------------------------------- */
/* Small shared pieces                                                        */
/* -------------------------------------------------------------------------- */

export function Button({
  children,
  onClick,
  href,
  variant = 'secondary',
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const base =
    'inline-flex items-center justify-center rounded-sm px-5 py-2.5 font-syne text-[10px] font-bold uppercase tracking-[0.24em] transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const tone =
    variant === 'primary'
      ? 'bg-[#8B1117] text-[#F5EFE6] hover:bg-[#a4151c]'
      : variant === 'danger'
        ? 'border border-[#8B1117]/50 text-[#e0757c] hover:bg-[#8B1117]/15'
        : 'border border-[#2c2926] text-[#c9c2b7] hover:border-[#8B1117] hover:text-[#ede8e0]';

  if (href) {
    return (
      <a href={href} className={`${base} ${tone}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${tone}`}>
      {children}
    </button>
  );
}

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'success' | 'error';
  children: React.ReactNode;
}) {
  const styles =
    tone === 'success'
      ? 'border-[#3f6b46] bg-[#1b2a1d] text-[#b6d8bc]'
      : tone === 'error'
        ? 'border-[#8B1117]/50 bg-[#2a1416] text-[#e8a0a5]'
        : 'border-[#2c2926] bg-[#141312] text-[#9a9389]';

  return (
    <div className={`rounded-sm border px-4 py-3 text-[12.5px] leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-dashed border-[#2c2926] px-6 py-16 text-center text-[13px] text-[#6d675e]">
      {children}
    </div>
  );
}

/** Sticky footer holding the save action and its feedback. */
export function SaveBar({
  onSave,
  saving,
  disabled,
  message,
  error,
  extra,
}: {
  onSave: () => void;
  saving: boolean;
  disabled?: boolean;
  message?: string | null;
  error?: string | null;
  extra?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-6 mt-12 border-t border-[#26231f] bg-[#0a0a09]/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" onClick={onSave} disabled={disabled || saving}>
          {saving ? 'KAYDEDİLİYOR…' : 'KAYDET'}
        </Button>
        {extra}
        {error && <span className="text-[12.5px] text-[#e0757c]">{error}</span>}
        {!error && message && <span className="text-[12.5px] text-[#b6d8bc]">{message}</span>}
      </div>
    </div>
  );
}
