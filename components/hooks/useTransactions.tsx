import { useState } from 'react';
import useAxiosHandler from '@/utils/axiosHandler';
import { transactionUrl } from '@/utils/network';

// Transaction interfaces based on API response
export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  description: string;
  amount: string;
  category: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  page: number;
  limit: number;
  total_items: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  category?: string;
  from_date?: string;
  to_date?: string;
}

export interface CreateTransactionData {
  account_id: number;
  description: string;
  amount: string;
  category: string;
  transaction_date: string;
}

const useTransactions = () => {
  const { axiosHandler } = useAxiosHandler();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get transactions with filters
  const getTransactions = async (filters: TransactionFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.from_date) queryParams.append('from_date', filters.from_date);
      if (filters.to_date) queryParams.append('to_date', filters.to_date);
      
      const url = `${transactionUrl.list}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await axiosHandler<TransactionListResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch transactions');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to fetch transactions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new transaction
  const createTransaction = async (data: CreateTransactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosHandler<Transaction>({
        method: 'POST',
        url: transactionUrl.create,
        data,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to create transaction');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to create transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get single transaction
  const getTransaction = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = transactionUrl.get.replace(':id', id.toString());
      
      const response = await axiosHandler<Transaction>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch transaction');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to fetch transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update transaction
  const updateTransaction = async (id: number, data: CreateTransactionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = transactionUrl.update.replace(':id', id.toString());
      
      const response = await axiosHandler<Transaction>({
        method: 'PUT',
        url,
        data,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to update transaction');
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to update transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = transactionUrl.delete.replace(':id', id.toString());
      
      const response = await axiosHandler<{ message: string }>({
        method: 'DELETE',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to delete transaction');
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete transaction');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getTransactions,
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;