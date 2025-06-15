import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Contact, Pet, VetVisit } from "../database/types";
import { useContacts } from "../hooks/useContacts";
import { IconSymbol } from "./ui/IconSymbol";

interface VetVisitCardProps {
  visit: VetVisit;
  pet?: Pet;
  showPetInfo?: boolean;
}

const VetVisitCard: React.FC<VetVisitCardProps> = ({
  visit,
  pet,
  showPetInfo = false,
}) => {
  const { contacts } = useContacts();
  const [vetContact, setVetContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (visit.contactId) {
      const contact = contacts.find(c => c.id === visit.contactId);
      if (contact) {
        setVetContact(contact);
      }
    }
  }, [visit.contactId, contacts]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/FormModal",
          params: {
            title: "Edit",
            action: "edit",
            form: "vetVisit",
            id: visit.id,
          },
        })
      }
    >
      <View style={styles.content}>
        <View style={styles.details}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.date}>{formatDate(visit.date)}</Text>
            <Text style={styles.time}>{formatTime(visit.date)}</Text>
          </View>
          <Text style={styles.reason}>{visit.reason}</Text>
          {visit.notes && <Text style={styles.notes}>{visit.notes}</Text>}
          <View style={styles.vetInfoContainer}>
            {vetContact && (
              <View style={styles.contactInfo}>
                {vetContact.phone && (
                  <View style={styles.contactDetail}>
                    <IconSymbol name="phone.fill" size={12} color="#6B7280" />
                    <Text style={styles.contactText}>{vetContact.phone}</Text>
                  </View>
                )}
                {vetContact.address && (
                  <View style={styles.contactDetail}>
                    <IconSymbol name="location.fill" size={12} color="#6B7280" />
                    <Text style={styles.contactText}>{vetContact.address}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          {visit.weight && (
            <Text style={styles.weight}>Weight: {visit.weight} lbs</Text>
          )}
        </View>
      </View>
      {showPetInfo && pet && (
        <View style={styles.petInfo}>
          {pet.imageUrl ? (
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
          ) : (
            <View style={[styles.petImage, styles.placeholderImage]} />
          )}
          <Text style={styles.petName}>{pet.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  content: {
  },
  details: {
    flexDirection: "column",
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 8,
  },
  time: {
    fontSize: 14,
    color: '#4B5563',
  },
  reason: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  vet: {
    fontSize: 14,
    color: "#6B7280",
  },
  weight: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholderImage: {
    backgroundColor: "#F3F4F6",
  },
  vetInfoContainer: {
    marginTop: 8,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default VetVisitCard; 