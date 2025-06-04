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

  const handleSubmit = async (data: any) => {
    try {
      // The form components now handle the database operations
      router.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    router.back();
  };

  let children;
  console.log("params:", useLocalSearchParams());
  console.log("form:", form);
  switch (form) {
    case "pet":
      children = <PetForm onSubmit={handleSubmit} onCancel={handleCancel} />;
      break;
    case "contact":
      children = (
        <ContactForm onSubmit={handleSubmit} onCancel={handleCancel} />
      );
      break;
    case "vaccination":
      children = (
        <VaccinationForm onSubmit={handleSubmit} onCancel={handleCancel} />
      );
      break;
    case "treatment":
      children = (
        <TreatmentForm onSubmit={handleSubmit} onCancel={handleCancel} />
      );
      break;
    case "vetVisit":
      children = (
        <VetVisitForm onSubmit={handleSubmit} onCancel={handleCancel} />
      );
      break;
    case "task":
      children = (
        <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
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
        <Text style={styles.title}>{title} {form}</Text>
        <TouchableOpacity onPress={handleCancel}>
          <IconSymbol name="xmark" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
