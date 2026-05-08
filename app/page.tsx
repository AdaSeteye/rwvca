'use client';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Users, FileText, TrendingUp, QrCode, GraduationCap,
  ArrowRight, CheckCircle2, Clock, ArrowUpRight, BarChart2, Award,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MEMBER_GROWTH, PRODUCTION_BY_PROVINCE } from '@/lib/mock-data';

const PIE_COLORS = ['#15803d', '#b45309', '#0369a1', '#7c3aed', '#be123c'];

const TYPE_LABELS: Record<string, string> = {
  harvester: 'Harvester', sawmill: 'Sawmill', furniture: 'Furniture',
  trader: 'Trader', exporter: 'Exporter',
};

const fmtRWF = (n: number) =>
  n >= 1_000_000_000
    ? `RWF ${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000
    ? `RWF ${(n / 1_000_000).toFixed(0)}M`
    : `RWF ${n.toLocaleString()}`;

export default function Dashboard() {
  const { members, timberLots, enrollments, courses } = useStore();

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const totalVolume = members.reduce((a, m) => a + m.productionVolume, 0);
  const estimatedAnnualValue = totalVolume * 12 * 67000;
  const certifiedLots = timberLots.filter((l) => l.certified).length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const openTenders = 3;

  const typeData = (['harvester', 'sawmill', 'furniture', 'trader', 'exporter'] as const).map((t) => ({
    name: TYPE_LABELS[t],
    value: members.filter((m) => m.memberType === t).length,
  })).filter((d) => d.value > 0);

  const recentActivity = [
    { icon: Award,        color: 'text-amber-500', text: 'LOT-003 certified — Maesopsis, 42m³ exported to Uganda buyer', time: '3 days ago' },
    { icon: CheckCircle2, color: 'text-green-500', text: 'Niyibizi Construction Supply completed Sustainable Harvesting course', time: '4 days ago' },
    { icon: CheckCircle2, color: 'text-blue-500',  text: 'New member registered: Josephine Kayitesi — Gasabo (Furniture)', time: '5 days ago' },
    { icon: Clock,        color: 'text-amber-500', text: 'LOT-002 (Grevillea, 18m³) logged in-transit — Gakenke Depot', time: '1 week ago' },
    { icon: CheckCircle2, color: 'text-green-500', text: 'Ingabire Highland Timber completed Chainsaw Safety course', time: '1 week ago' },
    { icon: CheckCircle2, color: 'text-purple-500',text: 'Bizimana Wood Exports completed EUDR Compliance course', time: '2 weeks ago' },
  ];

  const modules = [
    { href: '/members',       label: 'Member CRM',          icon: Users,          count: `${activeMembers} active`, color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    { href: '/business-plan', label: 'Business Plans',       icon: FileText,       count: '30-min generation',      color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
    { href: '/market',        label: 'Market Intelligence',  icon: TrendingUp,     count: `${openTenders} tenders open`, color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    { href: '/traceability',  label: 'Traceability',         icon: QrCode,         count: `${timberLots.length} lots tracked`, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    { href: '/learning',      label: 'Learning Platform',    icon: GraduationCap,  count: `${completedEnrollments} completions`, color: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200' },
    { href: '/report',        label: 'Sector Report',        icon: BarChart2,      count: 'Policy brief generator', color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">RWVCA · Digital Platform</div>
          <h1 className="text-2xl font-bold text-gray-900">Sector Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">Rwanda Wood Value Chain Association — Live Dashboard · May 2026</p>
        </div>
        <Link href="/report"
          className="flex items-center gap-2 bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-800 transition-colors">
          <BarChart2 size={15} /> Generate Sector Report <ArrowRight size={14} />
        </Link>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Members',          value: activeMembers,                  sub: `${members.filter(m=>m.status==='pending').length} pending approval`, change: '+3 this quarter', up: true, color: 'text-green-700' },
          { label: 'Monthly Production',      value: `${totalVolume.toLocaleString()} m³`, sub: 'combined across all members',  change: '+12% vs last quarter', up: true, color: 'text-blue-700' },
          { label: 'Est. Annual Sector Value',value: fmtRWF(estimatedAnnualValue),   sub: 'based on current market prices',   change: 'Calculated from live data', up: true, color: 'text-amber-700' },
          { label: 'Training Completions',    value: completedEnrollments,           sub: `across ${courses.length} courses`, change: '+4 this month', up: true, color: 'text-rose-700' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">{kpi.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{kpi.sub}</div>
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
              <ArrowUpRight size={12} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Member growth */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Member Growth</h2>
              <p className="text-xs text-gray-400 mt-0.5">Cumulative registered members since platform launch</p>
            </div>
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">{members.length} total</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MEMBER_GROWTH} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Area type="monotone" dataKey="members" stroke="#15803d" strokeWidth={2} fill="url(#memberGrad)" dot={{ r: 3, fill: '#15803d' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Member type pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-3">
            <h2 className="font-semibold text-gray-900 text-sm">Members by Type</h2>
            <p className="text-xs text-gray-400 mt-0.5">Value chain representation</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Province production + modules */}
      <div className="grid grid-cols-3 gap-5">
        {/* Province bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-1">Production Volume by Province</h2>
          <p className="text-xs text-gray-400 mb-4">m³ per month · combined member output</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={PRODUCTION_BY_PROVINCE} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="province" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v} m³`, 'Volume']} />
              <Bar dataKey="volume" fill="#15803d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module quick-access */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Platform Modules</h2>
          <div className="grid grid-cols-3 gap-3">
            {modules.map(({ href, label, icon: Icon, count, color, bg, border }) => (
              <Link key={href} href={href}
                className={`rounded-lg border ${border} ${bg} p-3.5 flex flex-col gap-2 hover:opacity-90 transition-opacity group`}>
                <Icon size={18} className={color} />
                <div>
                  <div className={`font-semibold text-xs ${color}`}>{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{count}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${color} mt-auto`}>
                  Open <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: activity + sector highlights */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Recent Platform Activity</h2>
          <div className="space-y-3.5">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon size={15} className={`mt-0.5 shrink-0 ${item.color}`} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-900 text-white rounded-xl p-5">
            <div className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2">Sector Opportunity</div>
            <div className="text-2xl font-bold mb-1">RWF 120M</div>
            <div className="text-sm text-green-200">Hospital construction tender open — Musanze</div>
            <div className="text-xs text-green-400 mt-1">Deadline: 12 May 2026 · Closing soon</div>
            <Link href="/market" className="mt-3 inline-flex items-center gap-1 text-xs text-green-300 hover:text-white font-medium">
              View all tenders <ArrowRight size={11} />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Platform Coverage</div>
            {[
              { label: 'Provinces covered', value: `${[...new Set(members.map(m=>m.province))].length} of 5` },
              { label: 'Districts represented', value: `${[...new Set(members.map(m=>m.district))].length}` },
              { label: 'Species tracked', value: '5 commercial species' },
              { label: 'Timber lots logged', value: timberLots.length },
              { label: 'Certified lots', value: certifiedLots },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
