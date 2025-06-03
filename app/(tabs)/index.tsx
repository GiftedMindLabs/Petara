import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TaskItem from '../components/TaskItem';
import { getTodaysTasks, getUpcomingVetVisits } from '../utils/mockData';

const Home: React.FC = () => {
  const todaysTasks = getTodaysTasks();
  const upcomingVisits = getUpcomingVetVisits();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <MaterialIcons name="event" size={18} color="#0D9488" />
        </View>
        {todaysTasks.length > 0 ? (
          <View style={styles.contentCard}>
            {todaysTasks.map(task => (
              <TaskItem key={task.id} task={task} showPet />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks today! Time to play 🐶</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Vet Visits</Text>
          <MaterialIcons name="local-hospital" size={18} color="#0D9488" />
        </View>
        {upcomingVisits.length > 0 ? (
          <View style={styles.contentCard}>
            {upcomingVisits.map(visit => (
              <View key={visit.id} style={styles.visitItem}>
                <View>
                  <Text style={styles.visitReason}>{visit.reason}</Text>
                  <View style={styles.visitDetails}>
                    <Text style={styles.detailText}>
                      {new Date(visit.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.detailText}>{visit.vetName}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No upcoming vet visits</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  emptyText: {
    color: '#6B7280'
  },
  visitItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  visitReason: {
    fontWeight: '500',
    color: '#1F2937'
  },
  visitDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280'
  },
  bullet: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8
  }
});

export default Home;