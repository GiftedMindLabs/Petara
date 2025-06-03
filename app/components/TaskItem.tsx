import { IconSymbol } from '@/app/components/ui/IconSymbol';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Task, pets } from '../utils/mockData';

interface TaskItemProps {
  task: Task;
  showPet?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  showPet = false
}) => {
  const pet = pets.find(p => p.id === task.petId);

  const getTaskIcon = () => {
    switch (task.type) {
      case 'walk':
        return <IconSymbol name="figure.walk" size={16} color="#3B82F6" />;
      case 'medication':
        return <IconSymbol name="pill.fill" size={16} color="#9333EA" />;
      case 'feeding':
        return <IconSymbol name="fork.knife" size={16} color="#F97316" />;
      case 'grooming':
        return <IconSymbol name="scissors" size={16} color="#EC4899" />;
      default:
        return <IconSymbol name="calendar" size={16} color="#6B7280" />;
    }
  };

  const taskTime = new Date(task.dueDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        {task.isComplete ? 
          <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" /> : 
          <IconSymbol name="circle" size={20} color="#D1D5DB" />
        }
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          {getTaskIcon()}
          <Text style={styles.title}>{task.title}</Text>
        </View>
        {showPet && pet && (
          <View style={styles.petContainer}>
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        )}
        {task.notes && <Text style={styles.notes}>{task.notes}</Text>}
      </View>
      <Text style={styles.time}>{taskTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  checkboxContainer: {
    marginRight: 12
  },
  contentContainer: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#1F2937'
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  petImage: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  petName: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280'
  },
  notes: {
    marginTop: 4,
    fontSize: 12,
    color: '#4B5563'
  },
  time: {
    fontSize: 14,
    color: '#6B7280'
  }
});

export default TaskItem;