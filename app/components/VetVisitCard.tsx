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
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/FormModal",
          params: {
            title: "Edit",
            action: "edit",
            form: "vetVisit",
            id: visit.id,
          },
        })
      }
    >
      <View style={styles.content}>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(visit.date)}</Text>
          <Text style={styles.reason}>{visit.reason}</Text>
          {visit.notes && <Text style={styles.notes}>{visit.notes}</Text>}
          <Text style={styles.vet}>Dr. {visit.vetName}</Text>
          {visit.weight && (
            <Text style={styles.weight}>Weight: {visit.weight} lbs</Text>
          )}
        </View>
      </View>
      {showPetInfo && pet && (
        <View style={styles.petInfo}>
          {pet.imageUrl ? (
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
          ) : (
            <View style={[styles.petImage, styles.placeholderImage]} />
          )}
          <Text style={styles.petName}>{pet.name}</Text>
        </View>
      )}
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
  content: {
  },
  details: {
    flexDirection: "column",
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
  },
  reason: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  vet: {
    fontSize: 14,
    color: "#6B7280",
  },
  weight: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholderImage: {
    backgroundColor: "#F3F4F6",
  },
});

export default VetVisitCard; 