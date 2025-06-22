import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Treatment, VetVisit } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useTasks } from '../../hooks/useTasks';
import { useTreatments } from '../../hooks/useTreatments';
import { useVetVisits } from '../../hooks/useVetVisits';
import { useSelectedPet } from '../../providers/SelectedPetProvider';

type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

const weekDays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

interface TreatmentFormProps {
  treatmentId?: string;
  onSubmit: (treatment: Treatment) => void;
  onCancel: () => void;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
  treatmentId,
  onSubmit,
  onCancel
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { pets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addTreatment, updateTreatment, getTreatmentById } = useTreatments();
  const { visits: vetVisits } = useVetVisits();
  const { addTask, getTasksByTreatmentId, deleteTask } = useTasks();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<Treatment, 'id'> & {
    recurring: boolean;
    recurrencePattern: RecurrencePattern;
    recurrenceInterval: number;
    recurrenceWeekDays: number[];
    recurrenceMonthDay: number;
    recurrenceEndDate?: number;
    recurrenceCount?: number;
  }>({
    petId: selectedPetId !== 'all' ? selectedPetId : '',
    name: '',
    type: '',
    startDate: new Date().getTime(),
    endDate: undefined,
    frequency: '',
    dosage: '',
    status: 'ongoing',
    vetVisitId: '',
    recurring: true,
    recurrencePattern: 'daily',
    recurrenceInterval: 1,
    recurrenceWeekDays: [],
    recurrenceMonthDay: 1,
  });

