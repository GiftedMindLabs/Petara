import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView } from "react-native";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";
import { registerForPushNotificationsAsync } from "./notifications";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDark, theme } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <SQLiteProvider 
        databaseName="petara.db" 
        onInit={migrateDatabase}
        options={{
          enableChangeListener: true
        }}
      >
        <SelectedPetProvider>
          <Stack 
            screenOptions={{
              contentStyle: { backgroundColor: theme.background },
              headerStyle: { backgroundColor: theme.surface },
              headerTintColor: theme.text,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="FormModal"
              options={{ headerShown: false, presentation: "modal" }}
            />
          </Stack>
          <StatusBar style={isDark ? "light" : "dark"} />
        </SelectedPetProvider>
      </SQLiteProvider>
    </SafeAreaView>
  );
}
