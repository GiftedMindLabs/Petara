import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Vaccination, VetVisit } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useVaccinations } from '../../hooks/useVaccinations';
import { useVetVisits } from '../../hooks/useVetVisits';
import { useSelectedPet } from '../../providers/SelectedPetProvider';

interface VaccinationFormProps {
  vaccinationId?: string;
  onSubmit: (data: Omit<Vaccination, 'id'>) => void;
  onCancel: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  vaccinationId,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDuePicker, setShowNextDuePicker] = useState(false);
  const { pets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addVaccination, updateVaccination, getVaccinationById } = useVaccinations();
  const { visits: vetVisits } = useVetVisits();
  const [vaccination, setVaccination] = useState<Vaccination | null>(null);

  const [formData, setFormData] = useState({
    petId: selectedPetId !== 'all' ? selectedPetId : '',
    name: '',
    startDate: new Date().getTime(),
    endDate: undefined as number | undefined,
    lotNumber: '',
    manufacturer: '',
    vetVisitId: ''
  });

  useEffect(() => {
    const loadVaccination = async () => {
      if (vaccinationId) {
        const loadedVaccination = await getVaccinationById(vaccinationId);
        if (loadedVaccination) {
          setVaccination(loadedVaccination);
          setFormData({
            petId: loadedVaccination.petId,
            name: loadedVaccination.name,
            startDate: loadedVaccination.startDate,
            endDate: loadedVaccination.endDate,
            lotNumber: loadedVaccination.lotNumber,
            manufacturer: loadedVaccination.manufacturer,
            vetVisitId: loadedVaccination.vetVisitId || ''
          });
        }
      }
    };
    
    loadVaccination();
  }, [vaccinationId]);

  const handleVetVisitSelect = (vetVisitId: string) => {
    const selectedVisit = vetVisits.find((v: VetVisit) => v.id === vetVisitId);
    if (selectedVisit) {
      setFormData(prev => ({
        ...prev,
        vetVisitId,
      }));
    }
  };

  const handleAddNewVetVisit = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Add",
        action: "create",
        form: "vetVisit",
        petId: formData.petId
      }
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, startDate: selectedDate.getTime() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowNextDuePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, endDate: selectedDate.getTime() });
    }
  };

  const handleSubmit = async () => {
    try {
      if (vaccination?.id) {
        await updateVaccination(vaccination.id, formData);
      } else {
        await addVaccination(formData);
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving vaccination:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formField}>
        <Text style={styles.label}>Pet</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.petId}
            onValueChange={(value: string) => setFormData({ ...formData, petId: value })}
            style={styles.picker}
          >
            <Picker.Item label="Select a pet" value="" />
            {pets.map(pet => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Vaccine Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter vaccine name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.startDate)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.startDate)}
            mode="date"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>End Date (Optional)</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNextDuePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.endDate ? formatDate(formData.endDate) : 'Not set'}
          </Text>
        </TouchableOpacity>
        {showNextDuePicker && (
          <DateTimePicker
            value={formData.endDate ? new Date(formData.endDate) : new Date()}
            mode="date"
            onChange={handleEndDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Vet Visit</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.vetVisitId}
            onValueChange={handleVetVisitSelect}
            style={styles.picker}
          >
            <Picker.Item label="Select a vet visit" value="" />
            {vetVisits.map((visit: VetVisit) => (
              <Picker.Item 
                key={visit.id} 
                label={`${new Date(visit.date).toLocaleDateString()} - ${visit.reason}`} 
                value={visit.id} 
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.addVetButton}
          onPress={handleAddNewVetVisit}
        >
          <Text style={styles.addVetButtonText}>Add New Visit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Lot Number</Text>
        <TextInput
          style={styles.input}
          value={formData.lotNumber}
          onChangeText={(value) => setFormData({ ...formData, lotNumber: value })}
          placeholder="Enter lot number"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Manufacturer</Text>
        <TextInput
          style={styles.input}
          value={formData.manufacturer}
          onChangeText={(value) => setFormData({ ...formData, manufacturer: value })}
          placeholder="Enter manufacturer"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            {vaccination ? 'Update' : 'Add'} Vaccination
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  picker: {
    backgroundColor: 'white',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  submitButton: {
    backgroundColor: '#0D9488',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
  },
  addVetButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addVetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default VaccinationForm;