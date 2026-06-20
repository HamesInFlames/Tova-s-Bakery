// Delivers contact/wholesale-inquiry submissions to Tova's inbox via Web3Forms —
// a hosted form-to-email relay, no backend required. The browser POSTs straight
// to Web3Forms, which emails it on.
//
// SETUP (one time): create an access key at https://web3forms.com for Tova's
// inbox, then set VITE_WEB3FORMS_ACCESS_KEY (in .env / host env). The key is
// public by design — it only permits sending to the inbox it was registered for.
//
// NOTE: this is a PLACEHOLDER key and must be replaced before launch.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'REPLACE-WITH-TOVAS-WEB3FORMS-KEY';
const ENDPOINT = 'https://api.web3forms.com/submit';

export interface ContactFormState {
  name: string;
  email: string;
  phone?: string;
  enquiryType?: string;
  message: string;
  botcheck?: string;
}

export async function sendContactMessage(form: ContactFormState, opts: { subject?: string } = {}): Promise<void> {
  // Honeypot: bots fill this hidden field; pretend success and never email.
  if (form.botcheck) return;

  if (!ACCESS_KEY || ACCESS_KEY.startsWith('REPLACE-')) {
    throw new Error('Web3Forms access key is not configured. See src/lib/sendContactMessage.ts.');
  }

  const payload = {
    access_key: ACCESS_KEY,
    subject: opts.subject || 'New inquiry from the Tova\'s Bakery website',
    from_name: "Tova's Bakery Website",
    replyto: form.email,
    name: form.name,
    email: form.email,
    phone: form.phone || '—',
    'Inquiry type': form.enquiryType || '—',
    message: form.message,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Submission failed. Please try again.');
  }
}
