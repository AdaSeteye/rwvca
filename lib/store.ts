'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Member, TimberLot, Course, Enrollment, CustodyRecord } from './types';
import {
  INITIAL_MEMBERS,
  INITIAL_TIMBER_LOTS,
  INITIAL_COURSES,
  INITIAL_ENROLLMENTS,
} from './mock-data';

interface RWVCAStore {
  members: Member[];
  timberLots: TimberLot[];
  courses: Course[];
  enrollments: Enrollment[];

  addMember: (m: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;

  addTimberLot: (lot: TimberLot) => void;
  addCustodyRecord: (lotId: string, record: CustodyRecord) => void;
  certifyLot: (lotId: string) => void;

  enrollMember: (enrollment: Enrollment) => void;
  completeLesson: (enrollmentId: string, lessonId: string, totalLessons: number) => void;
}

export const useStore = create<RWVCAStore>()(
  persist(
    (set) => ({
      members: INITIAL_MEMBERS,
      timberLots: INITIAL_TIMBER_LOTS,
      courses: INITIAL_COURSES,
      enrollments: INITIAL_ENROLLMENTS,

      addMember: (m) => set((s) => ({ members: [...s.members, m] })),
      updateMember: (id, updates) =>
        set((s) => ({
          members: s.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      addTimberLot: (lot) => set((s) => ({ timberLots: [...s.timberLots, lot] })),
      addCustodyRecord: (lotId, record) =>
        set((s) => ({
          timberLots: s.timberLots.map((lot) =>
            lot.id === lotId ? { ...lot, custody: [...lot.custody, record] } : lot,
          ),
        })),
      certifyLot: (lotId) =>
        set((s) => ({
          timberLots: s.timberLots.map((lot) =>
            lot.id === lotId ? { ...lot, certified: true, status: 'sold' } : lot,
          ),
        })),

      enrollMember: (enrollment) =>
        set((s) => ({ enrollments: [...s.enrollments, enrollment] })),
      completeLesson: (enrollmentId, lessonId, totalLessons) =>
        set((s) => ({
          enrollments: s.enrollments.map((e) => {
            if (e.id !== enrollmentId) return e;
            const completed = e.completedLessons.includes(lessonId)
              ? e.completedLessons
              : [...e.completedLessons, lessonId];
            const done = completed.length >= totalLessons;
            return {
              ...e,
              completedLessons: completed,
              status: done ? 'completed' : 'active',
              completedDate: done ? new Date().toISOString().split('T')[0] : e.completedDate,
            };
          }),
        })),
    }),
    { name: 'rwvca-store' },
  ),
);
