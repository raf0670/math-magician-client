"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMathEnrollmentContext, getPaymentQuote, getStoredToken, getStoredUser, savePendingPaymentPlan, savePendingProgramAction, submitManualEnrollment } from '@/lib/api';
import PolicyAcceptance from '@/components/shared/PolicyAcceptance';

const METHODS = ['By myself', 'Offline coaching ( Mentors / Blueprint )', 'Online coaching ( ACS / Michil )', 'Personal batch'];
const WEAKNESSES = ['Weak mental calculation', 'Lack of question understanding', 'Wrong approach', 'Others'];
const BACKUPS = ['IBA JU', 'BUP BBA Gen', 'BUP FBS', 'DU B/C unit', 'Engineering', 'Medical', 'DU A unit', 'Private Uni', 'Abroad'];
const amount = value => `BDT ${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const inputClass = 'mt-2 w-full rounded-xl border border-white/15 bg-[#0F0D15] px-4 py-3 text-white outline-none focus:border-emerald-300';

export default function MathEnrollment({ initialPlan }) {
  const router = useRouter();
  const upgrade = initialPlan === 'slytherinUpgrade';
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({ backupChoice: [], preparationMethods: [], mathWeaknesses: [] });
  const [joinSlytherin, setJoinSlytherin] = useState(initialPlan === 'mathSlytherin');
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [quoteError, setQuoteError] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const selectedPlan = upgrade ? 'slytherinUpgrade' : context?.existingHouseEligible ? 'math' : joinSlytherin ? 'mathSlytherin' : 'math';
  const readyQuote = quote?.planId === selectedPlan && quote.requestedCoupon === couponCode ? quote : null;

  useEffect(() => {
    if (!getStoredToken()) {
      savePendingPaymentPlan(initialPlan); savePendingProgramAction('enroll'); router.replace('/signup'); return;
    }
    let active = true;
    getMathEnrollmentContext().then(payload => {
      if (!active) return;
      const user = getStoredUser();
      setContext(payload.data);
      setForm(current => ({ ...current, ...payload.data.student, yourName: payload.data.student?.yourName || user?.name || '', emailAddress: payload.data.student?.emailAddress || user?.email || '' }));
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [initialPlan, router]);

  useEffect(() => {
    if (!context) return;
    let active = true;
    getPaymentQuote(selectedPlan, couponCode).then(payload => {
      if (active) { setQuote({ ...payload.data, requestedCoupon: couponCode }); setQuoteError(''); }
    }).catch(err => { if (active) { setQuote(null); setQuoteError(err.message); } });
    return () => { active = false; };
  }, [context, selectedPlan, couponCode]);

  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const toggle = (field, value) => update(field, (form[field] || []).includes(value) ? form[field].filter(item => item !== value) : [...(form[field] || []), value]);
  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    if (!accepted || !readyQuote) { setError('Accept the policies and confirm your price before continuing.'); return; }
    if (!upgrade && ['backupChoice', 'preparationMethods', 'mathWeaknesses'].some(field => !form[field]?.length)) { setError('Select at least one answer in each multiple-choice section.'); return; }
    setSaving(true);
    try {
      const payload = await submitManualEnrollment(selectedPlan, { ...form, email: form.emailAddress }, 'full', couponCode, readyQuote.amount);
      if (!payload.data?.paymentUrl) throw new Error('Checkout could not be opened. Please try again.');
      window.location.assign(payload.data.paymentUrl);
    } catch (err) { setError(err.message); setSaving(false); }
  };

  return <main className="min-h-screen bg-[#0A090F] px-5 pb-20 pt-28 text-white">
    <div className="mx-auto max-w-5xl"><Link href="/math-course" className="text-sm text-emerald-200">← Math Course details</Link>
      <h1 className="mt-6 font-serif text-4xl">{upgrade ? 'Join Slytherin' : 'Your math journey starts here'}</h1>
      <p className="mt-3 text-sm leading-7 text-[#AAA5B8]">{upgrade ? 'Add full website access to your Math Course. Your math progress stays with you.' : 'Tell us about yourself and your preparation, then complete your enrollment.'}</p>
      {!context ? <p role="status" className="mt-8">{error || 'Loading your enrollment details…'}</p> : <form onSubmit={handleSubmit} className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {upgrade ? <Section title="Your enrollment"><p>{form.yourName}</p><p className="mt-2 text-sm text-[#AAA5B8]">{form.emailAddress}</p><p className="mt-4 text-sm">We will use the details from your math enrollment.</p></Section> : <>
            <Section title="Contact information"><div className="grid gap-4 sm:grid-cols-2">
              {[['yourName', 'Your name', 'text'], ['emailAddress', 'Email address', 'email'], ['phoneNumber', 'Phone number', 'tel'], ['address', 'Address', 'text'], ['facebookProfile', 'Facebook profile link', 'url'], ['college', 'College', 'text']].map(([field, label, type]) => <Field key={field} label={label} type={type} value={form[field]} onChange={value => update(field, value)} />)}
            </div></Section>
            <Section title="Academic information"><div className="grid gap-4 sm:grid-cols-2">
              <Select label="Group" value={form.group} options={['Science', 'Arts', 'Commerce', 'Others']} onChange={value => update('group', value)} />
              <Select label="HSC batch" value={form.hscBatch} options={['2025 or equivalent', '2026 or equivalent', '2027 or equivalent', 'Others']} onChange={value => update('hscBatch', value)} />
            </div><Choices label="What is/are your back-up(s)?" options={BACKUPS} values={form.backupChoice} onChange={value => toggle('backupChoice', value)} />
              <Select label="Do you have a clear idea about the admission system?" value={form.admissionSystemIdea} options={['Yes', 'No', 'Maybe']} onChange={value => update('admissionSystemIdea', value)} />
            </Section>
            <Section title="Your math preparation">
              <Choices label="1. How are you taking preparation right now?" options={METHODS} values={form.preparationMethods} onChange={value => toggle('preparationMethods', value)} />
              <label className="mt-5 block text-sm font-semibold">2. What is your biggest fear in math? <span className="text-[#DFB15B]">*</span><textarea required maxLength={5000} rows={4} className={inputClass} value={form.mathFear || ''} onChange={event => update('mathFear', event.target.value)} /></label>
              <Choices label="3. What do you think is wrong with your math?" options={WEAKNESSES} values={form.mathWeaknesses} onChange={value => toggle('mathWeaknesses', value)} />
              {form.mathWeaknesses?.includes('Others') && <Field label="Tell us more" value={form.mathWeaknessOther} maxLength={2000} onChange={value => update('mathWeaknessOther', value)} />}
            </Section>
            <Section title="Want to join Slytherin too?">
              {context.existingHouseEligible ? <p className="text-sm leading-7 text-emerald-200">Your existing house already includes full website access. You will keep your house and receive the best available math discount.</p> : <label className="flex items-start gap-3 text-sm leading-7"><input type="checkbox" checked={joinSlytherin} onChange={event => setJoinSlytherin(event.target.checked)} className="mt-2 accent-emerald-300" /><span>Add Slytherin for BDT 5,999 and unlock the full website, regular exams, and house competition.</span></label>}
            </Section>
          </>}
        </div>
        <aside className="space-y-5 rounded-3xl border border-emerald-300/20 bg-[#121017] p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">{selectedPlan === 'math' ? 'Math Course' : upgrade ? 'Slytherin Upgrade' : 'Math + Slytherin'}</h2>
          {!upgrade && <div><label htmlFor="math-coupon" className="text-sm text-[#AAA5B8]">Discount code</label><div className="mt-2 flex gap-2"><input id="math-coupon" value={couponInput} onChange={event => setCouponInput(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0F0D15] p-3" /><button type="button" onClick={() => setCouponCode(couponInput.trim())} className="rounded-xl border border-emerald-300/30 px-3 text-sm text-emerald-200">Apply</button></div></div>}
          {readyQuote && !quoteError ? <div aria-live="polite" className="space-y-3 text-sm"><div className="flex justify-between"><span>Course price</span><span>{amount(readyQuote.originalAmount)}</span></div>{readyQuote.discountAmount > 0 && <div className="flex justify-between gap-2 text-emerald-200"><span>{readyQuote.discountType === 'existingHouse' ? 'House student discount' : 'Code discount'}</span><span>−{amount(readyQuote.discountAmount)}</span></div>}<div className="border-t border-white/10 pt-4"><p className="text-[#AAA5B8]">Full payment</p><p className="mt-1 text-3xl font-bold text-[#DFB15B]">{amount(readyQuote.amount)}</p></div><p className="text-xs leading-6 text-[#AAA5B8]">Only the best single discount applies.</p></div> : <p role="status" className="text-sm text-[#AAA5B8]">{quoteError || 'Calculating your price…'}</p>}
          <PolicyAcceptance checked={accepted} onChange={setAccepted} />
          {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
          <button disabled={saving || !readyQuote || Boolean(quoteError)} className="w-full rounded-2xl bg-[#DFB15B] px-4 py-4 font-bold text-black disabled:opacity-40">{saving ? 'Opening checkout…' : 'Continue to PayStation'}</button>
          {context.hasMathAccess && !upgrade && <Link href="/dashboard/math" className="block text-center text-sm text-emerald-200">Open your Math Course</Link>}
        </aside>
      </form>}
    </div>
  </main>;
}

function Section({ title, children }) { return <section className="rounded-3xl border border-white/8 bg-[#121017] p-6"><h2 className="mb-5 text-xl font-semibold">{title}</h2>{children}</section>; }
function Field({ label, value, onChange, type = 'text', maxLength = 500 }) { return <label className="block text-sm font-semibold">{label} <span className="text-[#DFB15B]">*</span><input required type={type} maxLength={maxLength} className={inputClass} value={value || ''} onChange={event => onChange(event.target.value)} /></label>; }
function Select({ label, value, options, onChange }) { return <label className="mt-3 block text-sm font-semibold">{label} <span className="text-[#DFB15B]">*</span><select required className={inputClass} value={value || ''} onChange={event => onChange(event.target.value)}><option value="">Select an answer</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>; }
function Choices({ label, options, values = [], onChange }) { return <fieldset className="mt-5"><legend className="text-sm font-semibold">{label} <span className="text-[#DFB15B]">*</span></legend><p className="mt-1 text-xs text-[#AAA5B8]">Select all that apply.</p><div className="mt-3 grid gap-2">{options.map(option => <label key={option} className="flex items-center gap-3 rounded-xl border border-white/8 p-3 text-sm"><input type="checkbox" checked={values.includes(option)} onChange={() => onChange(option)} className="accent-emerald-300" />{option}</label>)}</div></fieldset>; }
