import { getBids } from '../graphql/getBids';
import { useCallback, useEffect, useState } from 'react';

export const useBids = (refresh = 0) => {
  const [fetching, setFetching] = useState(true);
  const [contractBids, setContractBids] = useState([]);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      setContractBids(await getBids() || []);
    } catch (fetchError) {
      setContractBids([]);
      setError(fetchError);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  return { fetching, contractBids, error };
};