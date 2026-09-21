'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface ContactFormProps {
  /** Used for the mailto fallback while Supabase is not connected. */
  email: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Fields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' };

/**
 * Writes straight into `contact_messages` when Supabase is configured.
 *
 * With no credentials the submit button becomes a pre-filled mailto: the form
 * is never a dead end, and the studio still receives the enquiry.
 */
export default function ContactForm({ email }: ContactFormProps) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = t('required');
    if (!fields.message.trim()) next.message = t('required');
    if (!fields.email.trim()) next.email = t('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = t('invalidEmail');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending' || !validate()) return;

    const supabase = getSupabaseBrowserClient();

    // Not connected yet: hand the message to the visitor's mail client.
    if (!supabase) {
      const subject = fields.subject || `${fields.name} — ${locale.toUpperCase()}`;
      const body = `${fields.message}\n\n— ${fields.name} <${fields.email}>`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert({
      name: fields.name.trim(),
      email: fields.email.trim(),
      subject: fields.subject.trim(),
      message: fields.message.trim(),
      locale,
    });

    if (error) {
      console.warn('[contact] insert failed:', error.message);
      setStatus('error');
      return;
    }

    setFields(EMPTY);
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="border border-[#8B1117]/30 bg-[#8B1117]/[0.04] p-8">
        <p className="font-syne text-[15px] font-bold leading-relaxed text-[#161413]">
          {t('success')}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#8B1117]"
        >
          ← {t('formTitle')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <Field
        id="contact-name"
        label={t('name')}
        value={fields.name}
        onChange={set('name')}
        error={errors.name}
        autoComplete="name"
      />
      <Field
        id="contact-email"
        label={t('email')}
        type="email"
        value={fields.email}
        onChange={set('email')}
        error={errors.email}
        autoComplete="email"
      />
      <Field
        id="contact-subject"
        label={t('subject')}
        value={fields.subject}
        onChange={set('subject')}
        error={errors.subject}
      />
      <Field
        id="contact-message"
        label={t('message')}
        value={fields.message}
        onChange={set('message')}
        error={errors.message}
        multiline
      />

      {status === 'error' && (
        <p className="font-syne text-[12px] font-bold text-[#8B1117]">{t('failure')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group inline-flex items-center gap-3 border border-[#161413]/20 px-8 py-4 font-syne text-[10px] font-bold uppercase tracking-[0.26em] text-[#161413] transition-colors hover:border-[#8B1117] hover:bg-[#8B1117] hover:text-[#F5EFE6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('send')}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  multiline = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const shared =
    'mt-3 w-full border-b bg-transparent pb-3 text-[15px] text-[#161413] outline-none transition-colors placeholder:text-[#161413]/25 focus:border-[#8B1117]';
  const border = error ? 'border-[#8B1117]' : 'border-[#161413]/20';

  return (
    <div>
      <label
        htmlFor={id}
        className="font-syne text-[9px] font-bold uppercase tracking-[0.28em] text-[#161413]/45"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={5}
          className={`${shared} ${border} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`${shared} ${border}`}
        />
      )}
      {error && <p className="mt-2 text-[12px] text-[#8B1117]">{error}</p>}
    </div>
  );
}
