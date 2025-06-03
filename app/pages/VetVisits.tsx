import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { pets, vetVisits } from '../utils/mockData';

const VetVisits: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vet Visits</Text>
        <IconSymbol name="cross.case.fill" size={20} color="#0D9488" />
      </View>
      <View style={styles.listContainer}>
        {vetVisits.map(visit => {
          const pet = pets.find(p => p.id === visit.petId);
          return (
            <View key={visit.id} style={styles.visitCard}>
              <View style={styles.petInfo}>
                {pet && (
                  <Image 
                    source={{ uri: pet.imageUrl }} 
                    style={styles.petImage} 
                  />
                )}
                <View>
                  <Text style={styles.petName}>{pet?.name}</Text>
                  <Text style={styles.date}>
                    {new Date(visit.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.visitDetails}>
                <Text style={styles.reason}>{visit.reason}</Text>
                <Text style={styles.notes}>{visit.notes}</Text>
                <View style={styles.footer}>
                  <Text style={styles.vetName}>{visit.vetName}</Text>
                  {visit.weight && (
                    <Text style={styles.weight}>{visit.weight} lbs</Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.buttonText}>Add New Vet Visit</Text>
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
  visitCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  petName: {
    fontWeight: '500',
    color: '#1F2937'
  },
  date: {
    fontSize: 14,
    color: '#6B7280'
  },
  visitDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12
  },
  reason: {
    fontWeight: '500',
    color: '#1F2937'
  },
  notes: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  vetName: {
    fontSize: 12,
    color: '#6B7280'
  },
  weight: {
    fontSize: 12,
    color: '#6B7280'
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

export default VetVisits;