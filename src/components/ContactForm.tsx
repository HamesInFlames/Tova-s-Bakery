import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { sendContactMessage, type ContactFormState } from '@/lib/sendContactMessage';

const ENQUIRY_TYPES = ['Wholesale', 'Retail / Pickup', 'Catering / Event', 'General'];

const inputCls =
  'w-full rounded-md border border-border-warm bg-cream-soft px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30';

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({ name: '', email: '', phone: '', enquiryType: 'Wholesale', message: '', botcheck: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof ContactFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendContactMessage(form, { subject: `Tova's website — ${form.enquiryType || 'General'} inquiry from ${form.name}` });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center rounded-lg border border-border-warm bg-cream-soft p-10 text-center">
        <CheckCircle2 size={40} className="text-accent" aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-ink-soft">We&rsquo;ve received your message and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border-warm bg-cream-soft p-6 sm:p-8">
      {/* Honeypot */}
      <input type="text" name="botcheck" value={form.botcheck} onChange={set('botcheck')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Name</label>
          <input id="name" type="text" value={form.name} onChange={set('name')} className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email <span className="text-accent">*</span></label>
          <input id="email" type="email" required value={form.email} onChange={set('email')} className={inputCls} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Phone</label>
          <input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={inputCls} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="enquiryType" className="mb-1.5 block text-sm font-semibold">Inquiry type</label>
          <select id="enquiryType" value={form.enquiryType} onChange={set('enquiryType')} className={inputCls}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Message <span className="text-accent">*</span></label>
        <textarea id="message" required rows={5} value={form.message} onChange={set('message')} className={`${inputCls} resize-y`} />
      </div>

      {status === 'error' && <p className="mt-4 text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-7 py-3 font-semibold text-cream-soft transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        <Send size={16} aria-hidden="true" />
        {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}
