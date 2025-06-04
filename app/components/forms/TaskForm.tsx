import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../../database/types";
import { useRepositories } from "../../hooks/useRepositories";
import { useTasks } from "../../hooks/useTasks";

type TaskType = "feeding" | "medication" | "walk" | "grooming" | "other";
type RecurrencePattern = "daily" | "weekly" | "monthly" | "yearly";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

const weekDays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { petRepository } = useRepositories();
  const { addTask, updateTask } = useTasks();
  const [pets, setPets] = useState<Array<{ id: string; name: string }>>([]);
  
  useEffect(() => {
    const loadPets = async () => {
      try {
        const allPets = await petRepository.getAllPets();
        setPets(allPets);
      } catch (error) {
        console.error('Error loading pets:', error);
        Alert.alert("Error", "Failed to load pets");
      }
    };
    loadPets();
  }, [petRepository]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    petId: task?.petId || "",
    title: task?.title || "",
    type: task?.type || "other" as TaskType,
    dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
    notes: task?.notes || "",
    recurring: task?.recurring || false,
    recurrencePattern: task?.recurrencePattern || "daily" as RecurrencePattern,
    recurrenceInterval: task?.recurrenceInterval || 1,
    recurrenceWeekDays: task?.recurrenceWeekDays || [],
    recurrenceMonthDay: task?.recurrenceMonthDay || 1,
    recurrenceEndDate: task?.recurrenceEndDate ? new Date(task.recurrenceEndDate) : undefined,
    recurrenceCount: task?.recurrenceCount || undefined,
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(formData.dueDate.getHours());
      newDate.setMinutes(formData.dueDate.getMinutes());
      setFormData({ ...formData, dueDate: newDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, dueDate: newDate });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, recurrenceEndDate: selectedDate });
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleSubmit = async () => {
    if (!formData.petId) {
      Alert.alert("Error", "Please select a pet");
      return;
    }
    if (!formData.title) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      const taskData: Omit<Task, 'id'> = {
        petId: formData.petId,
        title: formData.title,
        type: formData.type,
        dueDate: formData.dueDate.toISOString(),
        notes: formData.notes,
        isComplete: false,
        recurring: formData.recurring,
        ...(formData.recurring && {
          recurrencePattern: formData.recurrencePattern,
          recurrenceInterval: formData.recurrenceInterval,
          recurrenceWeekDays: formData.recurrenceWeekDays,
          recurrenceMonthDay: formData.recurrenceMonthDay,
          recurrenceEndDate: formData.recurrenceEndDate?.toISOString(),
          recurrenceCount: formData.recurrenceCount,
        }),
      };

      if (task?.id) {
        // Update existing task
        const success = await updateTask(task.id, taskData);
        if (success) {
          onSubmit({ ...taskData, id: task.id });
        } else {
          throw new Error("Failed to update task");
        }
      } else {
        // Create new task
        const newTask = await addTask(taskData);
        onSubmit(newTask);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert("Error", "Failed to save task. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formField}>
        <Text style={styles.label}>Pet</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.petId}
            onValueChange={(value: string) =>
              setFormData({ ...formData, petId: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Select a pet" value="" />
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(value) => setFormData({ ...formData, title: value })}
          placeholder="Enter task title"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(value: TaskType) =>
              setFormData({ ...formData, type: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Feeding" value="feeding" />
            <Picker.Item label="Medication" value="medication" />
            <Picker.Item label="Walk" value="walk" />
            <Picker.Item label="Grooming" value="grooming" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formData.dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formatTime(formData.dueDate)}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={formData.dueDate}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}
        </View>
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

      <View style={styles.switchContainer}>
        <Switch
          value={formData.recurring}
          onValueChange={(value) =>
            setFormData({ ...formData, recurring: value })
          }
          trackColor={{ false: "#D1D5DB", true: "#0D9488" }}
          thumbColor={formData.recurring ? "#fff" : "#fff"}
        />
        <Text style={styles.switchLabel}>Recurring task</Text>
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
            <Text style={styles.label}>End</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.recurrenceCount ? "count" : "date"}
                onValueChange={(value) => {
                  if (value === "count") {
                    setFormData({
                      ...formData,
                      recurrenceCount: 10,
                      recurrenceEndDate: undefined,
                    });
                  } else {
                    setFormData({
                      ...formData,
                      recurrenceCount: undefined,
                      recurrenceEndDate: new Date(),
                    });
                  }
                }}
                style={styles.picker}
              >
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
                    {formData.recurrenceEndDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={formData.recurrenceEndDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndDateChange}
                    minimumDate={formData.dueDate}
                  />
                )}
              </>
            )}
          </View>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            {task ? "Update" : "Create"}
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
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  pickerContainer: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#1F2937",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#4B5563",
  },
  submitButton: {
    backgroundColor: "#0D9488",
  },
  submitButtonText: {
    color: "#FFFFFF",
  },
  intervalText: {
    alignSelf: "center",
    marginLeft: 8,
    color: "#4B5563",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  weekDayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  weekDayButtonSelected: {
    backgroundColor: "#0D9488",
  },
  weekDayText: {
    fontSize: 14,
    color: "#4B5563",
  },
  weekDayTextSelected: {
    color: "#FFFFFF",
  },
});

export default TaskForm;
