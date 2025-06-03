import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ContactFormProps {
  contact?: {
    id: string;
    name: string;
    type: 'veterinarian' | 'groomer' | 'sitter' | 'trainer' | 'other';
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type ContactType = 'veterinarian' | 'groomer' | 'sitter' | 'trainer' | 'other';

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    type: contact?.type || 'veterinarian',
    phone: contact?.phone || '',
    email: contact?.email || '',
    address: contact?.address || '',
    notes: contact?.notes || ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formField}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(value: ContactType) => setFormData({ ...formData, type: value })}
            style={styles.picker}
          >
            <Picker.Item label="Veterinarian" value="veterinarian" />
            <Picker.Item label="Groomer" value="groomer" />
            <Picker.Item label="Pet Sitter" value="sitter" />
            <Picker.Item label="Trainer" value="trainer" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => setFormData({ ...formData, phone: value })}
            placeholder="Enter phone"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.formField, styles.flex1]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
            placeholder="Enter email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.address}
          onChangeText={(value) => setFormData({ ...formData, address: value })}
          placeholder="Enter address"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Enter notes"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
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
            {contact ? 'Save Changes' : 'Add Contact'}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
});

export default ContactForm;