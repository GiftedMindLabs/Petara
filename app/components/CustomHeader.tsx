import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PetSelector from './PetSelector';
import { IconSymbol } from './ui/IconSymbol';

const CustomHeader: React.FC = () => {
  const [selectedPetId, setSelectedPetId] = useState('all');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Petara</Text>
          <IconSymbol name="pawprint.fill" size={24} color="#0D9488" />
        </View>
        <View style={styles.actions}>
          <PetSelector
            selectedPetId={selectedPetId}
            onPetChange={setSelectedPetId}
          />
          <TouchableOpacity
            style={styles.notificationButton}
          >
            <IconSymbol name="bell.fill" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 8,
    paddingBottom: 12
  },
  content: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB'
  }
}); 

export default CustomHeader;