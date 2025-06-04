import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ContactForm from "./components/forms/ContactForm";
import PetForm from "./components/forms/PetForm";
import TaskForm from "./components/forms/TaskForm";
import TreatmentForm from "./components/forms/TreatmentForm";
import VaccinationForm from "./components/forms/VaccinationForm";
import VetVisitForm from "./components/forms/VetVisitForm";
import { IconSymbol } from "./components/ui/IconSymbol";

export default function FormModal() {
  const router = useRouter();
  const { title, action, form } = useLocalSearchParams();
  let children;
  console.log("params:", useLocalSearchParams());
  console.log("form:", form);
  switch (form) {
    case "pet":
      children = <PetForm onSubmit={() => {}} onCancel={() => router.back()} />;
      break;
    case "contact":
      children = (
        <ContactForm onSubmit={() => {}} onCancel={() => router.back()} />
      );
      break;
    case "vaccination":
      children = (
        <VaccinationForm onSubmit={() => {}} onCancel={() => router.back()} />
      );
      break;
    case "treatment":
      children = (
        <TreatmentForm onSubmit={() => {}} onCancel={() => router.back()} />
      );
      break;
    case "vetVisit":
      children = (
        <VetVisitForm onSubmit={() => {}} onCancel={() => router.back()} />
      );
      break;
    case "task":
      children = (
        <TaskForm onSubmit={() => {}} onCancel={() => router.back()} />
      );
      break;
    default:
      children = (
        <View>
          <Text>No form found</Text>
        </View>
      );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <IconSymbol name="xmark" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
