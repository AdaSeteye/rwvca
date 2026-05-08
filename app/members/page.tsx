'use client';
import { useState } from 'react';
import {
  Plus, Search, X, CheckCircle2, Clock, XCircle,
  MapPin, Phone, Layers, LayoutGrid, List, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Member, MemberType } from '@/lib/types';
import { DISTRICTS, PROVINCES, SPECIES } from '@/lib/mock-data';

const TYPE_LABELS: Record<MemberType, string> = {
  harvester: 'Harvester', sawmill: 'Sawmill', furniture: 'Furniture Maker',
  trader: 'Timber Trader', exporter: 'Exporter',
};

const TYPE_COLORS: Record<MemberType, string> = {
  harvester: 'bg-green-100 text-green-800',
  sawmill:   'bg-blue-100  text-blue-800',
  furniture: 'bg-purple-100 text-purple-800',
  trader:    'bg-amber-100 text-amber-800',
  exporter:  'bg-rose-100  text-rose-800',
};

const AVATAR_COLORS = [
  'bg-green-200 text-green-800', 'bg-blue-200 text-blue-800',
  'bg-amber-200 text-amber-800', 'bg-purple-200 text-purple-800',
  'bg-rose-200 text-rose-800',   'bg-teal-200  text-teal-800',
];

