import TreatmentCard from '@/app/components/TreatmentCard';
import AddButton from '@/app/components/ui/AddButton';
import { IconSymbol } from '@/app/components/ui/IconSymbol';
import VaccinationCard from '@/app/components/VaccinationCard';
import VetVisitCard from '@/app/components/VetVisitCard';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePets } from '../hooks/usePets';
import { useTreatments } from '../hooks/useTreatments';
import { useVaccinations } from '../hooks/useVaccinations';
import { useVetVisits } from '../hooks/useVetVisits';
import { useSelectedPet } from '../providers/SelectedPetProvider';

type TabType = 'visits' | 'vaccinations' | 'treatments';

const VetHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('visits');
  const { selectedPetId } = useSelectedPet();
  const { pets } = usePets();
  const { vaccinations, isLoading: isLoadingVaccinations } = useVaccinations();
  const { treatments, isLoading: isLoadingTreatments } = useTreatments();
  const { vetVisits, isLoading: isLoadingVisits, error } = useVetVisits();

  const filteredVisits = useMemo(() => {
    return selectedPetId === 'all' 
      ? vetVisits 
      : vetVisits.filter(visit => visit.petId === selectedPetId);
  }, [vetVisits, selectedPetId]);

  const filteredVaccinations = useMemo(() => {
    return selectedPetId === 'all'
      ? vaccinations
      : vaccinations.filter(vaccination => vaccination.petId === selectedPetId);
  }, [vaccinations, selectedPetId]);

  const filteredTreatments = useMemo(() => {
    return selectedPetId === 'all'
      ? treatments
      : treatments.filter(treatment => treatment.petId === selectedPetId);
  }, [treatments, selectedPetId]);

  if (isLoadingVaccinations || isLoadingTreatments || isLoadingVisits) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          <AddButton
            label="Add Vet Visit"
            onPress={() =>
              router.push({
                pathname: "/FormModal",
                params: {
                  title: "Add",
                  action: "create",
                  form: "vetVisit",
                  petId: selectedPetId === 'all' ? undefined : selectedPetId,
                },
              })
            }
          />
          {filteredVisits.length > 0 ? (
            filteredVisits.map(visit => {
              const pet = pets.find(p => p.id === visit.petId);
              return (
                <VetVisitCard
                  key={visit.id}
                  visit={visit}
                  pet={pet}
                  showPetInfo={selectedPetId === 'all'}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No vet visits found</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'vaccinations' && (
        <View style={styles.contentContainer}>
          <AddButton
            label="Add Vaccination"
            onPress={() =>
              router.push({
                pathname: "/FormModal",
                params: {
                  title: "Add",
                  action: "create",
                  form: "vaccination",
                  petId: selectedPetId === 'all' ? undefined : selectedPetId,
                },
              })
            }
          />
          {filteredVaccinations.length > 0 ? (
            filteredVaccinations.map(vaccination => {
              const pet = pets.find(p => p.id === vaccination.petId);
              return (
                <VaccinationCard
                  key={vaccination.id}
                  vaccination={vaccination}
                  pet={pet}
                  showPetInfo={selectedPetId === 'all'}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No vaccinations found</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'treatments' && (
        <View style={styles.contentContainer}>
          <AddButton
            label="Add Treatment"
            onPress={() =>
              router.push({
                pathname: "/FormModal",
                params: {
                  title: "Add",
                  action: "create",
                  form: "treatment",
                  petId: selectedPetId === 'all' ? undefined : selectedPetId,
                },
              })
            }
          />
          {filteredTreatments.length > 0 ? (
            filteredTreatments.map(treatment => {
              const pet = pets.find(p => p.id === treatment.petId);
              return (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  pet={pet}
                  showPetInfo={selectedPetId === 'all'}
                  onPress={() => {
                    router.push({
                      pathname: "/FormModal",
                      params: {
                        title: "Edit",
                        action: "edit",
                        form: "treatment",
                        petId: selectedPetId === 'all' ? undefined : selectedPetId,
                        id: treatment.id,
                      },
                    });
                  }}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No treatments found</Text>
            </View>
          )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default VetHealth;