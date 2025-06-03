import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { pets, treatments } from '../utils/mockData';

const Treatments: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treatments</Text>
        <IconSymbol name="pill.fill" size={20} color="#0D9488" />
      </View>
      <View style={styles.listContainer}>
        {treatments.map(treatment => {
          const pet = pets.find(p => p.id === treatment.petId);
          return (
            <View key={treatment.id} style={styles.treatmentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.petInfo}>
                  {pet && (
                    <Image 
                      source={{ uri: pet.imageUrl }} 
                      style={styles.petImage} 
                    />
                  )}
                  <Text style={styles.petName}>{pet?.name}</Text>
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
              <Text style={styles.treatmentName}>{treatment.name}</Text>
              <Text style={styles.treatmentDetails}>
                {treatment.dosage}, {treatment.frequency}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.dateText}>
                  Started: {new Date(treatment.startDate).toLocaleDateString()}
                </Text>
                {treatment.endDate && (
                  <>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.dateText}>
                      Ended: {new Date(treatment.endDate).toLocaleDateString()}
                    </Text>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.buttonText}>Add New Treatment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  listContainer: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  treatmentCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8
  },
  petName: {
    fontWeight: '500',
    color: '#1F2937'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusOngoing: {
    backgroundColor: '#DBEAFE'
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7'
  },
  statusPending: {
    backgroundColor: '#FEF3C7'
  },
  statusText: {
    fontSize: 12,
  },
  statusOngoingText: {
    color: '#1E40AF'
  },
  statusCompletedText: {
    color: '#166534'
  },
  statusPendingText: {
    color: '#92400E'
  },
  treatmentName: {
    fontWeight: '500',
    color: '#1F2937'
  },
  treatmentDetails: {
    fontSize: 14,
    color: '#4B5563'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280'
  },
  bullet: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 8
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#0D9488',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default Treatments;