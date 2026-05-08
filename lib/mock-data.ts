import type { Member, TimberLot, Course, Enrollment, MarketPrice, Tender } from './types';

export const DISTRICTS = [
  'Nyamagabe', 'Rusizi', 'Nyamasheke', 'Karongi', 'Rutsiro',
  'Gakenke', 'Musanze', 'Rubavu', 'Nyabihu', 'Burera',
  'Gicumbi', 'Rulindo', 'Kicukiro', 'Gasabo', 'Nyarugenge',
];

export const PROVINCES = ['Western', 'Northern', 'Southern', 'Eastern', 'Kigali City'];

export const SPECIES = ['Pinus patula', 'Grevillea robusta', 'Eucalyptus grandis', 'Maesopsis eminii', 'Markhamia lutea'];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1', name: 'Jean-Pierre Habimana', businessName: 'Habimana Sawmill Ltd',
    district: 'Nyamagabe', province: 'Southern', phone: '+250 788 123 456', email: 'jp.habimana@gmail.com',
    species: ['Pinus patula', 'Eucalyptus grandis'], productionVolume: 85,
    equipment: ['Band saw', 'Circular saw', 'Kiln dryer'], certifications: ['REMA Forest Use Permit'],
    joinedDate: '2024-01-15', status: 'active', memberType: 'sawmill',
  },
  {
    id: 'm2', name: 'Marie-Claire Uwimana', businessName: 'Uwimana Furniture Works',
    district: 'Kicukiro', province: 'Kigali City', phone: '+250 722 987 654', email: 'mc.uwimana@rwandatel.rw',
    species: ['Grevillea robusta', 'Maesopsis eminii'], productionVolume: 40,
    equipment: ['CNC router', 'Thickness planer', 'Edge bander'], certifications: ['RBS Quality Mark'],
    joinedDate: '2024-01-22', status: 'active', memberType: 'furniture',
  },
  {
    id: 'm3', name: 'Alexis Nzeyimana', businessName: 'Nzeyimana Forest Harvesting',
    district: 'Gakenke', province: 'Northern', phone: '+250 785 456 789', email: '',
    species: ['Pinus patula', 'Grevillea robusta'], productionVolume: 120,
    equipment: ['Chainsaw x4', 'Tractor', 'Log skidder'], certifications: [],
    joinedDate: '2024-03-10', status: 'active', memberType: 'harvester',
  },
  {
    id: 'm4', name: 'Solange Mukamana', businessName: 'Mukamana Timber Traders',
    district: 'Rusizi', province: 'Western', phone: '+250 733 654 321', email: 'solange@mukamana.rw',
    species: ['Eucalyptus grandis', 'Pinus patula'], productionVolume: 60,
    equipment: ['Truck x2', 'Forklift'], certifications: ['REMA Forest Use Permit'],
    joinedDate: '2023-11-05', status: 'active', memberType: 'trader',
  },
  {
    id: 'm5', name: 'Emmanuel Bizimana', businessName: 'Bizimana Wood Exports',
    district: 'Gasabo', province: 'Kigali City', phone: '+250 788 001 002', email: 'e.bizimana@woodexports.rw',
    species: ['Maesopsis eminii', 'Markhamia lutea'], productionVolume: 200,
    equipment: ['Container crane', 'Truck x5', 'Grader'], certifications: ['RRA Export Licence', 'EAC Certificate of Origin'],
    joinedDate: '2023-08-14', status: 'active', memberType: 'exporter',
  },
  {
    id: 'm6', name: 'Claudette Nyiransengimana', businessName: 'Nyiransengimana Artisan Workshop',
    district: 'Musanze', province: 'Northern', phone: '+250 722 333 444', email: '',
    species: ['Grevillea robusta'], productionVolume: 15,
    equipment: ['Hand tools', 'Band saw'], certifications: [],
    joinedDate: '2025-01-30', status: 'pending', memberType: 'furniture',
  },
  {
    id: 'm7', name: 'Patrick Nkurunziza', businessName: 'Nkurunziza & Sons Sawmill',
    district: 'Karongi', province: 'Western', phone: '+250 788 555 666', email: 'p.nkurunziza@gmail.com',
    species: ['Eucalyptus grandis', 'Grevillea robusta'], productionVolume: 95,
    equipment: ['Band saw x2', 'Portable mill', 'Truck'], certifications: ['REMA Forest Use Permit'],
    joinedDate: '2023-12-01', status: 'active', memberType: 'sawmill',
  },
  {
    id: 'm8', name: 'Dancille Murekatete', businessName: 'Murekatete Agroforestry Coop',
    district: 'Nyamasheke', province: 'Western', phone: '+250 722 777 888', email: 'dancille@murekatete.rw',
    species: ['Grevillea robusta', 'Markhamia lutea'], productionVolume: 55,
    equipment: ['Chainsaw x2', 'Ox cart'], certifications: ['Community Forest Permit'],
    joinedDate: '2024-04-18', status: 'active', memberType: 'harvester',
  },
  {
    id: 'm9', name: 'Théoneste Habiyaremye', businessName: 'Habiyaremye Furniture Exports',
    district: 'Nyarugenge', province: 'Kigali City', phone: '+250 788 909 010', email: 'theoneste@habiyaremye.rw',
    species: ['Maesopsis eminii', 'Grevillea robusta'], productionVolume: 75,
    equipment: ['CNC router x2', 'Spray booth', 'Van x2'], certifications: ['RBS Quality Mark', 'RRA Export Licence'],
    joinedDate: '2024-02-10', status: 'active', memberType: 'furniture',
  },
  {
    id: 'm10', name: 'Vestine Ingabire', businessName: 'Ingabire Highland Timber',
    district: 'Burera', province: 'Northern', phone: '+250 722 111 222', email: '',
    species: ['Pinus patula'], productionVolume: 110,
    equipment: ['Band saw', 'Chainsaw x3', 'Tractor'], certifications: ['REMA Forest Use Permit'],
    joinedDate: '2024-06-20', status: 'active', memberType: 'harvester',
  },
  {
    id: 'm11', name: 'Gaspard Niyibizi', businessName: 'Niyibizi Construction Supply',
    district: 'Gicumbi', province: 'Northern', phone: '+250 785 333 555', email: 'gaspard@niyibizi.rw',
    species: ['Eucalyptus grandis', 'Pinus patula'], productionVolume: 180,
    equipment: ['Truck x3', 'Forklift', 'Lumber sorter'], certifications: ['REMA Forest Use Permit'],
    joinedDate: '2023-09-30', status: 'active', memberType: 'trader',
  },
  {
    id: 'm12', name: 'Josephine Kayitesi', businessName: 'Kayitesi Décor & Interiors',
    district: 'Gasabo', province: 'Kigali City', phone: '+250 722 444 666', email: 'jo.kayitesi@decor.rw',
    species: ['Markhamia lutea', 'Maesopsis eminii'], productionVolume: 30,
    equipment: ['CNC router', 'Lathe', 'Hand tools'], certifications: ['RBS Quality Mark'],
    joinedDate: '2025-03-05', status: 'active', memberType: 'furniture',
  },
];

