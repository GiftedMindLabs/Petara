import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePets } from '../hooks/usePets';

const FoodSchedule: React.FC = () => {
  const { pets } = usePets();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Schedule</Text>
        <MaterialIcons name="restaurant" size={20} color="#0D9488" />
      </View>

      <View style={styles.scheduleList}>
        {pets.map(pet => (
          <View key={pet.id} style={styles.scheduleCard}>
            <View style={styles.petHeader}>
              <Image 
                source={{ uri: pet.imageUrl ?? undefined }} 
                style={styles.petImage} 
              />
              <Text style={styles.petName}>{pet.name}</Text>
            </View>

            <View style={styles.mealsList}>
              <View style={styles.mealItem}>
                <View>
                  <Text style={styles.mealName}>Breakfast</Text>
                  <Text style={styles.foodType}>Premium Dry Food</Text>
                </View>
                <Text style={styles.mealTime}>8:00 AM</Text>
              </View>

              <View style={[styles.mealItem, styles.border]}>
                <View>
                  <Text style={styles.mealName}>Dinner</Text>
                  <Text style={styles.foodType}>Premium Wet Food</Text>
                </View>
                <Text style={styles.mealTime}>6:00 PM</Text>
              </View>
            </View>

            <View style={styles.editSection}>
              <TouchableOpacity>
                <Text style={styles.editButton}>Edit Food Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
  scheduleList: {
    gap: 24
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB'
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  mealsList: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  mealItem: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  },
  foodType: {
    fontSize: 14,
    color: '#6B7280'
  },
  mealTime: {
    fontSize: 14,
    color: '#6B7280'
  },
  editSection: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center'
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D9488'
  }
});

export default FoodSchedule;