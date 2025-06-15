import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelectedPet } from '../providers/SelectedPetProvider';
import PetSelector from './PetSelector';

export const CustomHeader: React.FC = () => {
  const { selectedPetId, setSelectedPetId } = useSelectedPet();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Petara</Text>
          <Image source={require('../../assets/images/foreground_color.png')} style={styles.logo} />
        </View>
        <View style={styles.actions}>
          <PetSelector
            selectedPetId={selectedPetId}
            onPetChange={setSelectedPetId}
          />
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
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain'
  }
});

export default CustomHeader;