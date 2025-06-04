import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pet } from '../database/types';
import { useRepositories } from '../hooks/useRepositories';

interface PetSelectorProps {
  selectedPetId: string;
  onPetChange: (petId: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({
  selectedPetId,
  onPetChange
}) => {
  const { petRepository } = useRepositories();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const selectedPet = pets.find(p => p.id === selectedPetId);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const allPets = await petRepository.getLivingPets();
        setPets(allPets);
        
      } catch (error) {
        console.error('Error loading pets:', error);
      }
    };
    loadPets();
  }, [petRepository]);

  return (
    <View>
      <TouchableOpacity 
        style={styles.selectorButton}
        onPress={() => setIsModalVisible(true)}
      >
        {selectedPetId !== 'all' && selectedPet ? (
          <Image 
            source={{ uri: selectedPet.imageUrl }} 
            style={styles.petImage} 
          />
        ) : (
          <View style={styles.allPetsIcon}>
            <Text style={styles.allPetsText}>All</Text>
          </View>
        )}
        <Text style={styles.selectorText}>
          {selectedPetId === 'all' ? 'All Pets' : selectedPet?.name}
        </Text>
        <MaterialIcons size={16} name="arrow-drop-down" color="#4B5563" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedPetId === 'all' && styles.selectedOption
              ]}
              onPress={() => {
                onPetChange('all');
                setIsModalVisible(false);
              }}
            >
              <View style={styles.allPetsIcon}>
                <Text style={styles.allPetsText}>All</Text>
              </View>
              <Text style={[
                styles.optionText,
                selectedPetId === 'all' && styles.selectedOptionText
              ]}>
                All Pets
              </Text>
            </TouchableOpacity>

            {pets.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.optionButton,
                  selectedPetId === pet.id && styles.selectedOption
                ]}
                onPress={() => {
                  onPetChange(pet.id);
                  setIsModalVisible(false);
                }}
              >
                <Image 
                  source={{ uri: pet.imageUrl }} 
                  style={styles.petImage} 
                />
                <Text style={[
                  styles.optionText,
                  selectedPetId === pet.id && styles.selectedOptionText
                ]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
  },
  petImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8
  },
  allPetsIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8FFF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  allPetsText: {
    fontSize: 10,
    color: '#0D9488'
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8
  },
  selectedOption: {
    backgroundColor: '#E8FFF8'
  },
  optionText: {
    fontSize: 14,
    color: '#374151'
  },
  selectedOptionText: {
    color: '#0D9488'
  }
});

export default PetSelector;