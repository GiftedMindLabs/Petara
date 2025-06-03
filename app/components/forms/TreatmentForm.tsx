import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { pets } from '../../utils/mockData';

type TreatmentStatus = 'ongoing' | 'scheduled' | 'completed';

interface TreatmentFormProps {
  treatment?: {
    id: string;
    petId: string;
    name: string;
    type: string;
    startDate: string;
    endDate?: string;
    frequency: string;
    dosage: string;
    status: TreatmentStatus;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
  treatment,
  onSubmit,
  onCancel
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    petId: treatment?.petId || '',
    name: treatment?.name || '',
    type: treatment?.type || '',
    startDate: treatment?.startDate ? new Date(treatment.startDate) : new Date(),
    endDate: treatment?.endDate ? new Date(treatment.endDate) : undefined,
    frequency: treatment?.frequency || '',
    dosage: treatment?.dosage || '',
    status: treatment?.status || 'scheduled'
  });

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, startDate: selectedDate });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, endDate: selectedDate });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate?.toISOString(),
    });
  };

  const formatDate = (date?: Date) => {
    return date ? date.toLocaleDateString() : '';
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
        <Text style={styles.label}>Treatment Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter treatment name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Type</Text>
        <TextInput
          style={styles.input}
          value={formData.type}
          onChangeText={(value) => setFormData({ ...formData, type: value })}
          placeholder="Enter treatment type"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.startDate)}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.endDate)}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
            />
          )}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Frequency</Text>
        <TextInput
          style={styles.input}
          value={formData.frequency}
          onChangeText={(value) => setFormData({ ...formData, frequency: value })}
          placeholder="e.g., Twice daily, Every 8 hours"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={formData.dosage}
          onChangeText={(value) => setFormData({ ...formData, dosage: value })}
          placeholder="e.g., 1 tablet, 5ml"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value: TreatmentStatus) => setFormData({ ...formData, status: value })}
            style={styles.picker}
          >
            <Picker.Item label="Scheduled" value="scheduled" />
            <Picker.Item label="Ongoing" value="ongoing" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
        </View>
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
            {treatment ? 'Save Changes' : 'Add Treatment'}
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

export default TreatmentForm;