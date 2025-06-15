import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePets } from '../hooks/usePets';
import { IconSymbol } from './ui/IconSymbol';

interface PetSelectorProps {
  selectedPetId: string;
  onPetChange: (petId: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({
  selectedPetId,
  onPetChange
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { pets } = usePets();
  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <View>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setIsModalVisible(true)}
      >
        {selectedPetId !== 'all' && selectedPet && selectedPet.imageUrl ? (
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
                {pet.imageUrl && (
                  <Image
                    source={{ uri: pet.imageUrl }}
                    style={styles.petImage}
                  />
                )}
                <Text style={[
                  styles.optionText,
                  selectedPetId === pet.id && styles.selectedOptionText
                ]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.addPetButton}
              onPress={() => {
                setIsModalVisible(false);
                router.push({
                  pathname: "/FormModal",
                  params: {
                    title: "Add",
                    action: "create",
                    form: "pet",
                  },
                });
              }}
            >
              <IconSymbol name="plus" size={16} color="#0D9488" />
              <Text style={styles.addPetText}>Add New Pet</Text>
            </TouchableOpacity>
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
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addPetText: {
    fontSize: 14,
    color: '#0D9488',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default PetSelector;