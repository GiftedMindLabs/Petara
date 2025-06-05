import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Treatment } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useTreatments } from '../../hooks/useTreatments';
import { useSelectedPet } from '../../providers/SelectedPetProvider';

interface TreatmentFormProps {
  treatmentId?: string;
  onSubmit: (data: Omit<Treatment, 'id'>) => void;
  onCancel: () => void;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
  treatmentId,
  onSubmit,
  onCancel
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { pets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addTreatment, updateTreatment, getTreatmentById } = useTreatments();
  const [treatment, setTreatment] = useState<Treatment | null>(null);

  const [formData, setFormData] = useState<Omit<Treatment, 'id'>>({
    petId: selectedPetId !== 'all' ? selectedPetId : '',
    name: '',
    type: '',
    startDate: new Date().toISOString(),
    frequency: '',
    dosage: '',
    status: 'scheduled'
  });

  useEffect(() => {
    if (treatmentId) {
      getTreatmentById(treatmentId).then(loadedTreatment => {
        if (loadedTreatment) {
          setTreatment(loadedTreatment);
          setFormData({
            petId: loadedTreatment.petId,
            name: loadedTreatment.name,
            type: loadedTreatment.type,
            startDate: loadedTreatment.startDate,
            endDate: loadedTreatment.endDate,
            frequency: loadedTreatment.frequency,
            dosage: loadedTreatment.dosage,
            status: loadedTreatment.status
          });
        }
      });
    }
  }, [treatmentId, getTreatmentById]);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, startDate: selectedDate.toISOString() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, endDate: selectedDate.toISOString() });
    }
  };

  const handleSubmit = async () => {
    try {
      if (treatmentId) {
        await updateTreatment(treatmentId, formData);
      } else {
        await addTreatment(formData);
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving treatment:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : '';
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

      <View style={styles.formField}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.startDate)}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
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
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.endDate)}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={formData.endDate ? new Date(formData.endDate) : new Date()}
            mode="date"
            onChange={handleEndDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Frequency</Text>
        <TextInput
          style={styles.input}
          value={formData.frequency}
          onChangeText={(value) => setFormData({ ...formData, frequency: value })}
          placeholder="Enter frequency (e.g., 'Twice daily')"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={formData.dosage}
          onChangeText={(value) => setFormData({ ...formData, dosage: value })}
          placeholder="Enter dosage"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value: 'ongoing' | 'scheduled' | 'completed') => 
              setFormData({ ...formData, status: value })}
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
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            {treatmentId ? 'Update' : 'Add'} Treatment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    color: '#1F2937',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: '#0D9488',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  submitButtonText: {
    color: '#FFFFFF',
  },
});

export default TreatmentForm;