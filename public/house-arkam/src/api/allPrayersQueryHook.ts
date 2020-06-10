import {useState, useEffect} from 'react';
import httpClient from '../util/axios';

export interface PrayerModel {
  id: string;
  name: {
    first: string;
    last: string;
  };
  phone: string;
  reservePrayingTime: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

const useAllPrayersQuery = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PrayerModel[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setLoading(() => true);
      try {
        const result = await httpClient.get('/api/all-prayers');
        setLoading(() => false);
        setData(result.data);
      } catch (error) {
        setError(error);
        setLoading(() => false);
      }
    }
    fetch();
  }, [setData, setLoading, setError]);

  return {
    loading,
    error,
    data,
  };
};

export default useAllPrayersQuery;
