import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { pets } from '../../utils/mockData';

interface VetVisitFormProps {
  visit?: {
    id: string;
    petId: string;
    date: string;
    reason: string;
    notes: string;
    vetName: string;
    weight?: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const VetVisitForm: React.FC<VetVisitFormProps> = ({
  visit,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    petId: visit?.petId || '',
    date: visit?.date ? new Date(visit.date) : new Date(),
    reason: visit?.reason || '',
    notes: visit?.notes || '',
    vetName: visit?.vetName || '',
    weight: visit?.weight?.toString() || ''
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      date: formData.date.toISOString(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
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
        <Text style={styles.label}>Date</Text>
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
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Reason for Visit</Text>
        <TextInput
          style={styles.input}
          value={formData.reason}
          onChangeText={(value) => setFormData({ ...formData, reason: value })}
          placeholder="Enter reason for visit"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Veterinarian</Text>
        <TextInput
          style={styles.input}
          value={formData.vetName}
          onChangeText={(value) => setFormData({ ...formData, vetName: value })}
          placeholder="Enter veterinarian name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(value) => {
            // Only allow numbers and decimal point
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              setFormData({ ...formData, weight: value });
            }
          }}
          placeholder="Enter weight"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
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
            {visit ? 'Save Changes' : 'Add Visit'}
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

export default VetVisitForm;