const STATUS_INFO = {
  active:   { label: 'Active',   icon: CheckCircle2, cls: 'bg-green-50 text-green-700 border-green-200' },
  pending:  { label: 'Pending',  icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  inactive: { label: 'Inactive', icon: XCircle,      cls: 'bg-gray-50  text-gray-500  border-gray-200' },
};

const BLANK: Omit<Member, 'id' | 'joinedDate'> = {
  name: '', businessName: '', district: DISTRICTS[0], province: PROVINCES[0],
  phone: '', email: '', species: [], productionVolume: 0, equipment: [],
  certifications: [], status: 'active', memberType: 'sawmill',
};

function MemberCard({ member, index, onClick }: { member: Member; index: number; onClick: () => void }) {
  const avatarCls = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const badge = STATUS_INFO[member.status];
  const typeCls = TYPE_COLORS[member.memberType];
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:border-green-300 hover:shadow-md transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${avatarCls}`}>
            {member.businessName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm leading-tight truncate">{member.businessName}</div>
            <div className="text-xs text-gray-400 mt-0.5 truncate">{member.name}</div>
          </div>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeCls}`}>{TYPE_LABELS[member.memberType]}</span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={11} className="text-gray-400 shrink-0" />
          {member.district}, {member.province}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Phone size={11} className="text-gray-400 shrink-0" />
          {member.phone || 'No phone on file'}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Layers size={11} className="text-gray-400 shrink-0" />
          {member.productionVolume} m³ / month
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {member.species.slice(0, 2).map((s) => (
          <span key={s} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">
            {s.split(' ')[0]}
          </span>
        ))}
        {member.species.length > 2 && (
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">+{member.species.length - 2}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">Joined {new Date(member.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
        <div className="flex items-center gap-1 text-xs text-green-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View profile <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
}

export default function MembersPage() {
  const { members, addMember } = useStore();
  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState<string>('all');
  const [view, setView]         = useState<'cards' | 'list'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(BLANK);
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.businessName.toLowerCase().includes(q) || m.district.toLowerCase().includes(q);
    const matchT = typeFilter === 'all' || m.memberType === typeFilter;
    return matchQ && matchT;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMember({ ...form, id: `m${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    setForm(BLANK);
  }

  function toggleSpecies(sp: string) {
    setForm((f) => ({
      ...f,
      species: f.species.includes(sp) ? f.species.filter((s) => s !== sp) : [...f.species, sp],
    }));
  }

  const inpCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const selCls = inpCls + ' bg-white';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Registry</h1>
          <p className="text-gray-500 text-sm mt-0.5">Verified profiles of all RWVCA member businesses across Rwanda</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
          <Plus size={16} /> Add New Member
        </button>
      </div>

      {/* Type summary row */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <button onClick={() => setType('all')}
          className={`rounded-xl border p-3 text-left transition-colors ${typeFilter === 'all' ? 'bg-green-700 border-green-700 text-white' : 'bg-white border-gray-200 hover:border-green-300'}`}>
          <div className={`text-2xl font-bold ${typeFilter === 'all' ? 'text-white' : 'text-gray-900'}`}>{members.length}</div>
          <div className={`text-xs mt-0.5 ${typeFilter === 'all' ? 'text-green-200' : 'text-gray-500'}`}>All Members</div>
        </button>
        {(['harvester', 'sawmill', 'furniture', 'trader', 'exporter'] as MemberType[]).map((type) => {
          const count = members.filter((m) => m.memberType === type).length;
          const active = typeFilter === type;
          return (
            <button key={type} onClick={() => setType(active ? 'all' : type)}
              className={`rounded-xl border p-3 text-left transition-colors ${active ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200 hover:border-green-300'}`}>
              <div className={`text-2xl font-bold ${active ? 'text-green-800' : 'text-gray-900'}`}>{count}</div>
              <div className="text-xs text-gray-500 mt-0.5">{TYPE_LABELS[type]}s</div>
            </button>
          );
        })}
      </div>

      {/* Search & view toggle */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, business, or district…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
        </div>
        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button onClick={() => setView('cards')} className={`px-3 py-2 transition-colors ${view === 'cards' ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}><LayoutGrid size={16} /></button>
          <button onClick={() => setView('list')}  className={`px-3 py-2 transition-colors ${view === 'list'  ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}><List size={16} /></button>
        </div>
      </div>

      {/* Card view */}
      {view === 'cards' && (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <MemberCard key={m.id} member={m} index={i} onClick={() => setSelected(m)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">No members match your search.</div>
          )}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Business</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Species</th>
                <th className="text-right px-4 py-3 font-medium">Vol (m³/mo)</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m, i) => {
                const badge = STATUS_INFO[m.status];
                const avatarCls = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarCls}`}>
                          {m.businessName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{m.businessName}</div>
                          <div className="text-xs text-gray-400">{m.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[m.memberType]}`}>{TYPE_LABELS[m.memberType]}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">{m.district}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {m.species.slice(0, 2).map((s) => (
                          <span key={s} className="bg-green-50 text-green-700 text-xs px-1.5 py-0.5 rounded border border-green-100">{s.split(' ')[0]}</span>
                        ))}
                        {m.species.length > 2 && <span className="text-xs text-gray-400">+{m.species.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-gray-900">{m.productionVolume}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${badge.cls}`}>
                        <badge.icon size={10} /> {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => setSelected(m)} className="text-xs text-green-700 font-medium hover:underline">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Member detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-green-900 text-white p-6 rounded-t-2xl relative">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-green-400 hover:text-white"><X size={18} /></button>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${AVATAR_COLORS[members.indexOf(selected) % AVATAR_COLORS.length]} opacity-90`}>
                  {selected.businessName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selected.businessName}</h2>
                  <p className="text-green-300 text-sm">{selected.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[selected.memberType]}`}>{TYPE_LABELS[selected.memberType]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_INFO[selected.status].cls}`}>{STATUS_INFO[selected.status].label}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['District', selected.district], ['Province', selected.province],
                  ['Phone', selected.phone || '—'], ['Email', selected.email || '—'],
                  ['Member since', new Date(selected.joinedDate).toLocaleDateString('en-GB', { dateStyle: 'medium' })],
                  ['Monthly volume', `${selected.productionVolume} m³`],
                ].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                    <div className="font-semibold text-gray-800 text-sm">{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Species handled</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.species.map((s) => <span key={s} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200 font-medium">{s}</span>)}
                  {selected.species.length === 0 && <span className="text-sm text-gray-400">None on file</span>}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Equipment</div>
                <div className="text-sm text-gray-700">{selected.equipment.join(', ') || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Certifications</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.certifications.length
                    ? selected.certifications.map((c) => <span key={c} className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200 font-medium">{c}</span>)
                    : <span className="text-sm text-gray-400">None on file</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add member modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-start justify-center p-6 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-green-900 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Register New Member</h2>
                <p className="text-green-300 text-xs mt-0.5">Add a verified RWVCA member business to the platform</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-green-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Owner Full Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inpCls} /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Business Name *</label><input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className={inpCls} /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 7xx xxx xxx" className={inpCls} /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inpCls} /></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Member Type *</label>
                  <select required value={form.memberType} onChange={(e) => setForm({ ...form, memberType: e.target.value as MemberType })} className={selCls}>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">District *</label>
                  <select required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={selCls}>
                    {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Province</label>
                  <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={selCls}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Monthly Volume (m³)</label><input type="number" min={0} value={form.productionVolume} onChange={(e) => setForm({ ...form, productionVolume: Number(e.target.value) })} className={inpCls} /></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Species Handled</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIES.map((sp) => (
                    <button type="button" key={sp} onClick={() => toggleSpecies(sp)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.species.includes(sp) ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Equipment (comma-separated)</label>
                <input value={form.equipment.join(', ')} onChange={(e) => setForm({ ...form, equipment: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} placeholder="Band saw, Chainsaw, Truck" className={inpCls} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800">Register Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
