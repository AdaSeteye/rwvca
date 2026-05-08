'use client';
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { TrendingUp, TrendingDown, Bell, Clock, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { INITIAL_MARKET_PRICES, PRICE_HISTORY, INITIAL_TENDERS } from '@/lib/mock-data';
import { SPECIES } from '@/lib/mock-data';

const SPECIES_COLORS: Record<string, string> = {
  'Pinus patula':       '#15803d',
  'Grevillea robusta':  '#b45309',
  'Eucalyptus grandis': '#0369a1',
  'Maesopsis eminii':   '#7c3aed',
  'Markhamia lutea':    '#be123c',
};

const SPECIES_BG: Record<string, string> = {
  'Pinus patula':       'bg-green-600',
  'Grevillea robusta':  'bg-amber-600',
  'Eucalyptus grandis': 'bg-blue-600',
  'Maesopsis eminii':   'bg-purple-600',
  'Markhamia lutea':    'bg-rose-600',
};

const SPECIES_LIGHT: Record<string, string> = {
  'Pinus patula':       'bg-green-50  border-green-300',
  'Grevillea robusta':  'bg-amber-50  border-amber-300',
  'Eucalyptus grandis': 'bg-blue-50   border-blue-300',
  'Maesopsis eminii':   'bg-purple-50 border-purple-300',
  'Markhamia lutea':    'bg-rose-50   border-rose-300',
};

const TRENDS: Record<string, { pct: string; up: boolean }> = {
  'Pinus patula':       { pct: '+11.5%', up: true },
  'Grevillea robusta':  { pct: '+10.8%', up: true },
  'Eucalyptus grandis': { pct: '+14.6%', up: true },
  'Maesopsis eminii':   { pct: '+5.2%',  up: true },
  'Markhamia lutea':    { pct: '+3.8%',  up: true },
};

const fmtRWF = (n: number) =>
  new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);

const TENDER_STYLE: Record<string, { label: string; icon: React.ElementType; cls: string; bar: string }> = {
  'open':         { label: 'Open',         icon: CheckCircle2, cls: 'border-green-200 bg-white', bar: 'bg-green-500' },
  'closing-soon': { label: 'Closing Soon', icon: AlertTriangle,cls: 'border-amber-200 bg-amber-50', bar: 'bg-amber-500' },
  'closed':       { label: 'Closed',       icon: Clock,        cls: 'border-gray-200  bg-gray-50',  bar: 'bg-gray-300' },
};

export default function MarketPage() {
  const [selectedSpecies, setSelected] = useState('Pinus patula');

  const speciesSummary = SPECIES.map((sp) => {
    const prices = INITIAL_MARKET_PRICES.filter((p) => p.species === sp).map((p) => p.pricePerM3);
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    return { species: sp, avg, count: prices.length };
  });

  const trendData = (() => {
    const weeks = [...new Set(PRICE_HISTORY.map((p) => p.week))];
    return weeks.map((week) => {
      const row: Record<string, number | string> = { week };
      SPECIES.forEach((sp) => {
        const entry = PRICE_HISTORY.find((p) => p.week === week && p.species === sp);
        if (entry) row[sp] = entry.avgPrice;
      });
      return row;
    });
  })();

  const districtPrices = INITIAL_MARKET_PRICES.filter((p) => p.species === selectedSpecies);
  const trend = TRENDS[selectedSpecies];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
        <p className="text-gray-500 text-sm mt-0.5">Live timber prices across Rwanda · Updated weekly from member-reported transactions</p>
      </div>

      {/* Species price cards — hero */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {speciesSummary.map(({ species, avg }) => {
          const isSelected = selectedSpecies === species;
          const t = TRENDS[species];
          return (
            <button key={species} onClick={() => setSelected(species)}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${isSelected ? `${SPECIES_LIGHT[species]} shadow-md` : 'bg-white border-gray-100 hover:border-gray-300'}`}>
              <div className={`w-8 h-8 rounded-lg ${SPECIES_BG[species]} mb-3 flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{species.split(' ')[0].charAt(0)}{species.split(' ')[1]?.charAt(0)}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{fmtRWF(avg)}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{species}</div>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${t.up ? 'text-green-600' : 'text-red-500'}`}>
                {t.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {t.pct} since Jan
              </div>
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Price Trends — All Species</h2>
              <p className="text-xs text-gray-400 mt-0.5">Average price per m³ · January to April 2026</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={12} /> All species rising
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => [typeof v === 'number' ? fmtRWF(v) : String(v)]}
                contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {SPECIES.map((sp) => (
                <Line key={sp} type="monotone" dataKey={sp} stroke={SPECIES_COLORS[sp]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-1">{selectedSpecies.split(' ')[0]} Prices by District</h2>
          <p className="text-xs text-gray-400 mb-4">Week of 28 Apr 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtPrices} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="district" tick={{ fontSize: 10 }} width={75} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip formatter={(v: any) => [typeof v === 'number' ? fmtRWF(v) : String(v), 'Price/m³']} contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              <Bar dataKey="pricePerM3" fill={SPECIES_COLORS[selectedSpecies] || '#15803d'} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Full Price Table — 28 April 2026</h2>
          <span className="text-xs text-gray-400">Source: RWVCA member-reported transactions</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <th className="text-left px-5 py-3 font-medium">Species</th>
              <th className="text-left px-4 py-3 font-medium">District</th>
              <th className="text-left px-4 py-3 font-medium">Grade</th>
              <th className="text-right px-5 py-3 font-medium">Price per m³</th>
              <th className="text-right px-5 py-3 font-medium">Since Jan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {INITIAL_MARKET_PRICES.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.species === selectedSpecies ? 'bg-green-50/40' : ''}`}
                onClick={() => setSelected(p.species)} style={{ cursor: 'pointer' }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${SPECIES_BG[p.species]}`} />
                    <span className="text-gray-800 italic text-xs">{p.species}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{p.district}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.grade === 'Grade A' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {p.grade}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">{fmtRWF(p.pricePerM3)}</td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs font-semibold text-green-600 flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} /> {TRENDS[p.species].pct}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tenders */}
      <div className="flex items-center gap-2 mb-4">
        <Bell size={16} className="text-amber-600" />
        <h2 className="font-bold text-gray-900">Open Procurement Opportunities</h2>
        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
          {INITIAL_TENDERS.filter(t => t.status !== 'closed').length} active
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {INITIAL_TENDERS.map((t) => {
          const style = TENDER_STYLE[t.status];
          return (
            <div key={t.id} className={`rounded-2xl border-2 p-5 ${style.cls} ${t.status === 'closed' ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{t.title}</h3>
                <span className={`shrink-0 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                  t.status === 'open' ? 'bg-green-100 text-green-800' :
                  t.status === 'closing-soon' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-600'}`}>
                  <style.icon size={10} /> {style.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-3">
                <div><span className="text-gray-400">Organisation · </span>{t.organization}</div>
                <div><span className="text-gray-400">Value · </span><span className="font-semibold text-gray-900">{t.estimatedValue}</span></div>
                <div><span className="text-gray-400">Deadline · </span>{t.deadline}</div>
                <div><span className="text-gray-400">Location · </span>{t.district}</div>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{t.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {t.species.map((sp) => (
                    <span key={sp} className={`text-xs px-2 py-0.5 rounded-full ${SPECIES_BG[sp] || 'bg-gray-200'} text-white`}>
                      {sp.split(' ')[0]}
                    </span>
                  ))}
                </div>
                {t.status !== 'closed' && (
                  <button className="text-xs text-green-700 font-semibold hover:underline">Express Interest</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
