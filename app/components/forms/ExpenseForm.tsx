import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Expense } from '../../database/types';
import { useExpenses } from '../../hooks/useExpenses';
import { usePets } from '../../hooks/usePets';
import { useVaccinations } from '../../hooks/useVaccinations';
import { useVetVisits } from '../../hooks/useVetVisits';
import { useSelectedPet } from '../../providers/SelectedPetProvider';

interface ExpenseFormProps {
  expenseId?: string;
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expenseId,
  onSubmit,
  onCancel
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { pets } = usePets();
  const { selectedPetId } = useSelectedPet();
  const { addExpense, updateExpense, getExpenseById } = useExpenses();
  const { visits } = useVetVisits();
  const { vaccinations } = useVaccinations();
  const [expense, setExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    petId: selectedPetId !== 'all' ? selectedPetId : '',
    date: new Date().getTime(),
    amount: 0,
    category: 'veterinary',
    description: '',
    vendor: '',
    reimbursed: 0,
    linkedVetVisitId: undefined,
    linkedVaccinationId: undefined
  });

  useEffect(() => {
    if (expenseId) {
      getExpenseById(expenseId).then(loadedExpense => {
        if (loadedExpense) {
          setExpense(loadedExpense);
          setFormData({
            petId: loadedExpense.petId,
            date: loadedExpense.date,
            amount: loadedExpense.amount,
            category: loadedExpense.category,
            description: loadedExpense.description,
            vendor: loadedExpense.vendor,
            reimbursed: loadedExpense.reimbursed,
            linkedVetVisitId: loadedExpense.linkedVetVisitId,
            linkedVaccinationId: loadedExpense.linkedVaccinationId
          });
        }
      });
    }
  }, [expenseId, getExpenseById]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate.getTime() });
    }
  };

  const handleSubmit = async () => {
    try {
      if (expenseId) {
        await updateExpense(expenseId, formData);
      } else {
        await addExpense(formData);
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving expense:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
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
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.date)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.date)}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={formData.amount.toString()}
          onChangeText={(value) => setFormData({ ...formData, amount: parseFloat(value) || 0 })}
          keyboardType="decimal-pad"
          placeholder="Enter amount"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.category}
            onValueChange={(value: 'veterinary' | 'food' | 'supplies' | 'grooming' | 'medications' | 'other') => {
              setFormData({ 
                ...formData, 
                category: value,
                linkedVetVisitId: value !== 'veterinary' ? undefined : formData.linkedVetVisitId,
                linkedVaccinationId: value !== 'veterinary' ? undefined : formData.linkedVaccinationId
              });
            }}
            style={styles.picker}
          >
            <Picker.Item label="Veterinary Care" value="veterinary" />
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Supplies" value="supplies" />
            <Picker.Item label="Grooming" value="grooming" />
            <Picker.Item label="Medications" value="medications" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      {formData.category === 'veterinary' && (
        <>
          <View style={styles.formField}>
            <Text style={styles.label}>Link to Vet Visit</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.linkedVetVisitId}
                onValueChange={(value: string | undefined) => 
                  setFormData({ ...formData, linkedVetVisitId: value })}
                style={styles.picker}
              >
                <Picker.Item label="None" value={undefined} />
                {visits
                  .filter(visit => visit.petId === formData.petId)
                  .map(visit => (
                    <Picker.Item 
                      key={visit.id} 
                      label={`${new Date(visit.date).toLocaleDateString()} - ${visit.reason}`} 
                      value={visit.id} 
                    />
                  ))
                }
              </Picker>
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Link to Vaccination</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.linkedVaccinationId}
                onValueChange={(value: string | undefined) => 
                  setFormData({ ...formData, linkedVaccinationId: value })}
                style={styles.picker}
              >
                <Picker.Item label="None" value={undefined} />
                {vaccinations
                  .filter(vacc => vacc.petId === formData.petId)
                  .map(vacc => (
                    <Picker.Item 
                      key={vacc.id} 
                      label={`${new Date(vacc.startDate).toLocaleDateString()} - ${vacc.name}`} 
                      value={vacc.id} 
                    />
                  ))
                }
              </Picker>
            </View>
          </View>
        </>
      )}

      <View style={styles.formField}>
        <Text style={styles.label}>Vendor</Text>
        <TextInput
          style={styles.input}
          value={formData.vendor}
          onChangeText={(value) => setFormData({ ...formData, vendor: value })}
          placeholder="Enter vendor name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => setFormData({ ...formData, description: value })}
          placeholder="Enter description"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Reimbursed Amount</Text>
        <TextInput
          style={styles.input}
          value={formData.reimbursed.toString()}
          onChangeText={(value) => setFormData({ ...formData, reimbursed: parseFloat(value) || 0 })}
          keyboardType="decimal-pad"
          placeholder="Enter reimbursed amount"
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
            {expenseId ? 'Update' : 'Add'} Expense
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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

export default ExpenseForm;