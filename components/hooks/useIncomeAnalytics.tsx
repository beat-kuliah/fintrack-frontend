import { useState } from 'react';
import useAxiosHandler from '@/utils/axiosHandler';
import { incomeAnalyticsUrl } from '@/utils/network';
import { Transaction } from './useTransactions';

// Income Analytics interfaces based on API response
export interface IncomeSummary {
  total_income: string;
  total_transactions: number;
  average_per_day: string;
  average_per_transaction: string;
  period_days: number;
  from_date: string;
  to_date: string;
}

export interface CategorySummary {
  category: string;
  total_amount: string;
  transaction_count: number;
  percentage: string;
}

export interface CategoryBreakdownResponse {
  categories: CategorySummary[];
  from_date: string;
  to_date: string;
}

export interface TrendData {
  period: string;
  total_amount: string;
  transaction_count: number;
}

export interface TrendResponse {
  trends: TrendData[];
  from_date: string;
  to_date: string;
}

export interface RecentTransactionsResponse {
  data: Transaction[];
  limit: number;
  count: number;
}

export interface DateRangeParams {
  from_date: string;
  to_date: string;
}

const useIncomeAnalytics = () => {
  const { axiosHandler } = useAxiosHandler();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get income summary
  const getIncomeSummary = async (params: DateRangeParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        from_date: params.from_date,
        to_date: params.to_date,
      });
      
      const url = `${incomeAnalyticsUrl.summary}?${queryParams.toString()}`;
      
      const response = await axiosHandler<IncomeSummary>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch income summary');
        return null;
      }
      
      return response.data;
    } catch {
      setError('Failed to fetch income summary');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get category breakdown
  const getCategoryBreakdown = async (params: DateRangeParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        from_date: params.from_date,
        to_date: params.to_date,
      });
      
      const url = `${incomeAnalyticsUrl.categoryBreakdown}?${queryParams.toString()}`;
      
      const response = await axiosHandler<CategoryBreakdownResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch category breakdown');
        return null;
      }
      
      return response.data;
    } catch {
      setError('Failed to fetch category breakdown');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get monthly trends
  const getMonthlyTrends = async (params: DateRangeParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        from_date: params.from_date,
        to_date: params.to_date,
      });
      
      const url = `${incomeAnalyticsUrl.monthlyTrend}?${queryParams.toString()}`;
      
      const response = await axiosHandler<TrendResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch monthly trends');
        return null;
      }
      
      return response.data;
    } catch {
      setError('Failed to fetch monthly trends');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get daily trends
  const getDailyTrends = async (params: DateRangeParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        from_date: params.from_date,
        to_date: params.to_date,
      });
      
      const url = `${incomeAnalyticsUrl.dailyTrend}?${queryParams.toString()}`;
      
      const response = await axiosHandler<TrendResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch daily trends');
        return null;
      }
      
      return response.data;
    } catch {
      setError('Failed to fetch daily trends');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get recent transactions
  const getRecentTransactions = async (limit: number = 10, params?: DateRangeParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
      });
      
      // Add date range parameters if provided
      if (params) {
        queryParams.append('from_date', params.from_date);
        queryParams.append('to_date', params.to_date);
      }
      
      const url = `${incomeAnalyticsUrl.recent}?${queryParams.toString()}`;
      
      const response = await axiosHandler<RecentTransactionsResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });
      
      if (response.error) {
        setError('Failed to fetch recent transactions');
        return null;
      }
      
      return response.data;
    } catch {
      setError('Failed to fetch recent transactions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getIncomeSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getDailyTrends,
    getRecentTransactions,
  };
};

export default useIncomeAnalytics;