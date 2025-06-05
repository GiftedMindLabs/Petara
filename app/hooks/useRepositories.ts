import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo } from 'react';
import { ContactRepository } from '../database/repositories/contactRepository';
import { ExpenseRepository } from '../database/repositories/expenseRepository';
import { PetRepository } from '../database/repositories/petRepository';
import { TaskRepository } from '../database/repositories/taskRepository';
import { TreatmentRepository } from '../database/repositories/treatmentRepository';
import { VaccinationRepository } from '../database/repositories/vaccinationRepository';
import { VetVisitRepository } from '../database/repositories/vetVisitRepository';

export function useRepositories() {
  const db = useSQLiteContext();
  
  const repositories = useMemo(() => ({
    taskRepository: new TaskRepository(db),
    petRepository: new PetRepository(db),
    vetVisitRepository: new VetVisitRepository(db),
    vaccinationRepository: new VaccinationRepository(db),
    treatmentRepository: new TreatmentRepository(db),
    expenseRepository: new ExpenseRepository(db),
    contactRepository: new ContactRepository(db)
  }), [db]);

  useEffect(() => {
    // Cleanup function to dispose of repositories when the hook unmounts
    return () => {
      Object.values(repositories).forEach(repo => {
        if ('dispose' in repo) {
          (repo as { dispose: () => void }).dispose();
        }
      });
    };
  }, [repositories]);

  return repositories;
} 