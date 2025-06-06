import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Task, Treatment } from '../../database/types';
import { usePets } from '../../hooks/usePets';
import { useTasks } from '../../hooks/useTasks';
import { useTreatments } from '../../hooks/useTreatments';
import { useSelectedPet } from '../../providers/SelectedPetProvider';
import { generateTasksFromTreatment } from '../../utils/taskGenerator';

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
  onSubmit: (data: Omit<Treatment, 'id'>) => void;
  onCancel: () => void;
}

function parseFrequency(frequency: string): { pattern: RecurrencePattern; interval: number } {
  const frequencyLower = frequency.toLowerCase();
  
  if (frequencyLower.includes('daily') || frequencyLower.includes('day')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'daily',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('weekly') || frequencyLower.includes('week')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'weekly',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('monthly') || frequencyLower.includes('month')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'monthly',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('twice daily')) {
    return {
      pattern: 'daily',
      interval: 1/2
    };
  }
  
  return {
    pattern: 'daily',
    interval: 1
  };
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
  const { addTask, deleteTask, getTasksByTreatmentId } = useTasks();
  const [treatment, setTreatment] = useState<Treatment | null>(null);

  const [formData, setFormData] = useState<Omit<Treatment, 'id'> & {
    recurring: boolean;
    recurrencePattern: RecurrencePattern;
    recurrenceInterval: number;
    recurrenceWeekDays: number[];
    recurrenceMonthDay: number;
  }>({
    petId: selectedPetId !== 'all' ? selectedPetId : '',
    name: '',
    type: '',
    startDate: new Date().toISOString(),
    frequency: '',
    dosage: '',
    status: 'scheduled',
    recurring: false,
    recurrencePattern: 'daily',
    recurrenceInterval: 1,
    recurrenceWeekDays: [],
    recurrenceMonthDay: 1
  });

  useEffect(() => {
    if (treatmentId) {
      getTreatmentById(treatmentId).then(loadedTreatment => {
        if (loadedTreatment) {
          setTreatment(loadedTreatment);
          // Parse frequency to set recurrence options
          const { pattern, interval } = parseFrequency(loadedTreatment.frequency);
          setFormData({
            petId: loadedTreatment.petId,
            name: loadedTreatment.name,
            type: loadedTreatment.type,
            startDate: loadedTreatment.startDate,
            endDate: loadedTreatment.endDate,
            frequency: loadedTreatment.frequency,
            dosage: loadedTreatment.dosage,
            status: loadedTreatment.status,
            recurring: true,
            recurrencePattern: pattern,
            recurrenceInterval: interval,
            recurrenceWeekDays: [],
            recurrenceMonthDay: 1
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

  const generateFrequencyString = (): string => {
    const { recurrencePattern, recurrenceInterval } = formData;
    if (recurrenceInterval === 1/2) return 'Twice daily';
    
    const intervalStr = recurrenceInterval === 1 ? '' : `${recurrenceInterval} `;
    const patternStr = recurrenceInterval === 1 ? recurrencePattern : `${recurrencePattern}s`;
    return `${intervalStr}${patternStr}`;
  };

  const handleSubmit = async () => {
    try {
      // Update frequency based on recurrence settings
      const treatmentData: Omit<Treatment, 'id'> = {
        petId: formData.petId,
        name: formData.name,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        frequency: formData.recurring ? generateFrequencyString() : 'once',
        dosage: formData.dosage,
        status: formData.status
      };
      
      let savedTreatment: Treatment;
      
      if (treatment?.id) {
        // Update existing treatment
        await updateTreatment(treatment.id, treatmentData);
        savedTreatment = { ...treatmentData, id: treatment.id };

        // Get and delete existing linked tasks
        try {
          const existingTasks = await getTasksByTreatmentId(treatment.id);
          await Promise.all(existingTasks.map(task => deleteTask(task.id)));
        } catch (deleteError) {
          console.error('Error deleting existing tasks:', deleteError);
          Alert.alert(
            'Warning',
            'Could not remove old tasks. You may need to delete them manually.'
          );
        }
      } else {
        // Create new treatment first
        savedTreatment = await addTreatment(treatmentData);
      }

      // Only after the treatment is created/updated, generate and create new tasks
      if (formData.recurring) {
        try {
          const tasks = generateTasksFromTreatment({ treatment: savedTreatment });
          await Promise.all(tasks.map((task: Omit<Task, 'id'>) => {
            try {
              return addTask(task);
            } catch (taskError) {
              console.error('Error creating individual task:', taskError);
              // Continue with other tasks even if one fails
              return null;
            }
          }));
        } catch (tasksError) {
          console.error('Error generating tasks:', tasksError);
          Alert.alert(
            'Warning',
            'Treatment was saved but there was an error creating the associated tasks. The tasks may need to be created manually.'
          );
        }
      }

      onSubmit(treatmentData);
    } catch (error) {
      console.error('Error saving treatment:', error);
      Alert.alert(
        'Error',
        'Failed to save treatment. Please try again.'
      );
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
        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={formData.dosage}
          onChangeText={(value) => setFormData({ ...formData, dosage: value })}
          placeholder="Enter dosage"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.switchContainer}>
        <Switch
          value={formData.recurring}
          onValueChange={(value) =>
            setFormData({ ...formData, recurring: value })
          }
          trackColor={{ false: "#D1D5DB", true: "#0D9488" }}
          thumbColor={formData.recurring ? "#fff" : "#fff"}
        />
        <Text style={styles.switchLabel}>Recurring treatment</Text>
      </View>

      {formData.recurring && (
        <>
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
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleEndDateChange}
                minimumDate={new Date(formData.startDate)}
              />
            )}
          </View>
        </>
      )}

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
    paddingHorizontal: 36,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  intervalText: {
    fontSize: 14,
    color: '#4B5563',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  weekDayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  weekDayButtonSelected: {
    backgroundColor: '#0D9488',
  },
  weekDayText: {
    fontSize: 14,
    color: '#4B5563',
  },
  weekDayTextSelected: {
    color: '#FFFFFF',
  },
});

export default TreatmentForm;