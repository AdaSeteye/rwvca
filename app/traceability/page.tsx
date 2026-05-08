'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, X, ChevronDown, ChevronRight, Award, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SPECIES } from '@/lib/mock-data';
import type { TimberLot, CustodyRecord, LotStatus } from '@/lib/types';

const STATUS_STYLES: Record<LotStatus, string> = {
  harvested:   'bg-green-50  text-green-700  border-green-200',
  'in-transit':'bg-blue-50   text-blue-700   border-blue-200',
  'at-mill':   'bg-amber-50  text-amber-700  border-amber-200',
  processed:   'bg-purple-50 text-purple-700 border-purple-200',
  sold:        'bg-gray-50   text-gray-600   border-gray-200',
};

const STATUSES: LotStatus[] = ['harvested', 'in-transit', 'at-mill', 'processed', 'sold'];

export default function TraceabilityPage() {
  const { members, timberLots, addTimberLot, addCustodyRecord, certifyLot } = useStore();
  const [selected, setSelected]   = useState<TimberLot | null>(null);
  const [showCreate, setShowCreate]= useState(false);
  const [showRecord, setShowRecord]= useState(false);
  const [expandedLot, setExpanded] = useState<string | null>(null);

  const [newLot, setNewLot] = useState({
    species: SPECIES[0], volume: 10, gradeClass: 'Grade A',
    harvestLocation: '', harvestDate: new Date().toISOString().split('T')[0], memberId: '',
  });

  const [newRecord, setNewRecord] = useState<Omit<CustodyRecord, 'id'>>({
    timestamp: new Date().toISOString().slice(0, 16),
    handler: '', location: '', action: 'Transported', notes: '',
  });

  const [activeTab, setActiveTab] = useState<'lots' | 'readiness'>('lots');
  const [readinessMemberId, setReadinessMemberId] = useState('');

  function getExportReadiness(memberId: string) {
    const member = members.find((m) => m.id === memberId);
    if (!member) return null;
    const memberLots = timberLots.filter((l) => l.memberId === memberId);
    const certifiedLotCount = memberLots.filter((l) => l.certified).length;
    const hasExportLicence = member.certifications.some((c) => c.toLowerCase().includes('export'));
    const hasEAC = member.certifications.some((c) => c.toLowerCase().includes('eac'));
    const hasRema = member.certifications.some((c) => c.toLowerCase().includes('rema'));
    const hasTraceability = memberLots.length > 0;
    const checks = [
      { label: 'RWVCA verified member profile', passed: member.status === 'active', required: true },
      { label: 'Active REMA forest use permit', passed: hasRema, required: true },
      { label: 'At least one timber lot registered', passed: hasTraceability, required: true },
      { label: 'RWVCA-certified timber lot', passed: certifiedLotCount > 0, required: true },
      { label: 'RRA Export Licence', passed: hasExportLicence, required: false },
      { label: 'EAC Certificate of Origin', passed: hasEAC, required: false },
      { label: 'Grade A timber on record', passed: memberLots.some(l=>l.gradeClass==='Grade A'), required: false },
    ];
    const requiredPassed = checks.filter((c) => c.required && c.passed).length;
    const requiredTotal  = checks.filter((c) => c.required).length;
    const score = Math.round((checks.filter(c=>c.passed).length / checks.length) * 100);
    return { member, checks, score, requiredPassed, requiredTotal, ready: requiredPassed === requiredTotal };
  }

  const readiness = readinessMemberId ? getExportReadiness(readinessMemberId) : null;

  function createLot(e: React.FormEvent) {
    e.preventDefault();
    const member = members.find((m) => m.id === newLot.memberId);
    const id = `LOT-${String(timberLots.length + 1).padStart(3, '0')}`;
    const lot: TimberLot = {
      id,
      species:         newLot.species,
      volume:          newLot.volume,
      gradeClass:      newLot.gradeClass,
      harvestLocation: newLot.harvestLocation,
      harvestDate:     newLot.harvestDate,
      memberId:        newLot.memberId,
      memberName:      member?.businessName ?? 'Unknown',
      status:          'harvested',
      certified:       false,
      custody: [{
        id: 'c-' + Date.now(),
        timestamp: newLot.harvestDate + 'T08:00:00',
        handler:   member?.businessName ?? 'Unknown',
        location:  newLot.harvestLocation,
        action:    'Harvested',
        notes:     '',
      }],
    };
    addTimberLot(lot);
    setShowCreate(false);
    setNewLot({ species: SPECIES[0], volume: 10, gradeClass: 'Grade A', harvestLocation: '', harvestDate: new Date().toISOString().split('T')[0], memberId: '' });
  }

  function addRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const record: CustodyRecord = { ...newRecord, id: 'c-' + Date.now() };
    addCustodyRecord(selected.id, record);
    setShowRecord(false);
    setNewRecord({ timestamp: new Date().toISOString().slice(0, 16), handler: '', location: '', action: 'Transported', notes: '' });
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const sel = inp + ' bg-white';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timber Traceability</h1>
          <p className="text-gray-500 text-sm mt-0.5">QR-based chain of custody · From harvest to final buyer</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> New Timber Lot
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['lots', 'readiness'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${activeTab === tab ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {tab === 'lots' ? 'Timber Lots' : 'Export Readiness Checker'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Lots Registered',   value: timberLots.length },
          { label: 'In Transit',        value: timberLots.filter((l) => l.status === 'in-transit').length },
          { label: 'Certified & Sold',  value: timberLots.filter((l) => l.certified).length },
          { label: 'Total Volume (m³)', value: timberLots.reduce((a, l) => a + l.volume, 0).toFixed(1) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Export Readiness Tab */}
      {activeTab === 'readiness' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-1">Export Readiness Checker</h2>
            <p className="text-sm text-gray-500 mb-4">Check whether a member meets the documentation requirements for EU and EAC export markets.</p>
            <div className="flex gap-3">
              <select value={readinessMemberId} onChange={e=>setReadinessMemberId(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">— Select a member —</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.businessName}</option>)}
              </select>
            </div>
          </div>

          {readiness && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className={`p-5 border-b border-gray-100 flex items-center justify-between ${readiness.ready ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={22} className={readiness.ready ? 'text-green-600' : 'text-amber-600'} />
                  <div>
                    <div className="font-bold text-gray-900">{readiness.member.businessName}</div>
                    <div className="text-sm text-gray-500">{readiness.ready ? 'Export ready — all required criteria met' : `${readiness.requiredPassed} of ${readiness.requiredTotal} required criteria met`}</div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${readiness.ready ? 'text-green-700' : 'text-amber-700'}`}>{readiness.score}%</div>
              </div>
              <div className="p-5 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Checklist</div>
                {readiness.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {check.passed
                      ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      : <AlertTriangle size={16} className={`shrink-0 ${check.required ? 'text-red-400' : 'text-amber-400'}`} />
                    }
                    <span className={`text-sm ${check.passed ? 'text-gray-700' : check.required ? 'text-red-700 font-medium' : 'text-gray-500'}`}>
                      {check.label}
                    </span>
                    {check.required && !check.passed && (
                      <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
                    )}
                    {!check.required && !check.passed && (
                      <span className="ml-auto text-xs text-amber-500">Recommended</span>
                    )}
                  </div>
                ))}
              </div>
              {!readiness.ready && (
                <div className="px-5 pb-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                    <strong>Next steps: </strong>Register a timber lot and obtain RWVCA certification to meet the minimum export documentation requirements.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'lots' && <div className="grid grid-cols-3 gap-6">
        {/* Lot list */}
        <div className="col-span-2 space-y-3">
          {timberLots.map((lot) => (
            <div key={lot.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                onClick={() => { setExpanded(expandedLot === lot.id ? null : lot.id); setSelected(lot); }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-900">{lot.id}</span>
                      {lot.certified && <Award size={14} className="text-amber-500" />}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{lot.species} · {lot.volume} m³ · {lot.gradeClass}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[lot.status]}`}>
                    {lot.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  {expandedLot === lot.id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </button>

              {expandedLot === lot.id && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 mb-4">
                    <div><span className="text-gray-400 block mb-0.5">Member</span>{lot.memberName}</div>
                    <div><span className="text-gray-400 block mb-0.5">Harvest Date</span>{lot.harvestDate}</div>
                    <div><span className="text-gray-400 block mb-0.5">Location</span>{lot.harvestLocation}</div>
                  </div>

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Custody Chain</h3>
                  <div className="space-y-2 mb-4">
                    {lot.custody.map((c, i) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${i === 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
                          {i < lot.custody.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                        </div>
                        <div className="pb-2">
                          <div className="text-xs font-medium text-gray-800">{c.action} — {c.handler}</div>
                          <div className="text-xs text-gray-400">{c.location} · {new Date(c.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                          {c.notes && <div className="text-xs text-gray-500 italic mt-0.5">{c.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(lot); setShowRecord(true); }}
                      className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800">
                      + Log Transfer
                    </button>
                    {!lot.certified && (
                      <button onClick={() => certifyLot(lot.id)}
                        className="text-xs border border-amber-400 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50">
                        Issue RWVCA Certification
                      </button>
                    )}
                    {lot.certified && (
                      <span className="text-xs inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                        <Award size={12} /> RWVCA Certified
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* QR code panel */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">QR Code Viewer</h2>
            {selected ? (
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG
                  value={JSON.stringify({
                    lotId:    selected.id,
                    species:  selected.species,
                    volume:   selected.volume,
                    member:   selected.memberName,
                    certified:selected.certified,
                    steps:    selected.custody.length,
                  })}
                  size={180}
                  level="H"
                  className="rounded-lg"
                />
                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-gray-900">{selected.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{selected.species}</div>
                  <div className="text-xs text-gray-400">{selected.volume} m³ · {selected.gradeClass}</div>
                  {selected.certified && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Award size={10} /> RWVCA Certified
                    </div>
                  )}
                </div>
                <div className="w-full pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-400 text-center">Scan to verify chain of custody · {selected.custody.length} step{selected.custody.length !== 1 ? 's' : ''} recorded</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                Select a timber lot to view its QR code
              </div>
            )}
          </div>
        </div>
      </div>}

      {/* Create lot modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-6" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            <h2 className="font-bold text-gray-900 mb-5">Register New Timber Lot</h2>
            <form onSubmit={createLot} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Member *</label>
                <select required value={newLot.memberId} onChange={(e) => setNewLot({ ...newLot, memberId: e.target.value })} className={sel}>
                  <option value="">— Select member —</option>
                  {members.filter((m) => m.status === 'active').map((m) => <option key={m.id} value={m.id}>{m.businessName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Species *</label>
                  <select value={newLot.species} onChange={(e) => setNewLot({ ...newLot, species: e.target.value })} className={sel}>
                    {SPECIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grade</label>
                  <select value={newLot.gradeClass} onChange={(e) => setNewLot({ ...newLot, gradeClass: e.target.value })} className={sel}>
                    <option>Grade A</option><option>Grade B</option><option>Grade C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Volume (m³) *</label>
                  <input type="number" required min={0.1} step={0.5} value={newLot.volume} onChange={(e) => setNewLot({ ...newLot, volume: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Harvest Date</label>
                  <input type="date" value={newLot.harvestDate} onChange={(e) => setNewLot({ ...newLot, harvestDate: e.target.value })} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Harvest Location *</label>
                <input required value={newLot.harvestLocation} onChange={(e) => setNewLot({ ...newLot, harvestLocation: e.target.value })} placeholder="e.g. Gakenke Community Forest, Block 3" className={inp} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Register Lot + Generate QR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add custody record modal */}
      {showRecord && selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-6" onClick={() => setShowRecord(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowRecord(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            <h2 className="font-bold text-gray-900 mb-1">Log Custody Transfer</h2>
            <p className="text-xs text-gray-400 mb-5">Lot: {selected.id} · {selected.species}</p>
            <form onSubmit={addRecord} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Action *</label>
                  <select value={newRecord.action} onChange={(e) => setNewRecord({ ...newRecord, action: e.target.value })} className={sel}>
                    {['Transported', 'Received at mill', 'Processed and graded', 'Sold to buyer', 'Exported'].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Timestamp</label>
                  <input type="datetime-local" value={newRecord.timestamp} onChange={(e) => setNewRecord({ ...newRecord, timestamp: e.target.value })} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Handler / Party *</label>
                <input required value={newRecord.handler} onChange={(e) => setNewRecord({ ...newRecord, handler: e.target.value })} placeholder="Company or person name" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input value={newRecord.location} onChange={(e) => setNewRecord({ ...newRecord, location: e.target.value })} placeholder="Town, road, facility name" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input value={newRecord.notes} onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })} placeholder="Truck plate, moisture %, certificate ref…" className={inp} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowRecord(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Log Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
