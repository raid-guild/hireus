import { useCallback, useState } from 'react';

export const useRefresh = (): [number, () => void] => {
  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = useCallback(() => setRefreshCount(c => c + 1), []);
  return [refreshCount, refresh];
};
