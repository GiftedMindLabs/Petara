import { IconSymbol } from '@/app/components/ui/IconSymbol';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock contacts data
const contacts = [{
  id: '1',
  name: 'Dr. Johnson',
  type: 'Vet',
  phone: '(555) 123-4567',
  email: 'drjohnson@vetclinic.com',
  address: '123 Animal Care Lane',
  notes: 'Primary veterinarian for Buddy'
}, {
  id: '2',
  name: 'Happy Paws Grooming',
  type: 'Groomer',
  phone: '(555) 987-6543',
  email: 'appointments@happypaws.com',
  address: '456 Fluffy Street',
  notes: 'Ask for Maria - she knows how to handle Whiskers'
}, {
  id: '3',
  name: 'Pet Sitter Sarah',
  type: 'Pet Sitter',
  phone: '(555) 456-7890',
  email: 'sarah@petsitting.com',
  address: '',
  notes: 'Available on weekends and evenings'
}, {
  id: '4',
  name: 'Premium Pet Supplies',
  type: 'Store',
  phone: '(555) 234-5678',
  email: 'info@premiumpet.com',
  address: '789 Market Street',
  notes: 'Members discount card #12345'
}];

const Contacts: React.FC = () => {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <IconSymbol name="person.fill" size={20} color="#0D9488" />
      </View>

      <View style={styles.contactsList}>
        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{contact.type}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactDetails}>
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleCall(contact.phone)}
              >
                <IconSymbol name="phone.fill" size={14} color="#6B7280" />
                <Text style={styles.contactText}>{contact.phone}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleEmail(contact.email)}
              >
                <IconSymbol name="envelope.fill" size={14} color="#6B7280" />
                <Text style={styles.contactText}>{contact.email}</Text>
              </TouchableOpacity>

              {contact.address && (
                <Text style={styles.address}>{contact.address}</Text>
              )}

              {contact.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notes}>{contact.notes}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Contact</Text>
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
  contactsList: {
    gap: 16
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  typeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 4
  },
  typeText: {
    fontSize: 12,
    color: '#4B5563'
  },
  editButton: {
    color: '#0D9488',
    fontSize: 14
  },
  contactDetails: {
    marginTop: 12,
    gap: 8
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  contactText: {
    fontSize: 14,
    color: '#1F2937'
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 22
  },
  notesContainer: {
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6
  },
  notes: {
    fontSize: 14,
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
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default Contacts; 