import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Vaccination } from "../database/types";
import { useVetVisits } from "../hooks/useVetVisits";

interface VaccinationCardProps {
  vaccination: Vaccination;
  pet?: Pet;
  showPetInfo?: boolean;
}

const VaccinationCard: React.FC<VaccinationCardProps> = ({
  vaccination,
  pet,
  showPetInfo = false,
}) => {
  const { vetVisits } = useVetVisits();
  const vetVisit = vaccination.vetVisitId ? vetVisits.find(v => v.id === vaccination.vetVisitId) : null;

  const handlePress = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Edit",
        action: "edit",
        form: "vaccination",
        id: vaccination.id,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.card}>
        {showPetInfo && pet && (
          <View style={styles.petInfo}>
            {pet.imageUrl && (
              <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            )}
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <IconSymbol name="syringe.fill" size={16} color="#0D9488" />
            <Text style={styles.cardTitle}>{vaccination.name}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.timestamp}>
              Start: {new Date(vaccination.startDate).toLocaleDateString()}
            </Text>
            {vaccination.endDate && (
              <Text style={styles.timestamp}>
                End: {new Date(vaccination.endDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.notes}>
          {vetVisit && (
            <Text style={styles.vetInfo}>
              {` • During visit: ${new Date(vetVisit.date).toLocaleDateString()}`}
              {vetVisit.reason && ` • Reason: ${vetVisit.reason}`}
            </Text>
          )}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Lot #: {vaccination.lotNumber}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.footerText}>
            Manufacturer: {vaccination.manufacturer}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  petName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  cardContent: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 14,
    color: '#6B7280',
  },
  notes: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  vetInfo: {
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bullet: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
});

export default VaccinationCard; 