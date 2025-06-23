import { IconSymbol } from '@/app/components/ui/IconSymbol';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PetCard from '../components/PetCard';
import { useExpenses } from '../hooks/useExpenses';
import { usePets } from '../hooks/usePets';
import { useTreatments } from '../hooks/useTreatments';
import { useVaccinations } from '../hooks/useVaccinations';
import { useVetVisits } from '../hooks/useVetVisits';
import { useSelectedPet } from '../providers/SelectedPetProvider';

const Profile: React.FC = () => {
  const { selectedPetId } = useSelectedPet();
  const { pets, isLoading: isLoadingPets } = usePets();
  const { vaccinations, isLoading: isLoadingVaccinations } = useVaccinations();
  const { treatments, isLoading: isLoadingTreatments } = useTreatments();
  const { vetVisits, isLoading: isLoadingVisits } = useVetVisits();
  const { expenses, isLoading: isLoadingExpenses } = useExpenses();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "white"
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: "black",
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
    },
    petSubtitle: {
      fontSize: 16,
    },
    section: {
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
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
      marginBottom: 4
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
    }
  });

  if (isLoadingPets || isLoadingVaccinations || isLoadingTreatments || isLoadingVisits || isLoadingExpenses) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

  // Calculate next vaccination
  const upcomingVaccinations = vaccinations
    .filter(v => v.petId === pet.id && new Date(v.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const nextVaccination = upcomingVaccinations[0];

  // Get active treatments
  const activeTreatments = treatments.filter(t => t.petId === pet.id && t.status === 'ongoing');

  // Calculate total expenses
  const petExpenses = expenses.filter(e => e.petId === pet.id);
  const totalExpenses = petExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalReimbursed = petExpenses.reduce((sum, e) => sum + (e.reimbursed || 0), 0);

  // Calculate age
  const age = Math.floor((Date.now() - pet.birthDate) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {pet.imageUrl ? <Image source={{ uri: pet.imageUrl }} style={styles.coverImage} /> : <View style={styles.coverImage} />}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push({
            pathname: "/FormModal",
            params: {
              title: "Edit",
              action: "edit",
              form: "pet",
              id: pet.id,
            },
          })}
        >
          <IconSymbol name="pencil" size={20} color={"white"} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petSubtitle}>
              {pet.breed}, {age} years old
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
              <Text style={styles.value}>{age} years</Text>
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
              <Text style={styles.value}>
                {nextVaccination 
                  ? `${nextVaccination.name} on ${new Date(nextVaccination.startDate).toLocaleDateString()}`
                  : 'No upcoming vaccinations'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Active Treatments</Text>
              <Text style={styles.value}>
                {activeTreatments.length > 0 
                  ? `${activeTreatments.length} ongoing treatment${activeTreatments.length > 1 ? 's' : ''}`
                  : 'No active treatments'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Recent Vet Visits</Text>
              <Text style={styles.value}>
                {vetVisits.length > 0 
                  ? new Date(vetVisits[0].date).toLocaleDateString()
                  : 'No recent visits'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Details</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Allergies</Text>
              <Text style={styles.value}>
                {pet.allergies && pet.allergies.length > 0 
                  ? pet.allergies.join(', ')
                  : 'None known'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Microchip ID</Text>
              <Text style={styles.value}>
                {pet.microchipCode || 'Not microchipped'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Sterilized</Text>
              <Text style={styles.value}>{pet.sterilized ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses Overview</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total Expenses</Text>
              <Text style={styles.value}>${totalExpenses.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total Reimbursed</Text>
              <Text style={styles.value}>${totalReimbursed.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Net Expenses</Text>
              <Text style={styles.value}>${(totalExpenses - totalReimbursed).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;