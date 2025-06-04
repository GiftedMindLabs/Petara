import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";

interface AddButtonProps {
  onPress: () => void;
  label: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress, label }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <IconSymbol name="plus" size={20} color="#FFFFFF" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D9488",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
}); 