import { useState, useCallback } from 'react';
import { createBudgetService, BudgetSummaryResponse } from '@/utils/budgetService';
import useAxiosHandler from '@/utils/axiosHandler';
import { toast } from '@/components/ui/use-toast';

// Type alias for better naming
type BudgetSummary = BudgetSummaryResponse;

interface UseBudgetSummaryReturn {
  loading: boolean;
  error: string | null;
  summary: BudgetSummary | null;
  getBudgetSummary: (fromDate?: string, toDate?: string) => Promise<void>;
}

const useBudgetSummary = (onLogout?: () => void): UseBudgetSummaryReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const { axiosHandler } = useAxiosHandler();
  const budgetService = createBudgetService(axiosHandler);

  // Helper function to handle API errors
  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    console.error('Budget Summary API Error:', error);
    
    const errorObj = error as Error | { message?: string };
    if (errorObj.message?.includes('401') || errorObj.message?.includes('Unauthorized')) {
      toast({
        title: "Error",
        description: 'Session expired. Please login again.',
        variant: "destructive"
      });
      if (onLogout) onLogout();
      return 'Session expired';
    }
    
    const errorMessage = errorObj.message || defaultMessage;
    setError(errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
    return errorMessage;
  }, [onLogout]);

  // Get budget summary
  const getBudgetSummary = useCallback(async (fromDate?: string, toDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      const summaryData = await budgetService.getBudgetSummary(fromDate, toDate);
      setSummary(summaryData);
    } catch (error: unknown) {
      handleError(error, 'Failed to fetch budget summary');
    } finally {
      setLoading(false);
    }
  }, [budgetService, handleError]);

  return {
    loading,
    error,
    summary,
    getBudgetSummary,
  };
};

export { useBudgetSummary };
export default useBudgetSummary;
export type { BudgetSummary };