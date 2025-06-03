import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TaskItem from '../components/TaskItem';
import { getLaterTasks, getTodaysTasks, getTomorrowsTasks, Task } from '../utils/mockData';

const TaskManager: React.FC = () => {
  const todaysTasks = getTodaysTasks();
  const tomorrowsTasks = getTomorrowsTasks();
  const laterTasks = getLaterTasks();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
        <View style={styles.headerRight}>
          <IconSymbol name="calendar" size={20} color="#0D9488" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        {todaysTasks.length > 0 ? (
          <View style={styles.taskList}>
            {todaysTasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} showPet />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks for today</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tomorrow</Text>
        {tomorrowsTasks.length > 0 ? (
          <View style={styles.taskList}>
            {tomorrowsTasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} showPet />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks for tomorrow</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Later</Text>
        {laterTasks.length > 0 ? (
          <View style={styles.taskList}>
            {laterTasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} showPet />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No upcoming tasks</Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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

export default TaskManager;