'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Download, RefreshCw, Building2, Tractor, BarChart3, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { generateBusinessPlan, type BizPlanInput, type BizPlanOutput } from '@/lib/business-plan-gen';
import { DISTRICTS, SPECIES } from '@/lib/mock-data';

const BANKS = ['Bank of Kigali (BK)', 'BPR Bank Rwanda', 'Equity Bank Rwanda', 'Unguka MFI', 'CLECAM EJOHEZA', 'Other MFI'];

const STEPS = [
  { label: 'Business Details',  icon: Building2,  desc: 'Who you are and where you operate' },
  { label: 'Operations',        icon: Tractor,    desc: 'What you produce and how' },
  { label: 'Finance & Loan',    icon: BarChart3,  desc: 'Your funding request' },
];

const inp = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-colors';

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

export default function BusinessPlanPage() {
  const { members } = useStore();
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<BizPlanOutput | null>(null);
  const [prefill, setPrefill] = useState('');

  const [form, setForm] = useState<BizPlanInput>({
    businessName: '', ownerName: '', district: DISTRICTS[0],
    memberType: 'sawmill', species: [], monthlyVolume: 0,
    pricePerM3: 65000, employees: 3, yearsInOperation: 2,
    equipment: '', loanAmount: 5000000, loanPurpose: '',
    targetBank: BANKS[0], language: 'en',
  });

  function toggleSpecies(sp: string) {
    setForm((f) => ({
      ...f,
      species: f.species.includes(sp) ? f.species.filter((s) => s !== sp) : [...f.species, sp],
    }));
  }

  function prefillFromMember(id: string) {
    const m = members.find((mb) => mb.id === id);
    if (!m) return;
    setForm((f) => ({
      ...f, businessName: m.businessName, ownerName: m.name,
      district: m.district, memberType: m.memberType,
      species: m.species, monthlyVolume: m.productionVolume,
      equipment: m.equipment.join(', '),
    }));
  }

  function generate() { setPlan(generateBusinessPlan(form)); setStep(3); }
  function reset() {
    setPlan(null); setStep(0);
    setForm({ businessName: '', ownerName: '', district: DISTRICTS[0], memberType: 'sawmill', species: [], monthlyVolume: 0, pricePerM3: 65000, employees: 3, yearsInOperation: 2, equipment: '', loanAmount: 5000000, loanPurpose: '', targetBank: BANKS[0], language: 'en' });
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Business Plan Generator</h1>
        <p className="text-gray-500 text-sm mt-0.5">Answer a few questions and receive a complete, bank-ready business plan in under 30 minutes</p>
      </div>

      {!plan ? (
        <div className="max-w-2xl">
          {/* Step indicators */}
          <div className="flex items-stretch gap-0 mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const current = i === step;
              return (
                <div key={s.label} className="flex items-center flex-1">
                  <div className={`flex items-center gap-3 flex-1 p-3 rounded-xl transition-colors ${current ? 'bg-green-50 border border-green-300' : done ? 'opacity-60' : 'opacity-40'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-600 text-white' : current ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {done ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${current ? 'text-green-800' : 'text-gray-500'}`}>{s.label}</div>
                      <div className="text-xs text-gray-400 hidden sm:block">{s.desc}</div>
                    </div>
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-gray-200 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <h2 className="font-bold text-gray-900">{STEPS[step]?.label}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{STEPS[step]?.desc}</p>
            </div>
            <div className="p-6">
              {/* Step 0 — Business details */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-xs font-bold text-green-800 mb-1.5">Already a registered member?</div>
                    <p className="text-xs text-green-700 mb-2">Select your business below to automatically fill in your details.</p>
                    <select value={prefill} onChange={(e) => { setPrefill(e.target.value); prefillFromMember(e.target.value); }}
                      className={inp}>
                      <option value="">— Select your business to pre-fill —</option>
                      {members.map((m) => <option key={m.id} value={m.id}>{m.businessName} — {m.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Business Name *"><input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="e.g. Habimana Sawmill Ltd" className={inp} /></F>
                    <F label="Owner Full Name *"><input required value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="e.g. Jean-Pierre Habimana" className={inp} /></F>
                    <F label="District *">
                      <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={inp}>
                        {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </F>
                    <F label="Type of Business *">
                      <select value={form.memberType} onChange={(e) => setForm({ ...form, memberType: e.target.value })} className={inp}>
                        {[['harvester','Forest Harvester'],['sawmill','Sawmill'],['furniture','Furniture Maker'],['trader','Timber Trader'],['exporter','Exporter']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </F>
                    <F label="Plan Language">
                      <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as 'en'|'fr'|'rw' })} className={inp}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="rw">Kinyarwanda</option>
                      </select>
                    </F>
                  </div>
                </div>
              )}

              {/* Step 1 — Operations */}
              {step === 1 && (
                <div className="space-y-5">
                  <F label="What timber species do you work with?" hint="Select all that apply">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {SPECIES.map((sp) => (
                        <button type="button" key={sp} onClick={() => toggleSpecies(sp)}
                          className={`text-sm px-4 py-2 rounded-xl border-2 font-medium transition-all ${form.species.includes(sp) ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                          {sp}
                        </button>
                      ))}
                    </div>
                  </F>
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Monthly Volume (m³)" hint="How much timber do you process or sell per month?">
                      <input type="number" min={0} value={form.monthlyVolume} onChange={(e) => setForm({ ...form, monthlyVolume: Number(e.target.value) })} className={inp} />
                    </F>
                    <F label="Average Selling Price per m³ (RWF)" hint="Check the Market Intelligence page for live prices">
                      <input type="number" min={0} value={form.pricePerM3} onChange={(e) => setForm({ ...form, pricePerM3: Number(e.target.value) })} className={inp} />
                    </F>
                    <F label="Number of Employees">
                      <input type="number" min={1} value={form.employees} onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })} className={inp} />
                    </F>
                    <F label="Years in Business">
                      <input type="number" min={0} value={form.yearsInOperation} onChange={(e) => setForm({ ...form, yearsInOperation: Number(e.target.value) })} className={inp} />
                    </F>
                  </div>
                  <F label="Equipment you own" hint="Separate items with a comma">
                    <input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="e.g. Band saw, Chainsaw x2, Truck" className={inp} />
                  </F>
                </div>
              )}

              {/* Step 2 — Finance */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <strong>What you will receive:</strong> A complete 7-section business plan with executive summary, 3-year financial projections, and a signed declaration — formatted to meet bank requirements.
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Which bank or MFI are you applying to?">
                      <select value={form.targetBank} onChange={(e) => setForm({ ...form, targetBank: e.target.value })} className={inp}>
                        {BANKS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </F>
                    <F label="Loan Amount Requested (RWF)">
                      <input type="number" min={0} value={form.loanAmount} onChange={(e) => setForm({ ...form, loanAmount: Number(e.target.value) })} className={inp} />
                    </F>
                  </div>
                  <F label="What will you use the loan for? *" hint="Be specific — this becomes the loan purpose statement in your plan">
                    <textarea
                      required
                      rows={4}
                      value={form.loanPurpose}
                      onChange={(e) => setForm({ ...form, loanPurpose: e.target.value })}
                      placeholder="e.g. Purchase of an additional band saw and kiln dryer to increase our monthly processing capacity from 85 to 140 m³, enabling us to fulfil larger contracts with school furniture suppliers in Kigali."
                      className={`${inp} resize-none`}
                    />
                  </F>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 font-medium">
                <ArrowLeft size={14} /> Back
              </button>
              {step < 2 ? (
                <button onClick={() => setStep(step + 1)}
                  disabled={step === 0 && (!form.businessName || !form.ownerName)}
                  className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-40 transition-colors">
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={generate} disabled={!form.loanPurpose}
                  className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-40 transition-colors">
                  Generate My Business Plan <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Generated · {plan.generatedAt}</span>
              <span className="text-xs text-gray-400">RWVCA Verified Member Data</span>
            </div>
            <div className="flex gap-2">
              <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 font-medium">
                <RefreshCw size={13} /> New Plan
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm bg-green-700 text-white rounded-xl px-4 py-2 hover:bg-green-800 font-bold">
                <Download size={13} /> Download / Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm print:border-0">
            <div className="bg-green-900 text-white p-8 print:p-6">
              <div className="text-xs uppercase tracking-widest text-green-400 mb-2 font-bold">Rwanda Wood Value Chain Association</div>
              <h1 className="text-2xl font-bold">{plan.title}</h1>
              <p className="text-green-300 text-sm mt-1">Prepared for financial institution submission · {plan.generatedAt}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {plan.sections.map((section) => (
                <div key={section.heading} className="p-6">
                  <h2 className="font-bold text-gray-900 mb-3">{section.heading}</h2>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
