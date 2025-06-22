import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ContactRepository } from '../database/repositories/contactRepository';
import { ExpenseRepository } from '../database/repositories/expenseRepository';
import { PetRepository } from '../database/repositories/petRepository';
import { TaskRepository } from '../database/repositories/taskRepository';
import { TreatmentRepository } from '../database/repositories/treatmentRepository';
import { VaccinationRepository } from '../database/repositories/vaccinationRepository';
import { VetVisitRepository } from '../database/repositories/vetVisitRepository';

interface DataContextType {
  repositories: {
    taskRepository: TaskRepository | null;
    petRepository: PetRepository | null;
    vetVisitRepository: VetVisitRepository | null;
    vaccinationRepository: VaccinationRepository | null;
    treatmentRepository: TreatmentRepository | null;
    expenseRepository: ExpenseRepository | null;
    contactRepository: ContactRepository | null;
  };
  isReady: boolean;
}

const DataContext = createContext<DataContextType>({
  repositories: {
    taskRepository: null,
    petRepository: null,
    vetVisitRepository: null,
    vaccinationRepository: null,
    treatmentRepository: null,
    expenseRepository: null,
    contactRepository: null,
  },
  isReady: false,
});

export const useData = () => useContext(DataContext);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const db = useSQLiteContext();
  const [repositories, setRepositories] = useState<DataContextType['repositories']>({
    taskRepository: null,
    petRepository: null,
    vetVisitRepository: null,
    vaccinationRepository: null,
    treatmentRepository: null,
    expenseRepository: null,
    contactRepository: null,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (db) {
      console.log('Database available, initializing repositories...');
      
      // Test database connection
      const initializeRepositories = async () => {
        try {
          // Test a simple query to ensure database is ready
          await db.execAsync('SELECT 1');
          console.log('Database connection test successful');
          
          // Create repositories
          const newRepositories = {
            taskRepository: new TaskRepository(db),
            petRepository: new PetRepository(db),
            vetVisitRepository: new VetVisitRepository(db),
            vaccinationRepository: new VaccinationRepository(db),
            treatmentRepository: new TreatmentRepository(db),
            expenseRepository: new ExpenseRepository(db),
            contactRepository: new ContactRepository(db),
          };
          
          setRepositories(newRepositories);
          setIsReady(true);
          console.log('Repositories initialized successfully');
        } catch (error) {
          console.error('Failed to initialize repositories:', error);
          setIsReady(false);
        }
      };

      initializeRepositories();
    } else {
      console.log('Database not available yet');
      setIsReady(false);
    }
  }, [db]);

  const value: DataContextType = {
    repositories,
    isReady,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 