import React, { createContext, useContext, useState } from 'react';

interface SelectedPetContextType {
  selectedPetId: string;
  setSelectedPetId: (id: string) => void;
}

export const SelectedPetContext = createContext<SelectedPetContextType>({
  selectedPetId: 'all',
  setSelectedPetId: () => {}
});

export const useSelectedPet = () => useContext(SelectedPetContext);

export const SelectedPetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPetId, setSelectedPetId] = useState('all');

  return (
    <SelectedPetContext.Provider value={{ selectedPetId, setSelectedPetId }}>
      {children}
    </SelectedPetContext.Provider>
  );
}; 