import { useState } from 'react';
import useAxiosHandler from '@/utils/axiosHandler';
import { pocketUrl } from '@/utils/network';

// Pocket interfaces based on API response
export interface Account {
  id: number;
  user_id: number;
  name: string;
  account: {
    String: string;
    Valid: boolean;
  };
  amount: string;
  account_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API response is directly an array of accounts
export type ActiveAccountsResponse = Account[];

const usePockets = () => {
  const { axiosHandler } = useAxiosHandler();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get active accounts
  const getActiveAccounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosHandler<ActiveAccountsResponse>({
        method: 'GET',
        url: pocketUrl.active,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch active accounts');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to fetch active accounts');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getActiveAccounts,
  };
};

export default usePockets;