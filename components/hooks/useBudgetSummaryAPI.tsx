import { useState, useCallback } from 'react';
import createBudgetService, {
  BudgetSummaryResponse,
  BudgetPerformanceResponse,
  BudgetPerformanceItem,
} from '@/utils/budgetService';
import useAxiosHandler from '@/utils/axiosHandler';

// Frontend interfaces for budget summary and performance
export interface BudgetSummaryData {
  totalBudgets: number;
  totalBudgetAmount: number;
  totalSpentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
}

export interface BudgetPerformanceData {
  category: string;
  targetAmount: number;
  spentAmount: number;
  utilizationPercentage: number;
  status: 'under_budget' | 'on_track' | 'warning' | 'over_budget';
  remainingAmount: number;
}

export interface BudgetPerformanceResult {
  performance: BudgetPerformanceData[];
  fromDate: string;
  toDate: string;
  totalCategories: number;
  overBudgetCount: number;
  onTrackCount: number;
  underBudgetCount: number;
}

const useBudgetSummaryAPI = (onUnauthorized?: () => void) => {
  const { axiosHandler } = useAxiosHandler(onUnauthorized);
  const budgetService = createBudgetService(axiosHandler);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to determine status based on utilization percentage
  const getStatusFromUtilization = (utilization: number): 'under_budget' | 'on_track' | 'warning' | 'over_budget' => {
    if (utilization <= 70) return 'under_budget';
    if (utilization <= 85) return 'on_track';
    if (utilization <= 100) return 'warning';
    return 'over_budget';
  };

  // Convert API response to frontend format
  const convertSummaryResponse = (response: BudgetSummaryResponse): BudgetSummaryData => {
    return {
      totalBudgets: response.total_budgets,
      totalBudgetAmount: parseFloat(response.total_budget_amount),
      totalSpentAmount: parseFloat(response.total_spent_amount),
      remainingAmount: parseFloat(response.remaining_amount),
      utilizationPercentage: parseFloat(response.utilization_percentage),
    };
  };

  // Convert performance item to frontend format
  const convertPerformanceItem = (item: BudgetPerformanceItem): BudgetPerformanceData => {
    const targetAmount = parseFloat(item.target_amount);
    const spentAmount = parseFloat(item.spent_amount);
    const utilizationPercentage = parseFloat(item.utilization_percentage);
    const remainingAmount = targetAmount - spentAmount;
    
    return {
      category: item.category,
      targetAmount,
      spentAmount,
      utilizationPercentage,
      status: getStatusFromUtilization(utilizationPercentage),
      remainingAmount,
    };
  };

  // Convert performance response to frontend format
  const convertPerformanceResponse = (response: BudgetPerformanceResponse): BudgetPerformanceResult => {
    const performance = response.performance.map(convertPerformanceItem);
    
    // Calculate statistics
    const totalCategories = performance.length;
    const overBudgetCount = performance.filter(p => p.status === 'over_budget').length;
    const onTrackCount = performance.filter(p => p.status === 'on_track').length;
    const underBudgetCount = performance.filter(p => p.status === 'under_budget').length;
    
    return {
      performance,
      fromDate: response.from_date,
      toDate: response.to_date,
      totalCategories,
      overBudgetCount,
      onTrackCount,
      underBudgetCount,
    };
  };

  // Get budget summary
  const fetchBudgetSummary = useCallback(async (
    fromDate?: string,
    toDate?: string
  ): Promise<BudgetSummaryData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await budgetService.getBudgetSummary(fromDate, toDate);
      if (response) {
        return convertSummaryResponse(response);
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget summary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get budget performance
  const fetchBudgetPerformance = useCallback(async (
    fromDate?: string,
    toDate?: string
  ): Promise<BudgetPerformanceResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await budgetService.getBudgetPerformance(fromDate, toDate);
      if (response) {
        return convertPerformanceResponse(response);
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget performance';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current month budget summary
  const fetchCurrentMonthSummary = useCallback(async (): Promise<BudgetSummaryData | null> => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    const fromDate = `${year}-${month}-01`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    
    return await fetchBudgetSummary(fromDate, toDate);
  }, []);

  // Get current month budget performance
  const fetchCurrentMonthPerformance = useCallback(async (): Promise<BudgetPerformanceResult | null> => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    const fromDate = `${year}-${month}-01`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    
    return await fetchBudgetPerformance(fromDate, toDate);
  }, []);

  // Get budget summary for specific month
  const fetchMonthlyBudgetSummary = useCallback(async (
    year: number,
    month: number
  ): Promise<BudgetSummaryData | null> => {
    const monthStr = String(month).padStart(2, '0');
    const fromDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;
    
    return await fetchBudgetSummary(fromDate, toDate);
  }, []);

  // Get budget performance for specific month
  const fetchMonthlyBudgetPerformance = useCallback(async (
    year: number,
    month: number
  ): Promise<BudgetPerformanceResult | null> => {
    const monthStr = String(month).padStart(2, '0');
    const fromDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;
    
    return await fetchBudgetPerformance(fromDate, toDate);
  }, []);

  // Get budget performance statistics
  const getBudgetStatistics = useCallback((performance: BudgetPerformanceData[]) => {
    const totalCategories = performance.length;
    const totalBudget = performance.reduce((sum, p) => sum + p.targetAmount, 0);
    const totalSpent = performance.reduce((sum, p) => sum + p.spentAmount, 0);
    const totalRemaining = performance.reduce((sum, p) => sum + p.remainingAmount, 0);
    
    const overBudgetCategories = performance.filter(p => p.status === 'over_budget');
    const warningCategories = performance.filter(p => p.status === 'warning');
    const onTrackCategories = performance.filter(p => p.status === 'on_track');
    const underBudgetCategories = performance.filter(p => p.status === 'under_budget');
    
    return {
      totalCategories,
      totalBudget,
      totalSpent,
      totalRemaining,
      overallUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      categoryCounts: {
        overBudget: overBudgetCategories.length,
        warning: warningCategories.length,
        onTrack: onTrackCategories.length,
        underBudget: underBudgetCategories.length,
      },
      categoryPercentages: {
        overBudget: totalCategories > 0 ? (overBudgetCategories.length / totalCategories) * 100 : 0,
        warning: totalCategories > 0 ? (warningCategories.length / totalCategories) * 100 : 0,
        onTrack: totalCategories > 0 ? (onTrackCategories.length / totalCategories) * 100 : 0,
        underBudget: totalCategories > 0 ? (underBudgetCategories.length / totalCategories) * 100 : 0,
      },
    };
  }, []);

  return {
    loading,
    error,
    fetchBudgetSummary,
    fetchBudgetPerformance,
    fetchCurrentMonthSummary,
    fetchCurrentMonthPerformance,
    fetchMonthlyBudgetSummary,
    fetchMonthlyBudgetPerformance,
    getBudgetStatistics,
    convertSummaryResponse,
    convertPerformanceResponse,
    getStatusFromUtilization,
  };
};

export default useBudgetSummaryAPI;