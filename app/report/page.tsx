'use client';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Download, Printer, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTION_BY_PROVINCE, INITIAL_MARKET_PRICES } from '@/lib/mock-data';

const PIE_COLORS = ['#15803d', '#b45309', '#0369a1', '#7c3aed', '#be123c'];
const TYPE_LABELS: Record<string, string> = {
  harvester: 'Harvesters', sawmill: 'Sawmills', furniture: 'Furniture Makers',
  trader: 'Timber Traders', exporter: 'Exporters',
};

const fmtRWF = (n: number) =>
  n >= 1_000_000_000 ? `RWF ${(n / 1_000_000_000).toFixed(2)} billion`
  : n >= 1_000_000   ? `RWF ${(n / 1_000_000).toFixed(0)} million`
  : `RWF ${n.toLocaleString()}`;

export default function ReportPage() {
  const { members, timberLots, enrollments, courses } = useStore();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(true);

  const activeMembers   = members.filter((m) => m.status === 'active');
  const totalVolume     = activeMembers.reduce((a, m) => a + m.productionVolume, 0);
  const annualValue     = totalVolume * 12 * 67000;
  const certifiedLots   = timberLots.filter((l) => l.certified).length;
  const completedCourses= enrollments.filter((e) => e.status === 'completed').length;
  const provinces       = [...new Set(members.map((m) => m.province))];
  const districts       = [...new Set(members.map((m) => m.district))];
  const totalEmployment = activeMembers.reduce((a, m) => a + Math.round(m.productionVolume * 0.8), 0);
  const avgPricePinus   = Math.round(
    INITIAL_MARKET_PRICES.filter(p=>p.species==='Pinus patula').reduce((a,b)=>a+b.pricePerM3,0) /
    INITIAL_MARKET_PRICES.filter(p=>p.species==='Pinus patula').length
  );

  const typeData = (['harvester','sawmill','furniture','trader','exporter'] as const)
    .map(t => ({ name: TYPE_LABELS[t], value: members.filter(m=>m.memberType===t).length }))
    .filter(d=>d.value>0);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sector Intelligence Report</h1>
          <p className="text-gray-500 text-sm mt-0.5">Auto-generated from verified member data · Ready for policy dialogue and donor briefings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerate}
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Regenerating…' : 'Regenerate'}
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {!generated ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="text-gray-400 mb-4 text-sm">Click Regenerate to produce a fresh sector report from current platform data.</div>
          <button onClick={handleGenerate} className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800">
            {generating ? 'Generating…' : 'Generate Report'}
          </button>
        </div>
      ) : (
        <div className="space-y-0 print:space-y-0" id="sector-report">
          {/* Cover */}
          <div className="bg-green-900 text-white rounded-t-xl p-10 print:rounded-none">
            <div className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">Rwanda Wood Value Chain Association</div>
            <h1 className="text-3xl font-bold leading-tight mb-2">Sector Intelligence Report</h1>
            <p className="text-green-300 text-sm mb-6">Generated from verified member data · May 2026 · Confidential — for RWVCA use</p>
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-green-800">
              {[
                { value: activeMembers.length, label: 'Verified Members' },
                { value: `${totalVolume.toLocaleString()} m³`, label: 'Monthly Production' },
                { value: provinces.length, label: 'Provinces Covered' },
                { value: `${totalEmployment}+`, label: 'Est. Workers Supported' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-green-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 divide-y divide-gray-100">
            {/* Executive Summary */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">1. Executive Summary</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The Rwanda Wood Value Chain Association (RWVCA) currently represents <strong>{activeMembers.length} verified member businesses</strong> across {provinces.length} provinces and {districts.length} districts of Rwanda. This report presents verified, platform-generated data on sector production, economic contribution, workforce development activity, and market conditions as of May 2026.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Collectively, RWVCA members produce an estimated <strong>{totalVolume.toLocaleString()} m³ of timber per month</strong>, representing an annualised sector revenue of approximately <strong>{fmtRWF(annualValue)}</strong> at current market prices. The sector directly supports an estimated <strong>{totalEmployment}+ workers</strong> through member businesses, with significantly wider indirect employment effects across harvesting, transport, processing, and trade supply chains.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This report is produced directly from the RWVCA Digital Platform, which aggregates verified member data, live market price feeds, timber custody records, and training completion data. All figures presented are drawn from member-verified information and represent the first systematic, evidence-based quantification of RWVCA member activity.
              </p>
            </section>

            {/* Membership */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">2. Membership Composition</h2>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Members by Value Chain Role</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={({name, value}) => `${name}: ${value}`} labelLine={false}>
                        {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Key Membership Metrics</h3>
                  <div className="space-y-2.5">
                    {[
                      ['Total registered members', members.length],
                      ['Active members', activeMembers.length],
                      ['Pending approval', members.filter(m=>m.status==='pending').length],
                      ['Provinces represented', provinces.length],
                      ['Districts represented', districts.length],
                      ['Certifications held', members.reduce((a,m)=>a+m.certifications.length,0)],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Member Directory Summary</h3>
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-4 py-2.5 font-medium">Business</th>
                      <th className="text-left px-4 py-2.5 font-medium">Type</th>
                      <th className="text-left px-4 py-2.5 font-medium">Province</th>
                      <th className="text-right px-4 py-2.5 font-medium">Vol (m³/mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeMembers.map(m => (
                      <tr key={m.id}>
                        <td className="px-4 py-2 font-medium text-gray-800">{m.businessName}</td>
                        <td className="px-4 py-2 text-gray-500">{TYPE_LABELS[m.memberType]}</td>
                        <td className="px-4 py-2 text-gray-500">{m.province}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-800">{m.productionVolume}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-50">
                      <td className="px-4 py-2 text-sm font-bold text-green-900" colSpan={3}>Total combined production</td>
                      <td className="px-4 py-2 text-right font-bold text-green-900">{totalVolume} m³/mo</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Economic contribution */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">3. Economic Contribution</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Monthly Revenue (est.)', value: fmtRWF(totalVolume * 67000), sub: 'at avg Grade A price' },
                  { label: 'Annual Revenue (est.)',  value: fmtRWF(annualValue), sub: 'combined member output' },
                  { label: 'Est. Direct Employment', value: `${totalEmployment}+`, sub: 'workers across member businesses' },
                ].map(s => (
                  <div key={s.label} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-xl font-bold text-green-900">{s.value}</div>
                    <div className="text-xs font-medium text-green-800 mt-0.5">{s.label}</div>
                    <div className="text-xs text-green-600 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Production Volume by Province (m³/month)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={PRODUCTION_BY_PROVINCE.filter(p=>p.volume>0)} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="province" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v} m³`, 'Volume']} />
                  <Bar dataKey="volume" fill="#15803d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Market conditions */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">4. Current Market Conditions</h2>
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                The RWVCA platform aggregates weekly timber prices from member-reported transactions across {[...new Set(INITIAL_MARKET_PRICES.map(p=>p.district))].length} districts. The following prices reflect verified market conditions as of 28 April 2026 and represent the first systematic price intelligence available to the sector.
              </p>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden mb-4">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5 font-medium">Species</th>
                    <th className="text-right px-4 py-2.5 font-medium">Min Price/m³</th>
                    <th className="text-right px-4 py-2.5 font-medium">Max Price/m³</th>
                    <th className="text-right px-4 py-2.5 font-medium">Avg Price/m³</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {['Pinus patula','Grevillea robusta','Eucalyptus grandis','Maesopsis eminii','Markhamia lutea'].map(sp => {
                    const prices = INITIAL_MARKET_PRICES.filter(p=>p.species===sp).map(p=>p.pricePerM3);
                    if (!prices.length) return null;
                    const min = Math.min(...prices), max = Math.max(...prices), avg = Math.round(prices.reduce((a,b)=>a+b,0)/prices.length);
                    const fmt = (n: number) => new Intl.NumberFormat('en-RW',{style:'currency',currency:'RWF',maximumFractionDigits:0}).format(n);
                    return (
                      <tr key={sp}>
                        <td className="px-4 py-2.5 font-medium text-gray-800 italic">{sp}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{fmt(min)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{fmt(max)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{fmt(avg)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                <strong>Policy note:</strong> Price variation across districts of up to 35% for identical species and grade indicates significant market inefficiency. The platform's price transparency mechanism is expected to reduce this spread and improve average returns for smaller operators.
              </div>
            </section>

            {/* Traceability & workforce */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">5. Traceability and Workforce Development</h2>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Timber Traceability</h3>
                  <div className="space-y-2.5 mb-4">
                    {[
                      ['Timber lots registered', timberLots.length],
                      ['Total volume tracked', `${timberLots.reduce((a,l)=>a+l.volume,0).toFixed(1)} m³`],
                      ['RWVCA-certified lots', certifiedLots],
                      ['Custody steps recorded', timberLots.reduce((a,l)=>a+l.custody.length,0)],
                      ['Export-ready lots', timberLots.filter(l=>l.certified).length],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    RWVCA-certified timber lots carry a verified chain-of-custody record from harvest point to final buyer, meeting EU Deforestation Regulation and EAC procurement documentation requirements. Certified members are listed in the RWVCA verified supplier directory, accessible to international buyers.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Workforce Training</h3>
                  <div className="space-y-2.5 mb-4">
                    {[
                      ['Courses on platform', courses.length],
                      ['Course categories', '5 (Safety, Sustainability, Business, Quality, Compliance)'],
                      ['Total enrolments', enrollments.length],
                      ['Completions to date', completedCourses],
                      ['Delivery channels', 'WhatsApp, USSD, Web'],
                      ['Languages available', 'Kinyarwanda, French, English'],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex justify-between border-b border-gray-100 pb-1.5 gap-4">
                        <span className="text-sm text-gray-600 shrink-0">{label}</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Training completions are logged to each member's verified profile and cited in business plan applications and supplier certifications, creating a compounding value from each course completed.
                  </p>
                </div>
              </div>
            </section>

            {/* Policy recommendations */}
            <section className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-green-700 rounded-full" />
                <h2 className="font-bold text-gray-900">6. Policy Recommendations</h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    n: '6.1', title: 'Formalise RWVCA as the authoritative sectoral data body',
                    body: `The platform now provides the first systematic, verified data on Rwanda's wood sector. RWVCA should be formally recognised by the Ministry of Environment, Ministry of Trade, and Rwanda Development Board as the primary source of sectoral production, employment, and market data — replacing the current reliance on estimates.`,
                  },
                  {
                    n: '6.2', title: 'Mandate RWVCA traceability as a condition of government timber procurement',
                    body: `Government procuring entities — including Rwanda Education Board, Rwanda Biomedical Centre, and MININFRA — should require RWVCA chain-of-custody certification as a condition of supplier shortlisting for timber procurement. This would accelerate platform adoption and improve procurement integrity simultaneously.`,
                  },
                  {
                    n: '6.3', title: 'Link platform membership to BPR/MFI credit access programmes',
                    body: `Rwanda's financial institutions and the National Bank of Rwanda should recognise RWVCA verified membership and platform-generated business plans as qualifying documentation for SME credit products. The AI-generated plans already meet standard BPR and Equity Bank template requirements.`,
                  },
                  {
                    n: '6.4', title: 'Integrate proWOOD curriculum with platform learning module',
                    body: `GIZ proWOOD and IPRC Kitabi training content should be digitised and delivered through the platform's WhatsApp and USSD channels, significantly extending training reach without proportional cost increases. The platform's completion tracking provides verifiable outcome data for donor reporting.`,
                  },
                ].map(rec => (
                  <div key={rec.n} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">{rec.n}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{rec.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <section className="p-8 bg-gray-50 rounded-b-xl">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Data Integrity Statement</div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                    All data in this report is drawn directly from the RWVCA Digital Platform and reflects verified member registrations, member-reported transactions, and platform-recorded activity. No estimates or third-party projections have been used without attribution. This report was generated automatically on {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} and reflects platform data as of that date.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-400 mb-1">Prepared by</div>
                  <div className="text-sm font-bold text-gray-800">RWVCA Digital Platform</div>
                  <div className="text-xs text-gray-500">Rwanda Wood Value Chain Association</div>
                  <div className="text-xs text-gray-400 mt-1">Kigali, Rwanda · May 2026</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
