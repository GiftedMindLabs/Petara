import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const initializedRef = useRef(false);
  
  useEffect(() => {
    let mounted = true;
  
    const init = async () => {
      if (!db || initializedRef.current) return;
  
      try {
        await db.execAsync('SELECT 1');
        if (!mounted) return;
  
        setRepositories({
          taskRepository: new TaskRepository(db),
          petRepository: new PetRepository(db),
          vetVisitRepository: new VetVisitRepository(db),
          vaccinationRepository: new VaccinationRepository(db),
          treatmentRepository: new TreatmentRepository(db),
          expenseRepository: new ExpenseRepository(db),
          contactRepository: new ContactRepository(db),
        });
        setIsReady(true);
        initializedRef.current = true;
        console.log('[DataProvider] Repositories initialized.');
      } catch (e) {
        console.error('[DataProvider] DB initialization failed:', e);
      }
    };
  
    init();
    return () => {
      mounted = false;
    };
  }, [db]);

  const value = useMemo(() => ({
    repositories,
    isReady,
  }), [repositories, isReady]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
