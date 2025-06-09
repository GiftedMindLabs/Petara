import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Task } from "../database/types";
import { usePets } from "../hooks/usePets";
import { useTasks } from "../hooks/useTasks";

interface TaskItemProps {
  task: Task;
  onComplete?: () => void;
  onPress?: () => void;
  style?: any;
  showOverdueIndicator?: boolean;
  showPetInfo: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onComplete,
  style,
  showOverdueIndicator = false,
  showPetInfo,
}) => {
  const { getPetById } = usePets();
  const { updateTask } = useTasks();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isComplete, setIsComplete] = useState(task.isComplete);

  useEffect(() => {
    if (showPetInfo) {
      getPetById(task.petId).then((loadedPet) => {
        if (loadedPet) setPet(loadedPet);
      });
    }
  }, [task.petId, getPetById, showPetInfo]);

  const getTaskIcon = () => {
    switch (task.type) {
      case "walk":
        return <IconSymbol name="figure.walk" size={16} color="#3B82F6" />;
      case "medication":
        return <IconSymbol name="pill.fill" size={16} color="#9333EA" />;
      case "feeding":
        return <IconSymbol name="fork.knife" size={16} color="#F97316" />;
      case "grooming":
        return <IconSymbol name="scissors" size={16} color="#EC4899" />;
      default:
        return <IconSymbol name="calendar" size={16} color="#6B7280" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleToggleComplete = async () => {
    try {
      const newIsComplete = !isComplete;
      await updateTask(task.id, {
        isComplete: newIsComplete,
        lastCompletedDate: newIsComplete ? new Date().getTime() : undefined
      });
      setIsComplete(newIsComplete);
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert the checkbox state if the update fails
      setIsComplete(!isComplete);
    }
  };

  const shouldShowPet = showPetInfo && pet !== null;
  const isOverdue = showOverdueIndicator && new Date(task.dueDate) < new Date();

  const renderContent = () => (
    <View
      style={[styles.container, style, isOverdue && styles.overdueContainer]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleToggleComplete}
        disabled={task.isComplete}
      >
        <View style={[styles.checkbox, isComplete && styles.checkboxChecked]}>
          {isComplete && <View style={styles.checkmark} />}
        </View>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          {getTaskIcon()}
          <Text
            style={[
              styles.title,
              task.isComplete && styles.completedTitle,
              isOverdue && styles.overdueTitle,
            ]}
          >
            {task.title}
          </Text>
          {task.recurring && (
            <IconSymbol
              name="arrow.clockwise"
              size={14}
              color="#6B7280"
              style={styles.recurringIcon}
            />
          )}
        </View>
        {shouldShowPet && pet && (
          <View style={styles.petContainer}>
            {pet.imageUrl ? (
              <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            ) : (
              <View style={[styles.petImage, styles.placeholderImage]} />
            )}
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        )}
        {task.notes && <Text style={styles.notes}>{task.notes}</Text>}
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.time, isOverdue && styles.overdueTime]}>
          {formatDate(task.dueDate)} at {formatTime(task.dueDate)}
        </Text>
      </View>
    </View>
  );

  return task.isComplete ? (
    renderContent()
  ) : (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/FormModal",
          params: {
            title: "Edit Task",
            action: "edit",
            form: "task",
            id: task.id,
          },
        })
      }
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  overdueContainer: {
    backgroundColor: "#FEF2F2",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 8,
    fontWeight: "500",
    color: "#1F2937",
  },
  completedTitle: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  overdueTitle: {
    color: "#DC2626",
  },
  recurringIcon: {
    marginLeft: 4,
  },
  petContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  petImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  placeholderImage: {
    backgroundColor: "#F3F4F6",
  },
  petName: {
    fontSize: 14,
    color: "#6B7280",
  },
  notes: {
    marginTop: 4,
    fontSize: 12,
    color: "#4B5563",
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 14,
    color: "#6B7280",
  },
  overdueTime: {
    color: "#DC2626",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
});

export default TaskItem;
