import { IconSymbol } from "@/app/components/ui/IconSymbol";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TaskItem from "../components/TaskItem";
import { Task } from "../database/types";
import { useRepositories } from "../hooks/useRepositories";
import { useSelectedPet } from "../providers/SelectedPetProvider";

const TaskManager: React.FC = () => {
  const { taskRepository } = useRepositories();
  const { selectedPetId } = useSelectedPet();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    console.log("Selected pet ID: ", selectedPetId);
    try {
      const [today, upcoming, overdue] = await Promise.all([
        taskRepository.getTodaysTasks(),
        taskRepository.getUpcomingTasks(),
        taskRepository.getOverdueTasks(),
      ]);

      // Filter tasks if a specific pet is selected
      const filterByPet = (tasks: Task[]) =>
        selectedPetId === "all"
          ? tasks
          : tasks.filter((task) => task.petId === selectedPetId);

      setTodaysTasks(filterByPet(today));
      setUpcomingTasks(filterByPet(upcoming));
      setOverdueTasks(filterByPet(overdue));
      setError(null);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    }
  }, [taskRepository, selectedPetId]);

  useEffect(() => {
    loadTasks().finally(() => setIsLoading(false));
  }, [loadTasks]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadTasks();
    setIsRefreshing(false);
  }, [loadTasks]);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await taskRepository.completeTask(taskId);
      await loadTasks(); // Reload tasks after completion
    } catch (err) {
      console.error("Error completing task:", err);
      // You might want to show an error message to the user here
    }
  };

  if (isLoading) {
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
        <View style={styles.headerRight}>
          <IconSymbol name="calendar" size={20} color="#0D9488" />
          <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {overdueTasks.length > 0 && (
        <View style={[styles.section, styles.overdueSection]}>
          <Text style={[styles.sectionTitle, styles.overdueTitle]}>
            Overdue
          </Text>
          <View style={[styles.taskList, styles.overdueTaskList]}>
            {overdueTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showOverdueIndicator
                showPetInfo={selectedPetId === "all"}
                onComplete={() => handleTaskComplete(task.id)}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        {todaysTasks.length > 0 ? (
          <View style={styles.taskList}>
            {todaysTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showPetInfo={selectedPetId === "all"}
                onComplete={() => handleTaskComplete(task.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks for today</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingTasks.length > 0 ? (
          <View style={styles.taskList}>
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showPetInfo={selectedPetId === "all"}
                onComplete={() => handleTaskComplete(task.id)}
              />
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
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  overdueSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  overdueTitle: {
    color: "#DC2626",
  },
  taskList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  overdueTaskList: {
    borderColor: "#FEE2E2",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    color: "#6B7280",
  },
});

export default TaskManager;
