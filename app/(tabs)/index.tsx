import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import TaskItem from "../components/TaskItem";
import { Task } from "../database/types";
import { useTasks } from "../hooks/useTasks";

export default function Home() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Filter today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filtered = tasks.filter((task: Task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    });

    setTodaysTasks(filtered);
  }, [tasks]);

  if (tasksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
        </View>
        {todaysTasks.length > 0 ? (
          <View style={styles.contentCard}>
            {todaysTasks.map((task) => (
              <TaskItem key={task.id} task={task} showPetInfo={false} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No tasks today! Time to play 🐶
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Vet Visits</Text>
        </View>
      </View>
    </ScrollView>
  );
}

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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  contentCard: {
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
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
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
  visitItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  visitReason: {
    fontWeight: "500",
    color: "#1F2937",
  },
  visitDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
  },
  bullet: {
    fontSize: 14,
    color: "#6B7280",
    marginHorizontal: 8,
  },
});