  useEffect(() => {
    const loadTreatment = async () => {
      if (treatmentId) {
        const loadedTreatment = await getTreatmentById(treatmentId);
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
            status: loadedTreatment.status,
            vetVisitId: loadedTreatment.vetVisitId || '',
            recurring: true,
            recurrencePattern: 'daily',
            recurrenceInterval: 1,
            recurrenceWeekDays: [],
            recurrenceMonthDay: 1,
          });
        }
      }
    };
    
    loadTreatment();
  }, [treatmentId]);

  const handleVetVisitSelect = (vetVisitId: string) => {
    const selectedVisit = vetVisits.find((v: VetVisit) => v.id === vetVisitId);
    if (selectedVisit) {
      setFormData(prev => ({
        ...prev,
        vetVisitId
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
    setShowStartDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(formData.startDate ? new Date(formData.startDate).getHours() : 0);
      newDate.setMinutes(formData.startDate ? new Date(formData.startDate).getMinutes() : 0);
      setFormData({ ...formData, startDate: newDate.getTime() });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.startDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, startDate: newDate.getTime() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, recurrenceEndDate: selectedDate.getTime() });
    }
  };

  const toggleWeekDay = (day: number) => {
    const weekDays = [...formData.recurrenceWeekDays];
    const index = weekDays.indexOf(day);
    if (index === -1) {
      weekDays.push(day);
    } else {
      weekDays.splice(index, 1);
    }
    weekDays.sort();
    setFormData({ ...formData, recurrenceWeekDays: weekDays });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSubmit = async () => {
    try {
      if (!formData.petId) {
        Alert.alert("Error", "Please select a pet");
        return;
      }
      if (!formData.name) {
        Alert.alert("Error", "Please enter a treatment name");
        return;
      }

      let savedTreatment: Treatment;
      if (treatment?.id) {
        savedTreatment = await updateTreatment(treatment.id, formData);
      } else {
        savedTreatment = await addTreatment(formData);
      }

      // Create or update the associated task
      const taskData = {
        petId: formData.petId,
        title: `${formData.name} - ${formData.dosage}`,
        type: 'medication' as const,
        dueDate: formData.startDate,
        isComplete: false,
        notes: `Treatment: ${formData.dosage}`,
        recurring: formData.recurring,
        recurrencePattern: formData.recurrencePattern,
        recurrenceInterval: formData.recurrenceInterval,
        recurrenceWeekDays: formData.recurrenceWeekDays,
        recurrenceMonthDay: formData.recurrenceMonthDay,
        recurrenceEndDate: formData.recurrenceEndDate,
        recurrenceCount: formData.recurrenceCount,
        linkedTreatmentId: savedTreatment.id,
      };

      if (treatment?.id) {
        // Delete existing task and create new one
        const existingTasks = await getTasksByTreatmentId(treatment.id);
        for (const task of existingTasks) {
          await deleteTask(task.id);
        }
      }
      await addTask(taskData);

      onSubmit(savedTreatment);
    } catch (error) {
      console.error('Error saving treatment:', error);
      Alert.alert("Error", "Failed to save treatment. Please try again.");
    }
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
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formatTime(formData.startDate)}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date(formData.startDate)}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Recurrence Pattern</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.recurrencePattern}
            onValueChange={(value: RecurrencePattern) =>
              setFormData({ ...formData, recurrencePattern: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="Yearly" value="yearly" />
          </Picker>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Repeat every</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            value={formData.recurrenceInterval.toString()}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                recurrenceInterval: parseInt(value) || 1,
              })
            }
            keyboardType="number-pad"
          />
          <Text style={styles.intervalText}>
            {formData.recurrencePattern}
            {formData.recurrenceInterval > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {formData.recurrencePattern === "weekly" && (
        <View style={styles.formField}>
          <Text style={styles.label}>Repeat on</Text>
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.weekDayButton,
                  formData.recurrenceWeekDays.includes(day.value) &&
                    styles.weekDayButtonSelected,
                ]}
                onPress={() => toggleWeekDay(day.value)}
              >
                <Text
                  style={[
                    styles.weekDayText,
                    formData.recurrenceWeekDays.includes(day.value) &&
                      styles.weekDayTextSelected,
                  ]}
                >
                  {day.label.substring(0, 1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {formData.recurrencePattern === "monthly" && (
        <View style={styles.formField}>
          <Text style={styles.label}>Day of month</Text>
          <TextInput
            style={styles.input}
            value={formData.recurrenceMonthDay.toString()}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                recurrenceMonthDay: Math.min(
                  Math.max(parseInt(value) || 1, 1),
                  31
                ),
              })
            }
            keyboardType="number-pad"
          />
        </View>
      )}

      <View style={styles.formField}>
        <Text style={styles.label}>End</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.recurrenceCount ? "count" : formData.recurrenceEndDate ? "date" : "never"}
            onValueChange={(value) => {
              if (value === "count") {
                setFormData({
                  ...formData,
                  recurrenceCount: 10,
                  recurrenceEndDate: undefined,
                });
              } else if (value === "date") {
                setFormData({
                  ...formData,
                  recurrenceCount: undefined,
                  recurrenceEndDate: new Date().getTime(),
                });
              } else {
                setFormData({
                  ...formData,
                  recurrenceCount: undefined,
                  recurrenceEndDate: undefined,
                });
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Never" value="never" />
            <Picker.Item label="After number of occurrences" value="count" />
            <Picker.Item label="On date" value="date" />
          </Picker>
        </View>

        {formData.recurrenceCount !== undefined && (
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            value={formData.recurrenceCount.toString()}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                recurrenceCount: parseInt(value) || 1,
              })
            }
            keyboardType="number-pad"
          />
        )}

        {formData.recurrenceEndDate !== undefined && (
          <>
            <TouchableOpacity
              style={[styles.input, { marginTop: 8 }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {formatDate(formData.recurrenceEndDate)}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={new Date(formData.recurrenceEndDate)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleEndDateChange}
                minimumDate={new Date(formData.startDate)}
              />
            )}
          </>
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
            {treatment ? 'Update' : 'Add'} Treatment
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
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
  },
  picker: {
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  intervalText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  weekDayButton: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
  },
  weekDayButtonSelected: {
    backgroundColor: '#0D9488',
  },
  weekDayText: {
    color: '#1F2937',
    fontSize: 14,
  },
  weekDayTextSelected: {
    color: '#FFFFFF',
  },
  dateTimeText: {
    color: '#1F2937',
    fontSize: 14,
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
  },
});

export default TreatmentForm;