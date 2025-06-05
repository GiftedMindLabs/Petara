import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Treatment } from "../database/types";

interface TreatmentCardProps {
  treatment: Treatment;
  pet?: Pet;
  showPetInfo?: boolean;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  pet,
  showPetInfo = false,
}) => {
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
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.card}>
        {showPetInfo && pet && (
          <View style={styles.petInfo}>
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <IconSymbol name="pill.fill" size={16} color="#0D9488" />
            <Text style={styles.cardTitle}>{treatment.name}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            treatment.status === 'ongoing' ? styles.statusOngoing :
            treatment.status === 'completed' ? styles.statusCompleted :
            styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              treatment.status === 'ongoing' ? styles.statusOngoingText :
              treatment.status === 'completed' ? styles.statusCompletedText :
              styles.statusPendingText
            ]}>
              {treatment.status}
            </Text>
          </View>
        </View>
        <Text style={styles.notes}>
          {treatment.dosage}, {treatment.frequency}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Started: {new Date(treatment.startDate).toLocaleDateString()}
          </Text>
          {treatment.endDate && (
            <>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.footerText}>
                Ended: {new Date(treatment.endDate).toLocaleDateString()}
              </Text>
            </>
          )}
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
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusOngoing: {
    backgroundColor: '#DBEAFE',
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
  },
  statusOngoingText: {
    color: '#1E40AF',
  },
  statusCompletedText: {
    color: '#166534',
  },
  statusPendingText: {
    color: '#92400E',
  },
  notes: {
    marginTop: 8,
    color: '#4B5563',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bullet: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 8,
  },
});

export default TreatmentCard; 