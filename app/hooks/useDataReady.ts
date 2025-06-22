import { useData } from '../providers/DataProvider';

export function useDataReady() {
  const { isReady } = useData();
  return isReady;
} 