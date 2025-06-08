export interface SQLTransaction {
  executeSql(
    sqlStatement: string,
    args?: any[],
    success?: (transaction: SQLTransaction, resultSet: ResultSet) => void,
    error?: (transaction: SQLTransaction, error: Error) => void
  ): void;
}

export interface ResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
}

export interface Pet {
  id: string;
  name: string;
  imageUrl: string | null;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  sex: 'male' | 'female';
  birthDate: number;
  allergies: string[];
  weight: number;
  microchipCode: number | null;
  sterilized: boolean;
  deceased: boolean;
}

export interface Task {
  id: string;
  petId: string;
  title: string;
  type: 'feeding' | 'medication' | 'walk' | 'grooming' | 'other';
  dueDate: string;
  isComplete: boolean;
  notes?: string;
  recurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval?: number;
  recurrenceWeekDays?: number[];
  recurrenceMonthDay?: number;
  recurrenceEndDate?: string;
  recurrenceCount?: number;
  lastCompletedDate?: string;
  nextDueDate?: string;
  linkedTreatmentId?: string;
  linkedVaccinationId?: string;
  linkedVetVisitId?: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  date: string;
  reason: string;
  notes: string;
  vetName: string;
  weight?: number;
}

export interface Treatment {
  id: string;
  petId: string;
  name: string;
  type: string;
  startDate: string;
  endDate?: string;
  frequency: string;
  dosage: string;
  status: 'ongoing' | 'scheduled' | 'completed';
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  dueDate: string;
  administeredBy: string;
  lotNumber: string;
  manufacturer: string;
}

export interface Expense {
  id: string;
  petId: string;
  date: string;
  amount: number;
  category: 'veterinary' | 'food' | 'supplies' | 'grooming' | 'medications' | 'other';
  description: string;
  vendor: string;
  reimbursed: number;
  linkedVetVisitId?: string;
  linkedVaccinationId?: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'veterinarian' | 'groomer' | 'sitter' | 'trainer' | 'other';
  phone: string;
  email: string;
  address: string;
  notes: string;
}