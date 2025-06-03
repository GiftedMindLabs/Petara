import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AddButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = new Animated.Value(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const quickActions = [
    {
      label: "Add Task",
      color: "#3B82F6",
      icon: "check-circle",
    },
    {
      label: "Log Vet Visit",
      color: "#22C55E",
      icon: "pets",
    },
    {
      label: "Add Treatment",
      color: "#9333EA",
      icon: "favorite",
    },
    {
      label: "Record Expense",
      color: "#F97316",
      icon: "attach-money",
    },
  ];

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.menuContainer}>
          {quickActions.map((action, index) => {
            const translateY = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });

            const opacity = animation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.3, 1],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: action.color,
                    transform: [{ translateY }],
                    opacity,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionTouchable}
                  onPress={() => {
                    // Handle action
                    toggleMenu();
                  }}
                >
                  {
                    //<MaterialIcons name={action.icon} size={20} color="#FFFFFF" />
                  }
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}
      <TouchableOpacity
        onPress={toggleMenu}
        style={[
          styles.mainButton,
          { backgroundColor: isOpen ? "#EF4444" : "#0D9488" },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons
            name={isOpen ? "close" : "add"}
            size={24}
            color="#FFFFFF"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 16,
    alignItems: "flex-end",
  },
  menuContainer: {
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  actionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
    width: 160,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AddButton;
