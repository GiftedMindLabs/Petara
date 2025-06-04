import { usePets } from '@/app/hooks/usePets';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Pet } from '../../database/types';
import { IconSymbol } from '../ui/IconSymbol';

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: Pet) => void;
  onCancel: () => void;
}

type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';
type PetSex = 'male' | 'female';

const PetForm: React.FC<PetFormProps> = ({
  pet,
  onSubmit,
  onCancel
}) => {
  const {pets, addPet, updatePet} = usePets();
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || 'dog' as PetSpecies,
    breed: pet?.breed || '',
    sex: pet?.sex || 'male' as PetSex,
    birthDate: pet?.birthDate || new Date().getTime(),
    allergies: pet?.allergies || [],
    weight: pet?.weight?.toString() || '',
    microchipCode: pet?.microchipCode?.toString() || '',
    sterilized: pet?.sterilized || false,
    deceased: pet?.deceased || false,
    imageUrl: pet?.imageUrl || ''
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUrl: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name) {
        Alert.alert('Error', 'Please enter a pet name');
        return;
      }

      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        sex: formData.sex,
        birthDate: formData.birthDate,
        allergies: formData.allergies,
        weight: parseFloat(formData.weight) || 0,
        microchipCode: parseInt(formData.microchipCode) || 0,
        sterilized: formData.sterilized,
        deceased: formData.deceased,
        imageUrl: formData.imageUrl || 'default_pet_image.png'
      };

      let result;
      if (pet?.id) {
        await updatePet(pet.id, petData);
        result = { ...petData, id: pet.id };
      } else {
        result = await addPet(petData);
      }

      onSubmit(result);
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Error', 'Failed to save pet. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.image} />
            ) : (
              <IconSymbol name="camera" size={32} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
            <IconSymbol name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter pet name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Species</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.species}
            onValueChange={(value: PetSpecies) => setFormData({ ...formData, species: value })}
            style={styles.picker}
          >
            <Picker.Item label="Dog" value="dog" />
            <Picker.Item label="Cat" value="cat" />
            <Picker.Item label="Bird" value="bird" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Sex</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.sex}
            onValueChange={(value: PetSex) => setFormData({ ...formData, sex: value })}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Breed</Text>
        <TextInput
          style={styles.input}
          value={formData.breed}
          onChangeText={(value) => setFormData({ ...formData, breed: value })}
          placeholder="Enter breed"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(value) => setFormData({ ...formData, weight: value })}
            placeholder="0.0"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Microchip</Text>
          <TextInput
            style={styles.input}
            value={formData.microchipCode}
            onChangeText={(value) => setFormData({ ...formData, microchipCode: value })}
            placeholder="Enter code"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Sterilized</Text>
          <Switch
            value={formData.sterilized}
            onValueChange={(value) => setFormData({ ...formData, sterilized: value })}
            trackColor={{ false: "#D1D5DB", true: "#0D9488" }}
            thumbColor={formData.sterilized ? "#fff" : "#fff"}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Deceased</Text>
          <Switch
            value={formData.deceased}
            onValueChange={(value) => setFormData({ ...formData, deceased: value })}
            trackColor={{ false: "#D1D5DB", true: "#0D9488" }}
            thumbColor={formData.deceased ? "#fff" : "#fff"}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {pet ? 'Save Changes' : 'Add Pet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0D9488',
    padding: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  submitButton: {
    backgroundColor: '#0D9488',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
});

export default PetForm;