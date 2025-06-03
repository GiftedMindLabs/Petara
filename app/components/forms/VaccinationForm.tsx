import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { pets } from '../../utils/mockData';

interface VaccinationFormProps {
  vaccination?: {
    id: string;
    petId: string;
    name: string;
    date: string;
    nextDue: string;
    provider: string;
    notes: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  vaccination,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDuePicker, setShowNextDuePicker] = useState(false);

  const [formData, setFormData] = useState({
    petId: vaccination?.petId || '',
    name: vaccination?.name || '',
    date: vaccination?.date ? new Date(vaccination.date) : new Date(),
    nextDue: vaccination?.nextDue ? new Date(vaccination.nextDue) : new Date(),
    provider: vaccination?.provider || '',
    notes: vaccination?.notes || ''
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleNextDueChange = (event: any, selectedDate?: Date) => {
    setShowNextDuePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, nextDue: selectedDate });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      date: formData.date.toISOString(),
      nextDue: formData.nextDue.toISOString(),
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
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

      <View style={styles.row}>
        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Date Given</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Next Due</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowNextDuePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.nextDue)}</Text>
          </TouchableOpacity>
          {showNextDuePicker && (
            <DateTimePicker
              value={formData.nextDue}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleNextDueChange}
              minimumDate={formData.date}
            />
          )}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Provider</Text>
        <TextInput
          style={styles.input}
          value={formData.provider}
          onChangeText={(value) => setFormData({ ...formData, provider: value })}
          placeholder="Enter provider name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Enter notes"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {vaccination ? 'Save Changes' : 'Add Vaccination'}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  dateText: {
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  submitButton: {
    backgroundColor: '#0D9488',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VaccinationForm;