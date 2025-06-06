import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Expense, Pet } from "../database/types";
import { useVaccinations } from "../hooks/useVaccinations";
import { useVetVisits } from "../hooks/useVetVisits";

interface ExpenseCardProps {
  expense: Expense;
  pet?: Pet;
  showPetInfo?: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  pet,
  showPetInfo = false,
}) => {
  const { visits } = useVetVisits();
  const { vaccinations } = useVaccinations();

  const linkedVetVisit = expense.linkedVetVisitId 
    ? visits.find(v => v.id === expense.linkedVetVisitId)
    : undefined;

  const linkedVaccination = expense.linkedVaccinationId
    ? vaccinations.find(v => v.id === expense.linkedVaccinationId)
    : undefined;

  const handlePress = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Edit",
        action: "edit",
        form: "expense",
        id: expense.id,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {showPetInfo && pet && (
            <View style={styles.petInfo}>
              <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
              <Text style={styles.petName}>{pet.name}</Text>
            </View>
          )}
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
            {expense.reimbursed > 0 && (
              <Text style={styles.reimbursed}>
                -${expense.reimbursed.toFixed(2)} reimbursed
              </Text>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <IconSymbol name="dollarsign.circle.fill" size={16} color="#0D9488" />
            <Text style={styles.description}>{expense.description}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{expense.category}</Text>
          </View>
        </View>

        {(linkedVetVisit || linkedVaccination) && (
          <View style={styles.linkedInfo}>
            {linkedVetVisit && (
              <View style={styles.linkedItem}>
                <IconSymbol name="stethoscope" size={14} color="#6B7280" />
                <Text style={styles.linkedText}>
                  Visit: {linkedVetVisit.reason} ({new Date(linkedVetVisit.date).toLocaleDateString()})
                </Text>
              </View>
            )}
            {linkedVaccination && (
              <View style={styles.linkedItem}>
                <IconSymbol name="cross.case.fill" size={14} color="#6B7280" />
                <Text style={styles.linkedText}>
                  Vaccine: {linkedVaccination.name} ({new Date(linkedVaccination.dateGiven).toLocaleDateString()})
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.vendor}>{expense.vendor}</Text>
          <Text style={styles.date}>
            {new Date(expense.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  petName: {
    fontWeight: '500',
    color: '#1F2937',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  reimbursed: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  categoryText: {
    fontSize: 12,
    color: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendor: {
    fontSize: 14,
    color: '#6B7280',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkedInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  linkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  linkedText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default ExpenseCard; 