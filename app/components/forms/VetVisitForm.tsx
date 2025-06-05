import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { VetVisit } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useVetVisits } from '../../hooks/useVetVisits';
import { useSelectedPet } from '../../providers/SelectedPetProvider';

interface VetVisitFormProps {
  visitId?: string;
  onSubmit: (data: Omit<VetVisit, 'id'>) => void;
  onCancel: () => void;
}

interface FormErrors {
  petId?: string;
  reason?: string;
  vetName?: string;
  weight?: string;
}

const VetVisitForm: React.FC<VetVisitFormProps> = ({
  visitId,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { pets, loadPets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addVetVisit, updateVetVisit, getVetVisitById } = useVetVisits();
  const [visit, setVisit] = useState<VetVisit | null>(null);

  const [formData, setFormData] = useState({
    petId: selectedPetId !== 'all' ? selectedPetId : "",
    date: new Date(),
    reason: "",
    notes: "",
    vetName: "",
    weight: ""
  });

  useEffect(() => {
    if (visitId) {
      getVetVisitById(visitId).then(loadedVisit => {
        if (loadedVisit) setVisit(loadedVisit);
      });
    }
  }, [visitId, getVetVisitById]);

  useEffect(() => {
    if (visit) {
      setFormData({
        petId: visit.petId,
        date: new Date(visit.date),
        reason: visit.reason,
        notes: visit.notes,
        vetName: visit.vetName,
        weight: visit.weight?.toString() || ""
      });
    }
  }, [visit]);

  // Use useFocusEffect to reload pets when the form comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.petId) {
      newErrors.petId = 'Please select a pet';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please enter a reason for the visit';
    }

    if (!formData.vetName.trim()) {
      newErrors.vetName = 'Please enter the veterinarian\'s name';
    }

    if (formData.weight && !/^\d*\.?\d*$/.test(formData.weight)) {
      newErrors.weight = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const visitData = {
      petId: formData.petId,
      date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      reason: formData.reason.trim(),
      notes: formData.notes.trim(),
      vetName: formData.vetName.trim(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };

    try {
      if (visit?.id) {
        await updateVetVisit(visit.id, visitData);
      } else {
        await addVetVisit(visitData);
      }
      onSubmit(visitData);
    } catch (error) {
      console.error('Error saving vet visit:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formField}>
        <Text style={styles.label}>Pet</Text>
        <View style={[styles.pickerContainer, errors.petId && styles.inputError]}>
          <Picker
            selectedValue={formData.petId}
            onValueChange={(value: string) => {
              setFormData({ ...formData, petId: value });
              setErrors(prev => ({ ...prev, petId: undefined }));
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a pet" value="" />
            {pets.map(pet => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>
        {errors.petId && <Text style={styles.errorText}>{errors.petId}</Text>}
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
          style={[styles.input, errors.reason && styles.inputError]}
          value={formData.reason}
          onChangeText={(value) => {
            setFormData({ ...formData, reason: value });
            setErrors(prev => ({ ...prev, reason: undefined }));
          }}
          placeholder="Enter reason for visit"
          placeholderTextColor="#9CA3AF"
        />
        {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Veterinarian</Text>
        <TextInput
          style={[styles.input, errors.vetName && styles.inputError]}
          value={formData.vetName}
          onChangeText={(value) => {
            setFormData({ ...formData, vetName: value });
            setErrors(prev => ({ ...prev, vetName: undefined }));
          }}
          placeholder="Enter veterinarian name"
          placeholderTextColor="#9CA3AF"
        />
        {errors.vetName && <Text style={styles.errorText}>{errors.vetName}</Text>}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={[styles.input, errors.weight && styles.inputError]}
          value={formData.weight}
          onChangeText={(value) => {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              setFormData({ ...formData, weight: value });
              setErrors(prev => ({ ...prev, weight: undefined }));
            }
          }}
          placeholder="Enter weight"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
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
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
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
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#0D9488',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default VetVisitForm;