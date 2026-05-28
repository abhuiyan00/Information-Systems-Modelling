export interface Student {
  id?: number;
  name: string;
  birthDay: string; // "2000-05-21"
}

// ✅ payload used by forms (IMPORTANT FIX)
export type StudentPayload = Omit<Student, 'id'>;
