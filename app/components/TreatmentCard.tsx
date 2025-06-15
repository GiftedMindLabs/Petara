import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Treatment, VetVisit } from "../database/types";
import { useVetVisits } from '../hooks/useVetVisits';

interface TreatmentCardProps {
  treatment: Treatment;
  pet?: Pet;
  showPetInfo?: boolean;
  onPress: () => void;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  pet,
  showPetInfo = false,
  onPress,
}) => {
  const { getVetVisitById } = useVetVisits();
  const [vetVisit, setVetVisit] = useState<VetVisit | null>(null);

  useEffect(() => {
    if (treatment.vetVisitId) {
      getVetVisitById(treatment.vetVisitId).then(setVetVisit);
    }
  }, [treatment.vetVisitId, getVetVisitById]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handlePress = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Edit",
        action: "edit",
        form: "treatment",
        id: treatment.id,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{treatment.name}</Text>
        <View style={[styles.statusBadge, styles[`${treatment.status}Badge`]]}>
          <Text style={[styles.statusText, styles[`${treatment.status}Text`]]}>
            {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.type}>{treatment.type}</Text>
        <Text style={styles.date}>
          {formatDate(treatment.startDate)}
          {treatment.endDate ? ` - ${formatDate(treatment.endDate)}` : ''}
        </Text>
        {treatment.frequency && (
          <Text style={styles.frequency}>Frequency: {treatment.frequency}</Text>
        )}
        {treatment.dosage && (
          <Text style={styles.dosage}>Dosage: {treatment.dosage}</Text>
        )}
        {vetVisit && (
          <View style={styles.vetVisitInfo}>
            <Text style={styles.vetVisitLabel}>Vet Visit:</Text>
            <Text style={styles.vetVisitDate}>
              {formatDate(vetVisit.date)}
            </Text>
            <Text style={styles.vetVisitReason}>
              {vetVisit.reason}
            </Text>
            {vetVisit.contactId && (
              <Text style={styles.vetVisitVet}>
                Vet ID: {vetVisit.contactId}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduledBadge: {
    backgroundColor: '#FEF3C7',
  },
  ongoingBadge: {
    backgroundColor: '#D1FAE5',
  },
  completedBadge: {
    backgroundColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scheduledText: {
    color: '#92400E',
  },
  ongoingText: {
    color: '#065F46',
  },
  completedText: {
    color: '#374151',
  },
  details: {
    gap: 4,
  },
  type: {
    fontSize: 14,
    color: '#4B5563',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  frequency: {
    fontSize: 14,
    color: '#4B5563',
  },
  dosage: {
    fontSize: 14,
    color: '#4B5563',
  },
  vetVisitInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vetVisitLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  vetVisitDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  vetVisitReason: {
    fontSize: 14,
    color: '#4B5563',
  },
  vetVisitVet: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default TreatmentCard; 