export interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  sex: 'male' | 'female';
  birthDate: number;
  allergies: string[];
  weight: number;
  microchipCode: number;
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
  recurring?: boolean;
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
// Mock data
export const pets: Pet[] = [{
  id: '1',
  name: 'Buddy',
  species: 'dog',
  breed: 'Golden Retriever',
  sex: 'male',
  birthDate: new Date('2020-01-01').getTime(),
  allergies: ['flea', 'tick'],
  weight: 65,
  microchipCode: 1234567890,
  sterilized: true,
  deceased: false,
  imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
}, {
  id: '2',
  name: 'Whiskers',
  species: 'cat',
  breed: 'Siamese',
  sex: 'female',
  imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  weight: 11,
  microchipCode: 1234567890,
  sterilized: true,
  deceased: false,
  birthDate: new Date('2020-01-01').getTime(),
  allergies: ['flea', 'tick'],
}, {
  id: '3',
  name: 'Max',
  species: 'dog',
  breed: 'Beagle',
  sex: 'male',
  imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  weight: 24,
  microchipCode: 1234567890,
  sterilized: true,
  deceased: false,
  birthDate: new Date('2020-01-01').getTime(),
  allergies: ['flea', 'tick'],
}];
export const tasks: Task[] = [{
  id: '1',
  petId: '1',
  title: 'Morning Walk',
  type: 'walk',
  dueDate: '2023-12-15T08:00:00',
  isComplete: false,
  recurring: true
}, {
  id: '2',
  petId: '1',
  title: 'Heartworm Medication',
  type: 'medication',
  dueDate: '2023-12-15T18:00:00',
  isComplete: false,
  notes: 'Give with food'
}, {
  id: '3',
  petId: '2',
  title: 'Evening Feeding',
  type: 'feeding',
  dueDate: '2023-12-15T17:00:00',
  isComplete: false,
  recurring: true
}, {
  id: '4',
  petId: '3',
  title: 'Grooming Appointment',
  type: 'grooming',
  dueDate: '2023-12-17T14:30:00',
  isComplete: false
}];
export const vetVisits: VetVisit[] = [{
  id: '1',
  petId: '1',
  date: '2023-09-15',
  reason: 'Annual Checkup',
  notes: 'All vaccines updated. Healthy weight.',
  vetName: 'Dr. Johnson',
  weight: 65
}, {
  id: '2',
  petId: '2',
  date: '2023-10-02',
  reason: 'Dental Cleaning',
  notes: 'Minor tartar buildup. Schedule follow-up in 6 months.',
  vetName: 'Dr. Martinez',
  weight: 11
}];
export const treatments: Treatment[] = [{
  id: '1',
  petId: '1',
  name: 'Heartworm Prevention',
  type: 'medication',
  startDate: '2023-06-01',
  frequency: 'Monthly',
  dosage: '1 tablet',
  status: 'ongoing'
}, {
  id: '2',
  petId: '2',
  name: 'Antibiotic',
  type: 'medication',
  startDate: '2023-11-15',
  endDate: '2023-11-25',
  frequency: 'Twice daily',
  dosage: '5ml',
  status: 'completed'
}];
export const vaccinations: Vaccination[] = [
  {
    id: '1',
    petId: '1',
    name: 'Rabies',
    dateGiven: '2023-06-15',
    dueDate: '2024-06-15',
    administeredBy: 'Dr. Johnson',
    lotNumber: 'RAB123',
    manufacturer: 'VetVax'
  },
  {
    id: '2',
    petId: '1',
    name: 'DHPP',
    dateGiven: '2023-06-15',
    dueDate: '2024-06-15',
    administeredBy: 'Dr. Johnson',
    lotNumber: 'DHPP456',
    manufacturer: 'PetPharm'
  },
  {
    id: '3',
    petId: '2',
    name: 'FVRCP',
    dateGiven: '2023-07-20',
    dueDate: '2024-07-20',
    administeredBy: 'Dr. Martinez',
    lotNumber: 'FVRCP789',
    manufacturer: 'FelixPharm'
  }
];
// Helper function to get today's tasks
export const getTodaysTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(task => task.dueDate.startsWith(today));
};
// Helper function to get upcoming vet visits
export const getUpcomingVetVisits = () => {
  const today = new Date();
  return vetVisits.filter(visit => new Date(visit.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
// Helper function to get tasks for a specific pet
export const getTasksForPet = (petId: string) => {
  return tasks.filter(task => task.petId === petId);
};
// Helper function to get vet visits for a specific pet
export const getVetVisitsForPet = (petId: string) => {
  return vetVisits.filter(visit => visit.petId === petId);
};
// Helper function to get treatments for a specific pet
export const getTreatmentsForPet = (petId: string) => {
  return treatments.filter(treatment => treatment.petId === petId);
};
// Helper functions for task filtering
export const getTomorrowsTasks = () => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  return tasks.filter(task => task.dueDate.startsWith(tomorrow));
};
export const getLaterTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  return tasks.filter(task => 
    !task.dueDate.startsWith(today) && 
    !task.dueDate.startsWith(tomorrow)
  );
};