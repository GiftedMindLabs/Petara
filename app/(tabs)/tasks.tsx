import AddButton from "@/app/components/ui/AddButton";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import UndoDialog from "@/app/components/ui/UndoDialog";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import TaskItem from "../components/TaskItem";
import { Task } from "../database/types";
import { useTasks } from "../hooks/useTasks";
import { useSelectedPet } from "../providers/SelectedPetProvider";

const TaskManager: React.FC = () => {
  const { selectedPetId } = useSelectedPet();
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [showUndoDialog, setShowUndoDialog] = useState(false);

  const {
    tasks,
    isLoading,
    error,
    completeTask,
    undoTaskCompletion,
  } = useTasks();

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, selectedPetId]);

  const filterAndSortTasks = useCallback(() => {
    if (!tasks.length) {
      setTodaysTasks([]);
      setUpcomingTasks([]);
      setOverdueTasks([]);
      return;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const filteredTasks = selectedPetId === "all" ? tasks : tasks.filter(task => task.petId === selectedPetId);

    // Helper function to get the effective due date for a task
    const getEffectiveDueDate = (task: Task) => {
      if (task.recurring && task.nextDueDate) {
        return task.nextDueDate;
      }
      return task.dueDate;
    };

    const overdue = filteredTasks.filter(task => {
      if (task.isComplete) return false;
      const effectiveDueDate = getEffectiveDueDate(task);
      return effectiveDueDate < startOfToday;
    });

    const todayList = filteredTasks.filter(task => {
      if (task.isComplete) return false;
      const effectiveDueDate = getEffectiveDueDate(task);
      return effectiveDueDate >= startOfToday && effectiveDueDate <= endOfToday;
    });

    const upcoming = filteredTasks.filter(task => {
      if (task.isComplete) return false;
      const effectiveDueDate = getEffectiveDueDate(task);
      return effectiveDueDate > endOfToday;
    });

    // Sort tasks by their effective due date
    const sortByEffectiveDueDate = (a: Task, b: Task) => {
      const dateA = getEffectiveDueDate(a);
      const dateB = getEffectiveDueDate(b);
      return dateA - dateB;
    };

    setOverdueTasks(overdue.sort(sortByEffectiveDueDate));
    setTodaysTasks(todayList.sort(sortByEffectiveDueDate));
    setUpcomingTasks(upcoming.sort(sortByEffectiveDueDate));
  }, [tasks, selectedPetId]);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      setCompletedTaskId(taskId);
      setShowUndoDialog(true);
    } catch (err) {
      console.error('Error completing task:', err);
      Alert.alert('Error', 'Failed to complete task. Please try again.');
    }
  };

  const handleUndo = async () => {
    if (completedTaskId) {
      try {
        await undoTaskCompletion(completedTaskId);
      } catch (err) {
        console.error('Error undoing task completion:', err);
        Alert.alert('Error', 'Failed to undo task completion. Please try again.');
      }
    }
    setShowUndoDialog(false);
    setCompletedTaskId(null);
  };

  const handleDismissUndo = () => {
    setShowUndoDialog(false);
    setCompletedTaskId(null);
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
    <>
      <UndoDialog
        message="Task marked as complete"
        onUndo={handleUndo}
        onDismiss={handleDismissUndo}
        isVisible={showUndoDialog}
      />
      <ScrollView
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Task Manager</Text>
          <View style={styles.headerRight}>
            <IconSymbol name="calendar" size={20} color="#0D9488" />
            <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <AddButton
          label="Add Task"
          onPress={() =>
            router.push({
              pathname: "/FormModal",
              params: {
                title: "Add",
                action: "create",
                form: "task",
              },
            })
          }
        />
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
    </>
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
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
  },
  clearButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  clearButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#DC2626",
  },
  clearButtonTextDisabled: {
    color: "#9CA3AF",
  },
});

export default TaskManager;
