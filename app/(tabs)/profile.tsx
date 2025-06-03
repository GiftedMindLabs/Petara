import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PetCard from '../components/PetCard';
import { pets } from '../utils/mockData';

interface ProfileProps {
  selectedPetId?: string;
}

const Profile: React.FC<ProfileProps> = ({
  selectedPetId = 'all'
}) => {
  if (selectedPetId === 'all') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>My Pets</Text>
        <View style={styles.petList}>
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </View>
      </ScrollView>
    );
  }

  const pet = pets.find(p => p.id === selectedPetId);
  if (!pet) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: pet.imageUrl }} style={styles.coverImage} />
        <TouchableOpacity style={styles.editButton}>
          <IconSymbol name="pencil" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petSubtitle}>
              {pet.breed}, {Date.now() - pet.birthDate} years old
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Species</Text>
              <Text style={styles.value}>{pet.species}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Breed</Text>
              <Text style={styles.value}>{pet.breed}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{Date.now() - pet.birthDate} years</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{pet.weight} lbs</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Next Vaccination Due</Text>
              <Text style={styles.value}>March 15, 2024</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Active Treatments</Text>
              <Text style={styles.value}>2 ongoing treatments</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Microchip ID</Text>
              <Text style={styles.value}>985141123456789</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Insurance Policy</Text>
              <Text style={styles.value}>PetCare Plus - Premium Plan</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Special Notes</Text>
              <Text style={styles.value}>Allergic to chicken</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    padding: 16
  },
  petList: {
    padding: 16,
    gap: 16
  },
  imageContainer: {
    height: 192,
    position: 'relative'
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  petSubtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16
  },
  infoList: {
    gap: 12
  },
  infoRow: {
    marginBottom: 8
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  }
});

export default Profile;