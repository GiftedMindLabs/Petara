import { AddButton } from '@/app/components/ui/AddButton';
import { IconSymbol } from '@/app/components/ui/IconSymbol';
import { useContacts } from '@/app/hooks/useContacts';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ContactType = 'veterinarian' | 'groomer' | 'sitter' | 'trainer' | 'other';

const Contacts: React.FC = () => {
  const { contacts, isLoading, error, loadContactsByType, loadContacts } = useContacts();
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleTypeFilter = (type: ContactType | null) => {
    setSelectedType(type);
    if (type) {
      loadContactsByType(type);
    } else {
      loadContacts();
    }
  };

  const handleEditContact = (id: string) => {
    router.push({
      pathname: "/FormModal",
      params: {
        title: "Edit",
        action: "edit",
        form: "contact",
        id
      },
    });
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <IconSymbol name="person.fill" size={20} color="#0D9488" />
      </View>

      <AddButton
        label="Add Contact"
        onPress={() =>
          router.push({
            pathname: "/FormModal",
            params: {
              title: "Add",
              action: "create",
              form: "contact",
            },
          })
        }
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedType && styles.filterButtonActive
            ]}
            onPress={() => handleTypeFilter(null)}
          >
            <Text style={[
              styles.filterButtonText,
              !selectedType && styles.filterButtonTextActive
            ]}>All</Text>
          </TouchableOpacity>
          {(['veterinarian', 'groomer', 'sitter', 'trainer', 'other'] as ContactType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive
              ]}
              onPress={() => handleTypeFilter(type)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedType === type && styles.filterButtonTextActive
              ]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
        </View>
      ) : (
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
                <TouchableOpacity onPress={() => handleEditContact(contact.id)}>
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
      )}
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
  filterContainer: {
    marginVertical: 16
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#0D9488'
  },
  filterButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500'
  },
  filterButtonTextActive: {
    color: '#FFFFFF'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center'
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
  }
});

export default Contacts; 