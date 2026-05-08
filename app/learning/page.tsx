'use client';
import { useState } from 'react';
import { GraduationCap, Award, Clock, X, CheckCircle2, Circle, Users, BookOpen, MessageCircle, Monitor, Signal } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Course } from '@/lib/types';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Safety:        { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  Sustainability:{ bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  Business:      { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  Quality:       { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  Compliance:    { bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
};

const COURSE_HEADER_COLORS: Record<string, string> = {
  Safety:        'bg-red-600',
  Sustainability:'bg-green-700',
  Business:      'bg-blue-600',
  Quality:       'bg-amber-600',
  Compliance:    'bg-purple-700',
};

const DELIVERY_ICONS: Record<string, React.ElementType> = {
  WhatsApp: MessageCircle,
  USSD:     Signal,
  Web:      Monitor,
};

function ProgressRing({ pct, size = 44 }: { pct: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#15803d" strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

export default function LearningPage() {
  const { members, courses, enrollments, enrollMember, completeLesson } = useStore();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollModal, setEnrollModal]       = useState<Course | null>(null);
  const [enrollMemberId, setEnrollMemberId] = useState('');
  const [filter, setFilter]                 = useState('All');

  const categories = ['All', 'Safety', 'Sustainability', 'Business', 'Quality', 'Compliance'];
  const filtered = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  function doEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollModal || !enrollMemberId) return;
    const member = members.find((m) => m.id === enrollMemberId);
    enrollMember({
      id: 'e-' + Date.now(), memberId: enrollMemberId,
      memberName: member?.businessName ?? 'Unknown', courseId: enrollModal.id,
      startDate: new Date().toISOString().split('T')[0], completedLessons: [], status: 'active',
    });
    setEnrollModal(null); setEnrollMemberId('');
  }

  const completions = enrollments.filter((e) => e.status === 'completed').length;
  const active      = enrollments.filter((e) => e.status === 'active').length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Platform</h1>
        <p className="text-gray-500 text-sm mt-0.5">Training delivered via WhatsApp and USSD — any phone, anywhere in Rwanda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen,      label: 'Courses Available',  value: courses.length,  color: 'text-blue-700',   bg: 'bg-blue-50' },
          { icon: Users,         label: 'Total Enrolments',   value: enrollments.length, color: 'text-green-700', bg: 'bg-green-50' },
          { icon: Award,         label: 'Certificates Issued', value: completions,    color: 'text-amber-700',  bg: 'bg-amber-50' },
          { icon: GraduationCap, label: 'In Progress',        value: active,          color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map((cat) => {
          const style = cat !== 'All' ? CATEGORY_STYLES[cat] : null;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`text-xs px-4 py-1.5 rounded-full border font-semibold transition-colors ${
                filter === cat
                  ? (style ? `${style.bg} ${style.text} border-current` : 'bg-green-700 text-white border-green-700')
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Course cards */}
        <div className="col-span-2 space-y-4">
          {filtered.map((course) => {
            const ces = enrollments.filter((e) => e.courseId === course.id);
            const done = ces.filter((e) => e.status === 'completed').length;
            const hdr = COURSE_HEADER_COLORS[course.category] || 'bg-gray-700';
            const cat = CATEGORY_STYLES[course.category];
            const isOpen = selectedCourse?.id === course.id;
            return (
              <div key={course.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${isOpen ? 'border-green-400' : 'border-transparent shadow-sm hover:border-gray-200'}`}>
                {/* Colored top bar */}
                <div className={`${hdr} px-5 py-3 flex items-center justify-between`}>
                  <span className={`text-xs font-bold uppercase tracking-wider text-white/80`}>{course.category}</span>
                  <div className="flex items-center gap-2">
                    {course.delivery.map((d) => {
                      const Icon = DELIVERY_ICONS[d];
                      return <Icon key={d} size={14} className="text-white/70" title={d} />;
                    })}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{course.title}</h3>
                    <button onClick={() => setEnrollModal(course)}
                      className="shrink-0 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-800 transition-colors">
                      Enrol
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{course.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {course.durationMin} min</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lessons.length} lessons</span>
                      <span>{course.languages.join(' · ')}</span>
                    </div>
                    <button onClick={() => setSelectedCourse(isOpen ? null : course)}
                      className="text-xs text-green-700 font-semibold hover:underline">
                      {isOpen ? 'Hide lessons' : 'View lessons'}
                    </button>
                  </div>

                  {/* Enrolment bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <span className="font-semibold text-gray-700">{ces.length}</span> enrolled · <span className="font-semibold text-green-700">{done}</span> certified
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat?.bg} ${cat?.text}`}>
                      {course.category}
                    </div>
                  </div>
                </div>

                {/* Lesson list */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Course Outline</div>
                    <div className="space-y-2">
                      {course.lessons.map((lesson, i) => (
                        <div key={lesson.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                          <div className={`w-7 h-7 rounded-full ${hdr} text-white text-xs flex items-center justify-center font-bold shrink-0`}>{i + 1}</div>
                          <div className="flex-1 text-sm text-gray-700 font-medium">{lesson.title}</div>
                          <div className="text-xs text-gray-400 shrink-0">{lesson.durationMin} min</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Member Progress</h2>
            <div className="space-y-4">
              {enrollments.map((e) => {
                const course = courses.find((c) => c.id === e.courseId);
                if (!course) return null;
                const pct = Math.round((e.completedLessons.length / course.lessons.length) * 100);
                return (
                  <div key={e.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <ProgressRing pct={pct} size={40} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{e.memberName}</div>
                        <div className="text-xs text-gray-400 truncate">{course.title}</div>
                      </div>
                      {e.status === 'completed' && (
                        <Award size={16} className="text-amber-500 shrink-0 ml-auto" />
                      )}
                    </div>
                    {e.status === 'active' && (
                      <div className="space-y-1 ml-11">
                        {course.lessons.map((lesson) => {
                          const done = e.completedLessons.includes(lesson.id);
                          return (
                            <button key={lesson.id} onClick={() => completeLesson(e.id, lesson.id, course.lessons.length)}
                              disabled={done}
                              className="w-full flex items-center gap-2 text-xs text-left hover:text-green-700 disabled:opacity-50 py-0.5">
                              {done ? <CheckCircle2 size={12} className="text-green-500 shrink-0" /> : <Circle size={12} className="text-gray-300 shrink-0" />}
                              <span className={done ? 'line-through text-gray-400' : ''}>{lesson.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {e.status === 'completed' && (
                      <div className="text-xs text-gray-400 ml-11">Certified {e.completedDate}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery channels */}
          <div className="bg-green-900 text-white rounded-2xl p-5">
            <h2 className="font-bold mb-3 text-sm">Delivery Channels</h2>
            {[
              { icon: MessageCircle, label: 'WhatsApp', desc: 'Used by 95% of members — no setup needed' },
              { icon: Signal,        label: 'USSD',      desc: 'Works on any mobile phone, no internet required' },
              { icon: Monitor,       label: 'Web',        desc: 'Full-featured access on computers and tablets' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 py-2.5 border-b border-green-800 last:border-0">
                <Icon size={16} className="text-green-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-green-300">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrol modal */}
      {enrollModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-6" onClick={() => setEnrollModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`${COURSE_HEADER_COLORS[enrollModal.category]} text-white px-6 py-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{enrollModal.category}</div>
                  <h2 className="font-bold text-base leading-snug">{enrollModal.title}</h2>
                </div>
                <button onClick={() => setEnrollModal(null)} className="text-white/60 hover:text-white mt-0.5"><X size={18} /></button>
              </div>
            </div>
            <form onSubmit={doEnroll} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Member to Enrol *</label>
                <select required value={enrollMemberId} onChange={(e) => setEnrollMemberId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">— Choose a member —</option>
                  {members.filter((m) => m.status === 'active').map((m) => (
                    <option key={m.id} value={m.id}
                      disabled={enrollments.some((e) => e.memberId === m.id && e.courseId === enrollModal.id)}>
                      {m.businessName}{enrollments.some((e) => e.memberId === m.id && e.courseId === enrollModal.id) ? ' — already enrolled' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                <div className="font-semibold text-gray-700 mb-1">Course details</div>
                <div>{enrollModal.lessons.length} lessons · {enrollModal.durationMin} min · {enrollModal.languages.join(', ')}</div>
                <div className="mt-1">Delivered via: {enrollModal.delivery.join(', ')}</div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEnrollModal(null)} className="text-sm text-gray-500 px-4 py-2">Cancel</button>
                <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800">Enrol Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
