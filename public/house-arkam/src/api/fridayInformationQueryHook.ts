import {useState, useEffect} from 'react';
import httpClient from '../util/axios';

export interface FridayInformationModel {
  settings: {
    nextFridayData: string;
    firstPraying: {
      time: string;
      personSpaceLeft: number;
    };
    secondPraying: {
      time: string;
      personSpaceLeft: number;
    };
  };
  prayer: {
    token: string;
    name: {
      first: string;
      last: string;
    };
    phoneNumber: string;
  };
}

const useFridayInformationQuery = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FridayInformationModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setLoading(() => true);
      try {
        const result = await httpClient.get('/api/friday-praying');
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

export default useFridayInformationQuery;
