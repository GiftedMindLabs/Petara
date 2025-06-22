import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { VetVisit } from '../../database/types';
import { useContacts } from '../../hooks/useContacts';
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
  contactId?: string;
}

const VetVisitForm: React.FC<VetVisitFormProps> = ({
  visitId,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { pets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addVetVisit, updateVetVisit, getVetVisitById } = useVetVisits();
  const { contacts } = useContacts();
  const [visit, setVisit] = useState<VetVisit | null>(null);

  const [formData, setFormData] = useState({
    petId: selectedPetId !== 'all' ? selectedPetId : "",
    date: new Date(),
    reason: "",
    notes: "",
    weight: "",
    contactId: ""
  });

  useEffect(() => {
    const loadVisit = async () => {
      if (visitId) {
        const loadedVisit = await getVetVisitById(visitId);
        if (loadedVisit) {
          setVisit(loadedVisit);
          setFormData({
            petId: loadedVisit.petId,
            date: new Date(loadedVisit.date),
            reason: loadedVisit.reason,
            notes: loadedVisit.notes,
            weight: loadedVisit.weight?.toString() || "",
            contactId: loadedVisit.contactId || ""
          });
        }
      }
    };
    
    loadVisit();
  }, [visitId]);

  const handleContactSelect = (contactId: string) => {
    const selectedContact = contacts.find(c => c.id === contactId);
    if (selectedContact) {
      setFormData(prev => ({
        ...prev,
        contactId,
        vetName: selectedContact.name
      }));
    }
  };

  const handleAddNewVet = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Add",
        action: "create",
        form: "contact",
        type: "veterinarian"
      }
    });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Preserve the existing time when changing date
      newDate.setHours(formData.date.getHours());
      newDate.setMinutes(formData.date.getMinutes());
      setFormData({ ...formData, date: newDate });
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(formData.date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, date: newDate });
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

    if (formData.weight && !/^\d*\.?\d*$/.test(formData.weight)) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Please select a veterinarian';
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
      date: formData.date.getTime(),
      reason: formData.reason.trim(),
      notes: formData.notes.trim(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      contactId: formData.contactId || undefined
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
      Alert.alert('Error', 'Failed to save vet visit. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.date)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatTime(formData.date)}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={formData.date}
            mode="time"
            onChange={handleTimeChange}
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
        <View style={[styles.pickerContainer, errors.contactId && styles.inputError]}>
          <Picker
            selectedValue={formData.contactId}
            onValueChange={(value: string) => {
              handleContactSelect(value);
              setErrors(prev => ({ ...prev, contactId: undefined }));
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a veterinarian" value="" />
            {contacts.map((contact) => (
              <Picker.Item key={contact.id} label={contact.name} value={contact.id} />
            ))}
          </Picker>
        </View>
        {errors.contactId && <Text style={styles.errorText}>{errors.contactId}</Text>}
        <TouchableOpacity
          style={styles.addVetButton}
          onPress={handleAddNewVet}
        >
          <Text style={styles.addVetButtonText}>Add New</Text>
        </TouchableOpacity>
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
  },
  picker: {
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  vetSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addVetButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  addVetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VetVisitForm;