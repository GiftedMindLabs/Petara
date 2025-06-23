import ExpenseCard from '@/app/components/ExpenseCard';
import AddButton from '@/app/components/ui/AddButton';
import { IconSymbol } from '@/app/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExpenses } from '../hooks/useExpenses';
import { usePets } from '../hooks/usePets';

const categories = ['All Categories', 'veterinary', 'food', 'supplies', 'grooming', 'medications', 'other'];

const Expenses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { expenses, isLoading } = useExpenses();
  const { pets } = usePets();

  const filteredExpenses = expenses.filter(expense => {
    if (selectedCategory === 'All Categories') {
      return true;
    }
    return expense.category === selectedCategory;
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <IconSymbol name="dollarsign.circle.fill" size={20} color="#0D9488" />
      </View>

      <AddButton
        label="Add Expense"
        onPress={() =>
          router.push({
            pathname: "/FormModal",
            params: {
              title: "Add",
              action: "create",
              form: "expense",
            },
          })
        }
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Cost</Text>
          
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
      >
        <View style={styles.filterHeader}>
          <IconSymbol name="line.3.horizontal.decrease" size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Filter:</Text>
        </View>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === category && styles.filterButtonTextActive
            ]}>
              {category === 'veterinary' ? 'Veterinary Care' :
               category === 'medications' ? 'Medications' :
               category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.expensesList}>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map(expense => {
            const pet = pets.find(p => p.id === expense.petId);
            return (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                pet={pet}
                showPetInfo={true}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {selectedCategory === 'All Categories' 
                ? 'No expenses found' 
                : `No ${selectedCategory} expenses found`}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937'
  },
  filterContainer: {
    marginBottom: 16
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingVertical: 8
  },
  filterLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#F3F4F6',
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#E8FFF8'
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4B5563'
  },
  filterButtonTextActive: {
    color: '#0D9488'
  },
  expensesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    padding: 12
  },
  emptyState: {
    alignItems: 'center',
    padding: 24
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280'
  }
});

export default Expenses; 