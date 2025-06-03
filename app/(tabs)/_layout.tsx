import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import CustomHeader from "@/app/components/CustomHeader";
import { HapticTab } from "@/app/components/HapticTab";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import TabBarBackground from "@/app/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          header: () => <CustomHeader />,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
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
      </Tabs>
      <Tabs.Screen
        name="profile"
        key="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        key="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />
    </View>
  );
}
