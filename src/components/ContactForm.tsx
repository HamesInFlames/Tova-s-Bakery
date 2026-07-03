import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { sendContactMessage, type ContactFormState } from '@/lib/sendContactMessage';

const ENQUIRY_TYPES = ['Wholesale', 'Retail / Pickup', 'Catering / Event', 'General'];

const inputCls =
  'w-full rounded-none border border-ink/25 bg-paper px-4 py-3 text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-gold/40';

const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-caps text-ink';

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
      <div className="flex flex-col items-center rounded-none border border-ink/15 bg-paper p-10 text-center">
        <CheckCircle2 size={40} className="text-ink" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-bold">Thank you!</h3>
        <p className="mt-2 text-ink/65">We&rsquo;ve received your message and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-none border border-ink/15 bg-paper p-6 sm:p-8">
      {/* Honeypot */}
      <input type="text" name="botcheck" value={form.botcheck} onChange={set('botcheck')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" type="text" value={form.name} onChange={set('name')} className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email <span className="text-ink">*</span></label>
          <input id="email" type="email" required value={form.email} onChange={set('email')} className={inputCls} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={inputCls} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="enquiryType" className={labelCls}>Inquiry type</label>
          <select id="enquiryType" value={form.enquiryType} onChange={set('enquiryType')} className={inputCls}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelCls}>Message <span className="text-ink">*</span></label>
        <textarea id="message" required rows={5} value={form.message} onChange={set('message')} className={`${inputCls} resize-y`} />
      </div>

      {status === 'error' && <p className="mt-4 text-sm font-bold text-ink">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex items-center gap-2 rounded-none bg-ink px-7 py-3 text-sm font-medium uppercase tracking-caps text-paper transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        <Send size={16} aria-hidden="true" />
        {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}
