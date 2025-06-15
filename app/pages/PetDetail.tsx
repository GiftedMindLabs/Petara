import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TaskItem from '../components/TaskItem';
import { Task } from '../database';
import { usePets } from '../hooks/usePets';
import { useTasks } from '../hooks/useTasks';

const PetDetail: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const pet = pets.find(p => p.id === id);
  const { tasks } = useTasks();
  const petTasks = tasks.filter(task => task.petId === id);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pet not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        {petTasks.length > 0 ? (
          <View style={styles.taskList}>
            {petTasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} showPetInfo={false} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks for {pet.name}</Text>
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
  errorText: {
    color: '#EF4444',
    textAlign: 'center'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8
  },
  taskList: {
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
    padding: 16,
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
  }
});

export default PetDetail;