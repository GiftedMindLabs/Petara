import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import "react-native-reanimated";
import { migrateDatabase } from "./database/database";
import { SelectedPetProvider } from "./providers/SelectedPetProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  /*const [isReady, setIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  */
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  /*
  useEffect(() => {
    async function prepare() {
      try {
        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
        }

        if (Platform.OS === 'android') {
          const value = await Notifications.getNotificationChannelsAsync();
          setChannels(value ?? []);
        }

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });

        setIsReady(true);

        return () => {
          notificationListener.remove();
          responseListener.remove();
        };
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Still set ready to true to prevent infinite loading
        setIsReady(true);
      }
    }

    prepare();
  }, []);
*/
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
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
