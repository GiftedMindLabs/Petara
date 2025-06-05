import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet } from "../database/types";
import { useSelectedPet } from "../providers/SelectedPetProvider";

interface PetCardProps {
  pet: Pet;
  showStatus?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ pet, showStatus = true }) => {
  const router = useRouter();
  const { setSelectedPetId } = useSelectedPet();
  // Determine pet status (mock logic)
  const status = pet.id === "1" ? "alert" : "ok";

  const handlePress = () => {
    setSelectedPetId(pet.id);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pet.imageUrl }}
            style={styles.image}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{pet.name}</Text>
            {showStatus && (
              <View>
                {status === "ok" ? (
                  <MaterialIcons 
                    name="check-circle" 
                    size={18} 
                    color="#22C55E" 
                  />
                ) : (
                  <MaterialIcons
                    name="warning"
                    size={18}
                    color="#F97316"
                  />
                )}
              </View>
            )}
          </View>
          <Text style={styles.breed}>{pet.breed}</Text>
          <View style={styles.footer}>
            <Text style={styles.detail}>{Math.floor((Date.now() - pet.birthDate) / (365.25 * 24 * 60 * 60 * 1000))} years</Text>
            <Text style={styles.detail}>{pet.weight} lbs</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  imageContainer: {
    height: 128,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  content: {
    padding: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  breed: {
    fontSize: 14,
    color: '#6B7280'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  detail: {
    fontSize: 12,
    color: '#6B7280'
  }
});

export default PetCard;
