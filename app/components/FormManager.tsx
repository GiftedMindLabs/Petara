import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ContactForm from './forms/ContactForm';
import PetForm from './forms/PetForm';
import TaskForm from './forms/TaskForm';
import TreatmentForm from './forms/TreatmentForm';
import VaccinationForm from './forms/VaccinationForm';
import VetVisitForm from './forms/VetVisitForm';
import FloatingActionButton from './ui/FloatingActionButton';
import FormModal from './ui/FormModal';

type FormType = 'contact' | 'pet' | 'task' | 'treatment' | 'vaccination' | 'vetVisit';

interface FormManagerProps {
  onFormSubmit: (formType: FormType, data: any) => void;
}

const FormManager: React.FC<FormManagerProps> = ({ onFormSubmit }) => {
  const [activeForm, setActiveForm] = useState<FormType | null>(null);

  const handleClose = () => {
    setActiveForm(null);
  };

  const handleSubmit = (data: any) => {
    if (activeForm) {
      onFormSubmit(activeForm, data);
      handleClose();
    }
  };

  const getFormTitle = (formType: FormType): string => {
    switch (formType) {
      case 'contact':
        return 'Add Contact';
      case 'pet':
        return 'Add Pet';
      case 'task':
        return 'Add Task';
      case 'treatment':
        return 'Add Treatment';
      case 'vaccination':
        return 'Add Vaccination';
      case 'vetVisit':
        return 'Add Vet Visit';
      default:
        return '';
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'contact':
        return <ContactForm onSubmit={handleSubmit} onCancel={handleClose} />;
      case 'pet':
        return <PetForm onSubmit={handleSubmit} onCancel={handleClose} />;
      case 'task':
        return <TaskForm onSubmit={handleSubmit} onCancel={handleClose} />;
      case 'treatment':
        return <TreatmentForm onSubmit={handleSubmit} onCancel={handleClose} />;
      case 'vaccination':
        return <VaccinationForm onSubmit={handleSubmit} onCancel={handleClose} />;
      case 'vetVisit':
        return <VetVisitForm onSubmit={handleSubmit} onCancel={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FormModal
        isVisible={activeForm !== null}
        onClose={handleClose}
        title={activeForm ? getFormTitle(activeForm) : ''}
      >
        {renderForm()}
      </FormModal>

      <FloatingActionButton
        items={[
          {
            icon: '👤',
            label: 'Add Contact',
            onPress: () => setActiveForm('contact'),
          },
          {
            icon: '🐾',
            label: 'Add Pet',
            onPress: () => setActiveForm('pet'),
          },
          {
            icon: '✓',
            label: 'Add Task',
            onPress: () => setActiveForm('task'),
          },
          {
            icon: '💊',
            label: 'Add Treatment',
            onPress: () => setActiveForm('treatment'),
          },
          {
            icon: '💉',
            label: 'Add Vaccination',
            onPress: () => setActiveForm('vaccination'),
          },
          {
            icon: '🏥',
            label: 'Add Vet Visit',
            onPress: () => setActiveForm('vetVisit'),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FormManager; 