import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef } from 'react';
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
  
  // Only create repositories once when db is available
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
    return repositoriesRef.current || {
      taskRepository: new TaskRepository(db),
      petRepository: new PetRepository(db),
      vetVisitRepository: new VetVisitRepository(db),
      vaccinationRepository: new VaccinationRepository(db),
      treatmentRepository: new TreatmentRepository(db),
      expenseRepository: new ExpenseRepository(db),
      contactRepository: new ContactRepository(db)
    };
  }, [db]);

  useEffect(() => {
    // Cleanup function to dispose of repositories when the hook unmounts
    return () => {
      if (repositoriesRef.current) {
        Object.values(repositoriesRef.current).forEach(repo => {
          if ('dispose' in repo) {
            (repo as { dispose: () => void }).dispose();
          }
        });
        repositoriesRef.current = null;
      }
    };
  }, []); // Empty dependency array to prevent infinite loops

  return repositories;
} 