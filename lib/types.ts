export type MemberType = 'harvester' | 'sawmill' | 'furniture' | 'trader' | 'exporter';
export type MemberStatus = 'active' | 'pending' | 'inactive';

export interface Member {
  id: string;
  name: string;
  businessName: string;
  district: string;
  phone: string;
  email: string;
  species: string[];
  productionVolume: number;
  equipment: string[];
  certifications: string[];
  joinedDate: string;
  status: MemberStatus;
  memberType: MemberType;
  province: string;
}

export type LotStatus = 'harvested' | 'in-transit' | 'at-mill' | 'processed' | 'sold';

export interface CustodyRecord {
  id: string;
  timestamp: string;
  handler: string;
  location: string;
  action: string;
  notes: string;
}

export interface TimberLot {
  id: string;
  species: string;
  volume: number;
  gradeClass: string;
  harvestLocation: string;
  harvestDate: string;
  memberId: string;
  memberName: string;
  custody: CustodyRecord[];
  status: LotStatus;
  certified: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
}

export type CourseCategory = 'Safety' | 'Sustainability' | 'Business' | 'Quality' | 'Compliance';
export type CourseDelivery = 'WhatsApp' | 'USSD' | 'Web';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  languages: string[];
  delivery: CourseDelivery[];
  durationMin: number;
  lessons: Lesson[];
  enrolled: number;
}

export interface Enrollment {
  id: string;
  memberId: string;
  memberName: string;
  courseId: string;
  startDate: string;
  completedLessons: string[];
  completedDate?: string;
  status: 'active' | 'completed';
}

export interface MarketPrice {
  id: string;
  species: string;
  district: string;
  grade: string;
  pricePerM3: number;
  weekOf: string;
}

export interface Tender {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  estimatedValue: string;
  species: string[];
  district: string;
  description: string;
  status: 'open' | 'closing-soon' | 'closed';
}
