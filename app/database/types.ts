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
  dueDate: number;
  isComplete: boolean;
  notes?: string;
  recurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval?: number;
  recurrenceWeekDays?: number[];
  recurrenceMonthDay?: number;
  recurrenceEndDate?: number;
  recurrenceCount?: number;
  lastCompletedDate?: number;
  nextDueDate?: number;
  linkedTreatmentId?: string;
  linkedVaccinationId?: string;
  linkedVetVisitId?: string;
  notificationIdentifier?: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  date: number;
  reason: string;
  notes: string;
  weight?: number;
  notificationIdentifier?: string;
  contactId?: string;
}

export interface Treatment {
  id: string;
  petId: string;
  name: string;
  type: string;
  startDate: number;
  endDate?: number;
  frequency: string;
  dosage: string;
  status: 'ongoing' | 'scheduled' | 'completed';
  vetVisitId?: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  startDate: number;
  endDate?: number;
  lotNumber: string;
  manufacturer: string;
  vetVisitId?: string;
}

export interface Expense {
  id: string;
  petId: string;
  date: number;
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