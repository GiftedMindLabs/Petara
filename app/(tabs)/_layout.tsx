import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  
  return (
    <View style={{ flex: 1}}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          //header: () => <CustomHeader />,
        }}
      >
        <Tabs.Screen
          name="index"
          key="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          key="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          key="health"
          options={{
            title: "Health",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="cross.case.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          key="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="dollarsign.circle.fill"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contacts"
          key="contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.2.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          key="profile"
          options={{
            title: "Pet",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
  
}
