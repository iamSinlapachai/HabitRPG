import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadInventoryState, loadUserState, saveInventoryState, saveUserState } from '@/src/lib/persistence';
import { getInventorySnapshot, useInventoryStore } from '@/src/lib/store/inventoryStore';
import { getUserSnapshot, useUserStore } from '@/src/lib/store/userStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateStores = async () => {
      try {
        const [user, inventory] = await Promise.all([
          loadUserState(),
          loadInventoryState(),
        ]);

        if (user) {
          useUserStore.getState().hydrate(user);
        }

        if (inventory) {
          useInventoryStore.getState().hydrate(inventory);
        }
      } catch (error) {
        console.error('Failed to hydrate stores', error);
      } finally {
        setIsHydrated(true);
      }
    };

    void hydrateStores();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const unsubscribeUser = useUserStore.subscribe((state) => {
      void saveUserState(getUserSnapshot(state));
    });

    const unsubscribeInventory = useInventoryStore.subscribe((state) => {
      void saveInventoryState(getInventorySnapshot(state));
    });

    return () => {
      unsubscribeUser();
      unsubscribeInventory();
    };
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