export const MEMBER_GROWTH = [
  { month: 'Aug 23', members: 2 },
  { month: 'Sep 23', members: 3 },
  { month: 'Oct 23', members: 4 },
  { month: 'Nov 23', members: 5 },
  { month: 'Dec 23', members: 6 },
  { month: 'Jan 24', members: 7 },
  { month: 'Feb 24', members: 8 },
  { month: 'Mar 24', members: 9 },
  { month: 'Apr 24', members: 10 },
  { month: 'Jun 24', members: 10 },
  { month: 'Jan 25', members: 11 },
  { month: 'Mar 26', members: 12 },
];

export const PRODUCTION_BY_PROVINCE = [
  { province: 'Western',     volume: 350, members: 3 },
  { province: 'Northern',    volume: 300, members: 4 },
  { province: 'Kigali City', volume: 345, members: 4 },
  { province: 'Southern',    volume: 85,  members: 1 },
  { province: 'Eastern',     volume: 0,   members: 0 },
];

export const INITIAL_TIMBER_LOTS: TimberLot[] = [
  {
    id: 'LOT-001', species: 'Pinus patula', volume: 24.5, gradeClass: 'Grade A',
    harvestLocation: 'Nyamagabe Forest Block 7', harvestDate: '2026-04-10',
    memberId: 'm1', memberName: 'Habimana Sawmill Ltd', status: 'at-mill', certified: false,
    custody: [
      { id: 'c1', timestamp: '2026-04-10T08:00:00', handler: 'Habimana Sawmill Ltd', location: 'Nyamagabe Forest Block 7', action: 'Harvested', notes: 'FSC compartment H7-22' },
      { id: 'c2', timestamp: '2026-04-12T14:30:00', handler: 'Mukamana Timber Traders', location: 'Nyamagabe—Butare Road', action: 'Transported', notes: 'Truck RW 4412 A' },
      { id: 'c3', timestamp: '2026-04-13T09:15:00', handler: 'Habimana Sawmill Ltd', location: 'Nyamagabe Sawmill', action: 'Received at mill', notes: 'Moisture content: 22%' },
    ],
  },
  {
    id: 'LOT-002', species: 'Grevillea robusta', volume: 18.0, gradeClass: 'Grade B',
    harvestLocation: 'Gakenke Community Forest', harvestDate: '2026-04-20',
    memberId: 'm3', memberName: 'Nzeyimana Forest Harvesting', status: 'in-transit', certified: false,
    custody: [
      { id: 'c4', timestamp: '2026-04-20T07:00:00', handler: 'Nzeyimana Forest Harvesting', location: 'Gakenke Community Forest', action: 'Harvested', notes: 'Volume verified by RDB ranger' },
      { id: 'c5', timestamp: '2026-04-22T11:00:00', handler: 'Mukamana Timber Traders', location: 'Gakenke Depot', action: 'Loaded for transport', notes: '' },
    ],
  },
  {
    id: 'LOT-003', species: 'Maesopsis eminii', volume: 42.0, gradeClass: 'Grade A',
    harvestLocation: 'Rusizi Plantation Zone 3', harvestDate: '2026-03-28',
    memberId: 'm5', memberName: 'Bizimana Wood Exports', status: 'sold', certified: true,
    custody: [
      { id: 'c6', timestamp: '2026-03-28T06:30:00', handler: 'Bizimana Wood Exports', location: 'Rusizi Plantation Zone 3', action: 'Harvested', notes: '' },
      { id: 'c7', timestamp: '2026-03-30T10:00:00', handler: 'Bizimana Wood Exports', location: 'Kigali Export Depot', action: 'Processed and graded', notes: 'Grade A certification issued' },
      { id: 'c8', timestamp: '2026-04-05T14:00:00', handler: 'Uganda Hardwoods Ltd', location: 'Kigali Inland Container Depot', action: 'Exported to buyer', notes: 'EAC CoO attached, EUDR docs filed' },
    ],
  },
  {
    id: 'LOT-004', species: 'Eucalyptus grandis', volume: 30.0, gradeClass: 'Grade A',
    harvestLocation: 'Karongi Forest Sector 2', harvestDate: '2026-04-25',
    memberId: 'm7', memberName: 'Nkurunziza & Sons Sawmill', status: 'harvested', certified: false,
    custody: [
      { id: 'c9', timestamp: '2026-04-25T07:30:00', handler: 'Nkurunziza & Sons Sawmill', location: 'Karongi Forest Sector 2', action: 'Harvested', notes: 'REMA permit #RMA-2026-0441' },
    ],
  },
  {
    id: 'LOT-005', species: 'Markhamia lutea', volume: 15.5, gradeClass: 'Grade A',
    harvestLocation: 'Nyamasheke Community Plot', harvestDate: '2026-04-18',
    memberId: 'm8', memberName: 'Murekatete Agroforestry Coop', status: 'processed', certified: false,
    custody: [
      { id: 'c10', timestamp: '2026-04-18T08:00:00', handler: 'Murekatete Agroforestry Coop', location: 'Nyamasheke Community Plot', action: 'Harvested', notes: '' },
      { id: 'c11', timestamp: '2026-04-20T09:00:00', handler: 'Habiyaremye Furniture Exports', location: 'Kigali Workshop', action: 'Received at mill', notes: 'Premium quality confirmed' },
      { id: 'c12', timestamp: '2026-04-28T14:00:00', handler: 'Habiyaremye Furniture Exports', location: 'Kigali Workshop', action: 'Processed and graded', notes: 'Dried to 12% MC, Grade A' },
    ],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1', title: 'Chainsaw Safety and Maintenance',
    description: 'Safe operation, daily checks, and routine maintenance for chainsaw operators in plantation and community forest environments.',
    category: 'Safety', languages: ['Kinyarwanda', 'French'], delivery: ['WhatsApp', 'USSD'], durationMin: 45, enrolled: 312,
    lessons: [
      { id: 'l1', title: 'Personal protective equipment', durationMin: 10 },
      { id: 'l2', title: 'Pre-start chainsaw inspection', durationMin: 10 },
      { id: 'l3', title: 'Safe felling technique', durationMin: 15 },
      { id: 'l4', title: 'Maintenance schedule', durationMin: 10 },
    ],
  },
  {
    id: 'c2', title: 'Sustainable Harvesting Practices',
    description: 'Rwanda Forest Conservation Board standards for sustainable harvesting, replanting obligations, and buffer zone management.',
    category: 'Sustainability', languages: ['Kinyarwanda', 'French', 'English'], delivery: ['WhatsApp', 'Web'], durationMin: 60, enrolled: 198,
    lessons: [
      { id: 'l5', title: 'Rwanda forest regulations overview', durationMin: 15 },
      { id: 'l6', title: 'Harvesting quotas and permits', durationMin: 15 },
      { id: 'l7', title: 'Replanting requirements', durationMin: 15 },
      { id: 'l8', title: 'Buffer zone and watershed protection', durationMin: 15 },
    ],
  },
  {
    id: 'c3', title: 'Business Management for Wood SMEs',
    description: 'Practical bookkeeping, cash flow management, and record-keeping skills for small wood sector businesses.',
    category: 'Business', languages: ['Kinyarwanda', 'English'], delivery: ['WhatsApp', 'Web'], durationMin: 75, enrolled: 145,
    lessons: [
      { id: 'l9', title: 'Basic bookkeeping', durationMin: 20 },
      { id: 'l10', title: 'Cash flow for seasonal businesses', durationMin: 20 },
      { id: 'l11', title: 'Invoicing and receipts', durationMin: 15 },
      { id: 'l12', title: 'Record-keeping for loan applications', durationMin: 20 },
    ],
  },
  {
    id: 'c4', title: 'Timber Grading Standards',
    description: 'Practical guide to Rwanda Bureau of Standards grading criteria: moisture content, defect classification, and grade marking.',
    category: 'Quality', languages: ['Kinyarwanda', 'French', 'English'], delivery: ['WhatsApp', 'Web'], durationMin: 50, enrolled: 267,
    lessons: [
      { id: 'l13', title: 'RBS grading overview', durationMin: 10 },
      { id: 'l14', title: 'Measuring moisture content', durationMin: 15 },
      { id: 'l15', title: 'Defect identification and classification', durationMin: 15 },
      { id: 'l16', title: 'Grade marking and documentation', durationMin: 10 },
    ],
  },
  {
    id: 'c5', title: 'Export Compliance and EUDR Basics',
    description: 'EU Deforestation Regulation requirements, due diligence obligations, and documentation for Rwandan timber exporters.',
    category: 'Compliance', languages: ['English', 'French'], delivery: ['Web'], durationMin: 90, enrolled: 44,
    lessons: [
      { id: 'l17', title: 'What is EUDR and who it affects', durationMin: 20 },
      { id: 'l18', title: 'Due diligence requirements', durationMin: 25 },
      { id: 'l19', title: 'Traceability documentation for EU markets', durationMin: 25 },
      { id: 'l20', title: 'Practical compliance checklist', durationMin: 20 },
    ],
  },
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  { id: 'p1',  species: 'Pinus patula',       district: 'Nyamagabe', grade: 'Grade A', pricePerM3: 68000,  weekOf: '2026-04-28' },
  { id: 'p2',  species: 'Pinus patula',       district: 'Nyamagabe', grade: 'Grade B', pricePerM3: 52000,  weekOf: '2026-04-28' },
  { id: 'p3',  species: 'Pinus patula',       district: 'Gakenke',   grade: 'Grade A', pricePerM3: 65000,  weekOf: '2026-04-28' },
  { id: 'p4',  species: 'Pinus patula',       district: 'Rusizi',    grade: 'Grade A', pricePerM3: 70000,  weekOf: '2026-04-28' },
  { id: 'p5',  species: 'Pinus patula',       district: 'Burera',    grade: 'Grade A', pricePerM3: 63000,  weekOf: '2026-04-28' },
  { id: 'p6',  species: 'Grevillea robusta',  district: 'Musanze',   grade: 'Grade A', pricePerM3: 82000,  weekOf: '2026-04-28' },
  { id: 'p7',  species: 'Grevillea robusta',  district: 'Gakenke',   grade: 'Grade A', pricePerM3: 79000,  weekOf: '2026-04-28' },
  { id: 'p8',  species: 'Grevillea robusta',  district: 'Kicukiro',  grade: 'Grade B', pricePerM3: 60000,  weekOf: '2026-04-28' },
  { id: 'p9',  species: 'Grevillea robusta',  district: 'Nyamasheke',grade: 'Grade A', pricePerM3: 80000,  weekOf: '2026-04-28' },
  { id: 'p10', species: 'Eucalyptus grandis', district: 'Rusizi',    grade: 'Grade A', pricePerM3: 55000,  weekOf: '2026-04-28' },
  { id: 'p11', species: 'Eucalyptus grandis', district: 'Karongi',   grade: 'Grade A', pricePerM3: 53000,  weekOf: '2026-04-28' },
  { id: 'p12', species: 'Eucalyptus grandis', district: 'Gicumbi',   grade: 'Grade A', pricePerM3: 50000,  weekOf: '2026-04-28' },
  { id: 'p13', species: 'Maesopsis eminii',   district: 'Gasabo',    grade: 'Grade A', pricePerM3: 120000, weekOf: '2026-04-28' },
  { id: 'p14', species: 'Maesopsis eminii',   district: 'Rusizi',    grade: 'Grade A', pricePerM3: 115000, weekOf: '2026-04-28' },
  { id: 'p15', species: 'Markhamia lutea',    district: 'Gasabo',    grade: 'Grade A', pricePerM3: 145000, weekOf: '2026-04-28' },
  { id: 'p16', species: 'Markhamia lutea',    district: 'Kicukiro',  grade: 'Grade A', pricePerM3: 140000, weekOf: '2026-04-28' },
];

