import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Vaccination } from "../database/types";

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
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
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
              Given: {new Date(vaccination.dateGiven).toLocaleDateString()}
            </Text>
            <Text style={styles.timestamp}>
              Due: {new Date(vaccination.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={styles.notes}>
          Administered by: {vaccination.administeredBy}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  cardContent: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  dateContainer: {
    gap: 4,
  },
  timestamp: {
    fontSize: 14,
    color: "#6B7280",
  },
  notes: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  bullet: {
    marginHorizontal: 6,
    color: "#6B7280",
  },
});

export default VaccinationCard; 