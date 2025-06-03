import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock expense data since it's not in our main mock data
const expenses = [{
  id: '1',
  petId: '1',
  amount: 85.5,
  date: '2023-11-15',
  category: 'Vet',
  description: 'Annual checkup',
  reimbursed: 0
}, {
  id: '2',
  petId: '2',
  amount: 45.99,
  date: '2023-11-20',
  category: 'Food',
  description: 'Premium cat food (1 month)',
  reimbursed: 0
}, {
  id: '3',
  petId: '1',
  amount: 120.0,
  date: '2023-12-05',
  category: 'Grooming',
  description: 'Full service grooming',
  reimbursed: 0
}, {
  id: '4',
  petId: '3',
  amount: 250.0,
  date: '2023-12-10',
  category: 'Vet',
  description: 'Dental cleaning',
  reimbursed: 150.0
}];

const categories = ['All Categories', 'Vet', 'Food', 'Grooming'];

const Expenses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalReimbursed = expenses.reduce((sum, expense) => sum + expense.reimbursed, 0);
  const netExpenses = totalExpenses - totalReimbursed;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <IconSymbol name="dollarsign.circle.fill" size={20} color="#0D9488" />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryValue}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Cost</Text>
          <Text style={styles.summaryValue}>
            ${netExpenses.toFixed(2)}
          </Text>
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
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.expensesList}>
        {expenses.map(expense => (
          <View key={expense.id} style={styles.expenseItem}>
            <View style={styles.expenseHeader}>
              <View>
                <Text style={styles.expenseDescription}>
                  {expense.description}
                </Text>
                <Text style={styles.expenseDate}>
                  {new Date(expense.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.expenseAmounts}>
                <Text style={styles.expenseAmount}>
                  ${expense.amount.toFixed(2)}
                </Text>
                {expense.reimbursed > 0 && (
                  <Text style={styles.reimbursedAmount}>
                    -${expense.reimbursed.toFixed(2)} reimbursed
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.expenseFooter}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{expense.category}</Text>
              </View>
              <Text style={styles.petId}>Pet ID: {expense.petId}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Expense</Text>
      </TouchableOpacity>
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
    elevation: 2
  },
  expenseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  expenseDescription: {
    fontWeight: '500',
    color: '#1F2937'
  },
  expenseDate: {
    fontSize: 14,
    color: '#6B7280'
  },
  expenseAmounts: {
    alignItems: 'flex-end'
  },
  expenseAmount: {
    fontWeight: '500',
    color: '#1F2937'
  },
  reimbursedAmount: {
    fontSize: 12,
    color: '#059669'
  },
  expenseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    marginRight: 8
  },
  categoryText: {
    fontSize: 12,
    color: '#4B5563'
  },
  petId: {
    fontSize: 12,
    color: '#6B7280'
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#0D9488',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default Expenses; 