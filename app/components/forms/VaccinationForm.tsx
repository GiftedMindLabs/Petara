import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Vaccination } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useVaccinations } from '../../hooks/useVaccinations';

interface VaccinationFormProps {
  vaccination?: Vaccination;
  onSubmit: (data: Omit<Vaccination, 'id'>) => void;
  onCancel: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  vaccination,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDuePicker, setShowNextDuePicker] = useState(false);
  const { pets } = usePets();
  const { addVaccination, updateVaccination } = useVaccinations();

  const [formData, setFormData] = useState<Omit<Vaccination, 'id'>>({
    petId: vaccination?.petId || '',
    name: vaccination?.name || '',
    dateGiven: vaccination?.dateGiven || new Date().toISOString(),
    dueDate: vaccination?.dueDate || new Date().toISOString(),
    administeredBy: vaccination?.administeredBy || '',
    lotNumber: vaccination?.lotNumber || '',
    manufacturer: vaccination?.manufacturer || ''
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dateGiven: selectedDate.toISOString() });
    }
  };

  const handleNextDueChange = (event: any, selectedDate?: Date) => {
    setShowNextDuePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dueDate: selectedDate.toISOString() });
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
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
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
        <Text style={styles.label}>Vaccination Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter vaccination name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Date Given</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.dateGiven)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.dateGiven)}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowNextDuePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.dueDate)}
          </Text>
        </TouchableOpacity>
        {showNextDuePicker && (
          <DateTimePicker
            value={new Date(formData.dueDate)}
            mode="date"
            onChange={handleNextDueChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Administered By</Text>
        <TextInput
          style={styles.input}
          value={formData.administeredBy}
          onChangeText={(value) => setFormData({ ...formData, administeredBy: value })}
          placeholder="Enter administrator name"
          placeholderTextColor="#9CA3AF"
        />
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
    overflow: 'hidden',
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
  }
});

export default VaccinationForm;