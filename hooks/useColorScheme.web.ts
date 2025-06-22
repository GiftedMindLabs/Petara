import { useCallback, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  const handleHydration = useCallback(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    handleHydration();
  }, [handleHydration]);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
