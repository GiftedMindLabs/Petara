import { usePets } from '@/app/hooks/usePets';
import { useSelectedPet } from '@/app/providers/SelectedPetProvider';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Pet } from '../../database/types';
import { IconSymbol } from '../ui/IconSymbol';

interface PetFormProps {
  petId?: string;
  onSubmit: (data: Pet) => void;
  onCancel: () => void;
}

type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';
type PetSex = 'male' | 'female';

interface FormErrors {
  name?: string;
  weight?: string;
  microchipCode?: string;
  birthDate?: string;
}

const PetForm: React.FC<PetFormProps> = ({
  petId,
  onSubmit,
  onCancel
}) => {
  const { addPet, updatePet, getPetById } = usePets();
  const [errors, setErrors] = useState<FormErrors>({});
  const { selectedPetId } = useSelectedPet()
  const [formData, setFormData] = useState<{

    id: string,
    name: string,
    species: PetSpecies,
    breed: string,
    sex: PetSex,
    birthDate: number,
    allergies: string[],
    weight: number,
    microchipCode: number | null,
    sterilized: boolean,
    deceased: boolean,
    imageUrl: string | null
  }>({
    id: selectedPetId !== "all" ? selectedPetId : '',
    name: '',
    species: 'dog' as PetSpecies,
    breed: '',
    sex: 'male' as PetSex,
    birthDate: new Date().getTime(),
    allergies: [] as string[],
    weight: 0,
    microchipCode: null,
    sterilized: false,
    deceased: false,
    imageUrl: null
  });

  useEffect(() => {
    if (petId) {
      getPetById(petId).then(Pet => {
        if (Pet) {
          setFormData({
            id: Pet.id,
            name: Pet.name,
            species: Pet.species,
            breed: Pet.breed,
            sex: Pet.sex,
            birthDate: Pet.birthDate,
            allergies: Pet.allergies,
            weight: Pet.weight,
            microchipCode: Pet.microchipCode,
            sterilized: Pet.sterilized,
            deceased: Pet.deceased,
            imageUrl: Pet.imageUrl
          })
        }
      })
    }
  }, [petId])

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to add a pet image.');
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
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (formData.weight && !/^\d*\.?\d*$/.test(formData.weight.toString())) {
      newErrors.weight = 'Weight must be a valid number';
    }

    if (formData.microchipCode && !/^\d+$/.test(formData.microchipCode.toString())) {
      newErrors.microchipCode = 'Microchip code must be a valid number';
    }

    if (formData.birthDate > new Date().getTime()) {
      newErrors.birthDate = 'Birth date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      let result;
      if (petId) {
        await updatePet(petId, formData);
      } else {
        result = await addPet(formData);
      }

      if (result) {

        onSubmit(result);
      }
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
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(value) => {
            setFormData({ ...formData, name: value });
            setErrors(prev => ({ ...prev, name: undefined }));
          }}
          placeholder="Enter pet name"
          placeholderTextColor="#9CA3AF"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
            style={[styles.input, errors.weight && styles.inputError]}
            value={formData.weight.toString()}
            onChangeText={(value) => {
              setFormData({ ...formData, weight: parseInt(value) });
              setErrors(prev => ({ ...prev, weight: undefined }));
            }}
            placeholder="0.0"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Microchip</Text>
          <TextInput
            style={[styles.input, errors.microchipCode && styles.inputError]}
            value={formData.microchipCode?.toString()}
            onChangeText={(value) => {
              setFormData({ ...formData, microchipCode: parseInt(value) });
              setErrors(prev => ({ ...prev, microchipCode: undefined }));
            }}
            placeholder="Enter code"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
          />
          {errors.microchipCode && <Text style={styles.errorText}>{errors.microchipCode}</Text>}
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
            {petId ? 'Save Changes' : 'Add Pet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#374151',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'transparent',
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
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
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