export const PRICE_HISTORY: { week: string; species: string; avgPrice: number }[] = [
  { week: 'Jan W1', species: 'Pinus patula',       avgPrice: 61000 },
  { week: 'Jan W3', species: 'Pinus patula',       avgPrice: 63000 },
  { week: 'Feb W1', species: 'Pinus patula',       avgPrice: 64000 },
  { week: 'Feb W3', species: 'Pinus patula',       avgPrice: 66000 },
  { week: 'Mar W1', species: 'Pinus patula',       avgPrice: 65000 },
  { week: 'Mar W3', species: 'Pinus patula',       avgPrice: 67000 },
  { week: 'Apr W1', species: 'Pinus patula',       avgPrice: 66000 },
  { week: 'Apr W3', species: 'Pinus patula',       avgPrice: 68000 },
  { week: 'Jan W1', species: 'Grevillea robusta',  avgPrice: 74000 },
  { week: 'Jan W3', species: 'Grevillea robusta',  avgPrice: 76000 },
  { week: 'Feb W1', species: 'Grevillea robusta',  avgPrice: 77000 },
  { week: 'Feb W3', species: 'Grevillea robusta',  avgPrice: 79000 },
  { week: 'Mar W1', species: 'Grevillea robusta',  avgPrice: 78000 },
  { week: 'Mar W3', species: 'Grevillea robusta',  avgPrice: 80000 },
  { week: 'Apr W1', species: 'Grevillea robusta',  avgPrice: 80000 },
  { week: 'Apr W3', species: 'Grevillea robusta',  avgPrice: 82000 },
  { week: 'Jan W1', species: 'Eucalyptus grandis', avgPrice: 48000 },
  { week: 'Jan W3', species: 'Eucalyptus grandis', avgPrice: 50000 },
  { week: 'Feb W1', species: 'Eucalyptus grandis', avgPrice: 51000 },
  { week: 'Feb W3', species: 'Eucalyptus grandis', avgPrice: 52000 },
  { week: 'Mar W1', species: 'Eucalyptus grandis', avgPrice: 53000 },
  { week: 'Mar W3', species: 'Eucalyptus grandis', avgPrice: 54000 },
  { week: 'Apr W1', species: 'Eucalyptus grandis', avgPrice: 53000 },
  { week: 'Apr W3', species: 'Eucalyptus grandis', avgPrice: 55000 },
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 't1', title: 'Supply of School Desks and Chairs — 200 Sets',
    organization: 'Rwanda Education Board', deadline: '2026-05-20',
    estimatedValue: 'RWF 48,000,000', species: ['Grevillea robusta', 'Maesopsis eminii'],
    district: 'Kigali City', status: 'open',
    description: 'Supply of 200 sets of pupil desks and chairs for new primary schools in Kigali. RBS Grade A standards required. Verified RWVCA supplier credential required.',
  },
  {
    id: 't2', title: 'Timber Supply for District Hospital Construction',
    organization: 'Rwanda Biomedical Centre', deadline: '2026-05-12',
    estimatedValue: 'RWF 120,000,000', species: ['Pinus patula', 'Eucalyptus grandis'],
    district: 'Musanze', status: 'closing-soon',
    description: 'Structural and finishing timber for the Musanze District Hospital extension. Chain-of-custody documentation and REMA permits required for all lots.',
  },
  {
    id: 't3', title: 'Export Opportunity — Hardwood Flooring, Uganda',
    organization: 'Kampala Interior Solutions Ltd', deadline: '2026-06-01',
    estimatedValue: 'USD 85,000', species: ['Maesopsis eminii', 'Markhamia lutea'],
    district: 'Gasabo', status: 'open',
    description: 'Kampala Interior Solutions seeks 80m³ of premium hardwood flooring blanks per quarter. EAC CoO and EUDR-compatible traceability documentation required.',
  },
  {
    id: 't4', title: 'Eucalyptus Poles — Rural Electrification Programme',
    organization: 'Rwanda Energy Group', deadline: '2026-04-30',
    estimatedValue: 'RWF 35,000,000', species: ['Eucalyptus grandis'],
    district: 'Multiple', status: 'closed',
    description: 'Supply of treated eucalyptus utility poles for the last-mile electrification programme. Minimum 500 poles, 9m length, Class 2 treated.',
  },
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', memberId: 'm3', memberName: 'Nzeyimana Forest Harvesting', courseId: 'c1', startDate: '2026-04-01', completedLessons: ['l1', 'l2', 'l3', 'l4'], completedDate: '2026-04-08', status: 'completed' },
  { id: 'e2', memberId: 'm1', memberName: 'Habimana Sawmill Ltd',        courseId: 'c4', startDate: '2026-04-10', completedLessons: ['l13', 'l14'], status: 'active' },
  { id: 'e3', memberId: 'm5', memberName: 'Bizimana Wood Exports',       courseId: 'c5', startDate: '2026-04-15', completedLessons: ['l17', 'l18', 'l19', 'l20'], completedDate: '2026-04-22', status: 'completed' },
  { id: 'e4', memberId: 'm2', memberName: 'Uwimana Furniture Works',     courseId: 'c3', startDate: '2026-04-20', completedLessons: ['l9', 'l10'], status: 'active' },
  { id: 'e5', memberId: 'm10', memberName: 'Ingabire Highland Timber',   courseId: 'c1', startDate: '2026-04-22', completedLessons: ['l1', 'l2', 'l3', 'l4'], completedDate: '2026-04-29', status: 'completed' },
  { id: 'e6', memberId: 'm9', memberName: 'Habiyaremye Furniture Exports',courseId: 'c5', startDate: '2026-04-25', completedLessons: ['l17', 'l18'], status: 'active' },
  { id: 'e7', memberId: 'm11', memberName: 'Niyibizi Construction Supply', courseId: 'c2', startDate: '2026-04-28', completedLessons: ['l5', 'l6', 'l7', 'l8'], completedDate: '2026-05-02', status: 'completed' },
];
