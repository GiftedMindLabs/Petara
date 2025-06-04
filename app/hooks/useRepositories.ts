import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { PetRepository } from '../database/repositories/petRepository';
import { TaskRepository } from '../database/repositories/taskRepository';
import { TreatmentRepository } from '../database/repositories/treatmentRepository';
import { VaccinationRepository } from '../database/repositories/vaccinationRepository';
import { VetVisitRepository } from '../database/repositories/vetVisitRepository';

export function useRepositories() {
  const db = useSQLiteContext();
  
  return useMemo(() => ({
    taskRepository: new TaskRepository(db),
    petRepository: new PetRepository(db),
    vetVisitRepository: new VetVisitRepository(db),
    vaccinationRepository: new VaccinationRepository(db),
    treatmentRepository: new TreatmentRepository(db),
  }), [db]);
} 