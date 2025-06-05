import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, VetVisit } from "../database/types";

interface VetVisitCardProps {
  visit: VetVisit;
  pet?: Pet;
  showPetInfo?: boolean;
}

const VetVisitCard: React.FC<VetVisitCardProps> = ({
  visit,
  pet,
  showPetInfo = false,
}) => {
  const handlePress = () => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Edit",
        action: "edit",
        form: "vetVisit",
        id: visit.id,
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
          <Text style={styles.cardTitle}>{visit.reason}</Text>
          <Text style={styles.timestamp}>
            {new Date(visit.date).toLocaleDateString()}
          </Text>
        </View>
        {visit.notes && <Text style={styles.notes}>{visit.notes}</Text>}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{visit.vetName}</Text>
          {visit.weight && (
            <>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.footerText}>{visit.weight} lbs</Text>
            </>
          )}
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
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

export default VetVisitCard; 