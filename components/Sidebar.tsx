'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, TrendingUp, QrCode, GraduationCap, BarChart2,
} from 'lucide-react';

const nav = [
  { href: '/',               label: 'Dashboard',           icon: LayoutDashboard },
  { href: '/members',        label: 'Member CRM',           icon: Users },
  { href: '/business-plan',  label: 'Business Plans',       icon: FileText },
  { href: '/market',         label: 'Market Intelligence',  icon: TrendingUp },
  { href: '/traceability',   label: 'Traceability',         icon: QrCode },
  { href: '/learning',       label: 'Learning Platform',    icon: GraduationCap },
  { href: '/report',         label: 'Sector Report',        icon: BarChart2 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-green-900 text-white flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-green-800">
        <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-0.5">RWVCA</div>
        <div className="text-sm font-semibold text-white leading-snug">Digital Platform</div>
        <div className="text-xs text-green-500 mt-0.5">Rwanda Wood Value Chain</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-green-800 text-white font-semibold border-l-2 border-green-300'
                  : 'text-green-200 hover:text-white hover:bg-green-800/50 border-l-2 border-transparent'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-green-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Platform live</span>
        </div>
        <div className="text-xs text-green-600">MVP v0.1 · May 2026</div>
      </div>
    </aside>
  );
}
