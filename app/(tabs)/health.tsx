import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { pets, treatments, Vaccination, vaccinations, vetVisits } from '../utils/mockData';

type TabType = 'visits' | 'vaccinations' | 'treatments';

const VetHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('visits');
  const [selectedPetId, setSelectedPetId] = useState<string>('all');

  const filteredVisits = selectedPetId === 'all' 
    ? vetVisits 
    : vetVisits.filter(visit => visit.petId === selectedPetId);

  const filteredVaccinations = selectedPetId === 'all'
    ? vaccinations
    : vaccinations.filter((vacc: Vaccination) => vacc.petId === selectedPetId);

  const filteredTreatments = selectedPetId === 'all'
    ? treatments
    : treatments.filter(treat => treat.petId === selectedPetId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Records</Text>
        <IconSymbol name="cross.case.fill" size={20} color="#0D9488" />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => setActiveTab('visits')}
          style={[
            styles.tabButton,
            activeTab === 'visits' && styles.activeTab
          ]}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'visits' && styles.activeTabText
          ]}>Visits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('vaccinations')}
          style={[
            styles.tabButton,
            activeTab === 'vaccinations' && styles.activeTab
          ]}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'vaccinations' && styles.activeTabText
          ]}>Vaccinations</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('treatments')}
          style={[
            styles.tabButton,
            activeTab === 'treatments' && styles.activeTab
          ]}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'treatments' && styles.activeTabText
          ]}>Treatments</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'visits' && (
        <View style={styles.contentContainer}>
          {filteredVisits.map(visit => {
            const pet = pets.find(p => p.id === visit.petId);
            return (
              <View key={visit.id} style={styles.card}>
                {selectedPetId === 'all' && (
                  <View style={styles.petInfo}>
                    <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                    <Text style={styles.petName}>
                      {pet?.name}
                    </Text>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{visit.reason}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(visit.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.notes}>{visit.notes}</Text>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>{visit.vetName}</Text>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.footerText}>{visit.weight} lbs</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {activeTab === 'vaccinations' && (
        <View style={styles.contentContainer}>
          {filteredVaccinations.map(vaccination => {
            const pet = pets.find(p => p.id === vaccination.petId);
            return (
              <View key={vaccination.id} style={styles.card}>
                {selectedPetId === 'all' && (
                  <View style={styles.petInfo}>
                    <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                    <Text style={styles.petName}>
                      {pet?.name}
                    </Text>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <View style={styles.titleContainer}>
                    <IconSymbol name="syringe.fill" size={16} color="#0D9488" />
                    <Text style={styles.cardTitle}>
                      {vaccination.name}
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Text style={styles.timestamp}>
                      Given: {new Date(vaccination.dateGiven).toLocaleDateString()}
                    </Text>
                    <Text style={styles.timestamp}>
                      Due: {new Date(vaccination.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.notes}>
                  Administered by: {vaccination.administeredBy}
                </Text>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Lot #: {vaccination.lotNumber}</Text>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.footerText}>Manufacturer: {vaccination.manufacturer}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {activeTab === 'treatments' && (
        <View style={styles.contentContainer}>
          {filteredTreatments.map(treatment => {
            const pet = pets.find(p => p.id === treatment.petId);
            return (
              <View key={treatment.id} style={styles.card}>
                {selectedPetId === 'all' && (
                  <View style={styles.petInfo}>
                    <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                    <Text style={styles.petName}>
                      {pet?.name}
                    </Text>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <View style={styles.titleContainer}>
                    <IconSymbol name="pill.fill" size={16} color="#0D9488" />
                    <Text style={styles.cardTitle}>
                      {treatment.name}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    treatment.status === 'ongoing' ? styles.statusOngoing :
                    treatment.status === 'completed' ? styles.statusCompleted :
                    styles.statusPending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      treatment.status === 'ongoing' ? styles.statusOngoingText :
                      treatment.status === 'completed' ? styles.statusCompletedText :
                      styles.statusPendingText
                    ]}>
                      {treatment.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.notes}>
                  {treatment.dosage}, {treatment.frequency}
                </Text>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Started: {new Date(treatment.startDate).toLocaleDateString()}
                  </Text>
                  {treatment.endDate && (
                    <>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.footerText}>
                        Ended: {new Date(treatment.endDate).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.buttonText}>
          Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
  },
  activeTab: {
    backgroundColor: '#E8FFF8'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563'
  },
  activeTabText: {
    color: '#0D9488'
  },
  contentContainer: {
    gap: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8
  },
  petName: {
    fontWeight: '500',
    color: '#1F2937'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  },
  dateContainer: {
    alignItems: 'flex-end'
  },
  timestamp: {
    fontSize: 14,
    color: '#6B7280'
  },
  notes: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280'
  },
  bullet: {
    fontSize: 12,
    color: '#6B7280',
    marginHorizontal: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999
  },
  statusOngoing: {
    backgroundColor: '#DBEAFE'
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7'
  },
  statusPending: {
    backgroundColor: '#FEF3C7'
  },
  statusText: {
    fontSize: 12
  },
  statusOngoingText: {
    color: '#1E40AF'
  },
  statusCompletedText: {
    color: '#166534'
  },
  statusPendingText: {
    color: '#92400E'
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
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default VetHealth;