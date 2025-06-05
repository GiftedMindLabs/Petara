import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet, Task } from "../database/types";
import { usePets } from "../hooks/usePets";

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
  const [pet, setPet] = useState<Pet | null>(null);

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

  const taskTime = new Date(task.dueDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const shouldShowPet = showPetInfo && pet !== null;
  const isOverdue = showOverdueIndicator && new Date(task.dueDate) < new Date();

  const renderContent = () => (
    <View
      style={[styles.container, style, isOverdue && styles.overdueContainer]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onComplete}
        disabled={task.isComplete}
      >
        {task.isComplete ? (
          <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" />
        ) : (
          <IconSymbol name="circle" size={20} color="#D1D5DB" />
        )}
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
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        )}
        {task.notes && <Text style={styles.notes}>{task.notes}</Text>}
      </View>
      <Text style={[styles.time, isOverdue && styles.overdueTime]}>
        {taskTime}
      </Text>
    </View>
  );

  return (
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  overdueContainer: {
    backgroundColor: "#FEF2F2",
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
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
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  petName: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  notes: {
    marginTop: 4,
    fontSize: 12,
    color: "#4B5563",
  },
  time: {
    fontSize: 14,
    color: "#6B7280",
  },
  overdueTime: {
    color: "#DC2626",
  },
});

export default TaskItem;
