import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ContactForm from "./forms/ContactForm";
import PetForm from "./forms/PetForm";
import TaskForm from "./forms/TaskForm";
import TreatmentForm from "./forms/TreatmentForm";
import VaccinationForm from "./forms/VaccinationForm";
import VetVisitForm from "./forms/VetVisitForm";
import { IconSymbol } from "./ui/IconSymbol";

function Modal() {
  const router = useRouter();
  const {
    title,
    action,
    screen,
  }: { title: string; action: "create" | "edit"; screen: string } =
    useLocalSearchParams();
  let children;
  switch (screen) {
    case "pet":
      children = <PetForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    case "contact":
      children = <ContactForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    case "vaccination":
      children = <VaccinationForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    case "treatment":
      children = <TreatmentForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    case "vetVisit":
      children = <VetVisitForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    case "task":
      children = <TaskForm onSubmit={() => {}} onCancel={() => {}} />;
      break;
    default:
      children = null;
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

export default Modal;
