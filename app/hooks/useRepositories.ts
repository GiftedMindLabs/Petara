import { useData } from '../providers/DataProvider';

export function useRepositories() {
  const { repositories } = useData();
  return repositories;
} 