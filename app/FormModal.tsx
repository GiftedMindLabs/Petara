import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContactForm from "./components/forms/ContactForm";
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
      children = (
        <View>
          <Text>Pet Form</Text>
        </View>
      );
      //<PetForm onSubmit={() => {}} onCancel={() => router.back()} />;
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
    borderRadius: 8,
    width: Math.min(Dimensions.get("window").width - 32, 400),
    maxHeight: Dimensions.get("window").height * 0.9,
    marginHorizontal: 16,
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
    padding: 16,
  },
});
