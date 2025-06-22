import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useRef } from 'react';
import { ContactRepository } from '../database/repositories/contactRepository';
import { ExpenseRepository } from '../database/repositories/expenseRepository';
import { PetRepository } from '../database/repositories/petRepository';
import { TaskRepository } from '../database/repositories/taskRepository';
import { TreatmentRepository } from '../database/repositories/treatmentRepository';
import { VaccinationRepository } from '../database/repositories/vaccinationRepository';
import { VetVisitRepository } from '../database/repositories/vetVisitRepository';

export function useRepositories() {
  const db = useSQLiteContext();
  const repositoriesRef = useRef<{
    taskRepository: TaskRepository;
    petRepository: PetRepository;
    vetVisitRepository: VetVisitRepository;
    vaccinationRepository: VaccinationRepository;
    treatmentRepository: TreatmentRepository;
    expenseRepository: ExpenseRepository;
    contactRepository: ContactRepository;
  } | null>(null);
  
  // Create repositories only once when db is available
  if (!repositoriesRef.current && db) {
    repositoriesRef.current = {
      taskRepository: new TaskRepository(db),
      petRepository: new PetRepository(db),
      vetVisitRepository: new VetVisitRepository(db),
      vaccinationRepository: new VaccinationRepository(db),
      treatmentRepository: new TreatmentRepository(db),
      expenseRepository: new ExpenseRepository(db),
      contactRepository: new ContactRepository(db)
    };
  }

  // Return stable reference to repositories
  const repositories = useMemo(() => {
    // Only return repositories if they exist and db is available
    if (repositoriesRef.current && db) {
      return repositoriesRef.current;
    }
    
    // Return empty object if db is not available yet
    return {
      taskRepository: null as any,
      petRepository: null as any,
      vetVisitRepository: null as any,
      vaccinationRepository: null as any,
      treatmentRepository: null as any,
      expenseRepository: null as any,
      contactRepository: null as any
    };
  }, [db]);

  return repositories;
} 