import { useState, useCallback } from 'react';
import createBudgetService, {
  BudgetRequest,
  BudgetResponse,
  BudgetSummaryResponse,
  BudgetPerformanceResponse,
} from '@/utils/budgetService';
import useAxiosHandler from '@/utils/axiosHandler';

// Extended interfaces for frontend use
export interface BudgetCategory {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings';
  budgetedAmount: number;
  actualAmount: number;
  color: string;
  description?: string;
}

export interface MonthlyBudget {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  usagePercentage: number;
  categoryBreakdown: {
    needs: { budgeted: number; spent: number; percentage: number };
    wants: { budgeted: number; spent: number; percentage: number };
    savings: { budgeted: number; spent: number; percentage: number };
  };
}

const useBudgetAPI = (onUnauthorized?: () => void) => {
  const { axiosHandler } = useAxiosHandler(onUnauthorized);
  const budgetService = createBudgetService(axiosHandler);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert API response to frontend format
  const convertBudgetResponse = (apiResponse: BudgetResponse): BudgetCategory => {
    return {
      id: apiResponse.id.toString(),
      name: apiResponse.category,
      type: 'needs', // Default type, should be determined by category mapping
      budgetedAmount: parseFloat(apiResponse.target_amount),
      actualAmount: parseFloat(apiResponse.spent_amount || '0'),
      color: '#3b82f6', // Default color, should be mapped by category
      description: `Budget untuk kategori ${apiResponse.category}`,
    };
  };

  // Helper function to determine category type based on name
  const getCategoryType = (categoryName: string): 'needs' | 'wants' | 'savings' => {
    const needsCategories = ['food', 'makanan', 'transportation', 'transportasi', 'utilities', 'utilitas', 'healthcare', 'kesehatan', 'education', 'pendidikan'];
    const savingsCategories = ['savings', 'tabungan', 'investment', 'investasi', 'emergency', 'darurat'];
    
    const lowerName = categoryName.toLowerCase();
    
    if (needsCategories.some(need => lowerName.includes(need))) {
      return 'needs';
    } else if (savingsCategories.some(saving => lowerName.includes(saving))) {
      return 'savings';
    } else {
      return 'wants';
    }
  };

  // Helper function to get category color based on type
  const getCategoryColor = (type: 'needs' | 'wants' | 'savings'): string => {
    switch (type) {
      case 'needs': return '#ef4444';
      case 'wants': return '#22c55e';
      case 'savings': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Create a new budget
  const createBudget = useCallback(async (budgetData: BudgetRequest): Promise<BudgetResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.createBudget(budgetData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create budget';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get all budgets
  const getBudgets = useCallback(async (): Promise<BudgetResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgets();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budgets';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get budget by ID
  const getBudgetById = useCallback(async (id: number): Promise<BudgetResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgetById(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Update budget
  const updateBudget = useCallback(async (id: number, budgetData: BudgetRequest): Promise<BudgetResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.updateBudget(id, budgetData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update budget';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Delete budget
  const deleteBudget = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.deleteBudget(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete budget';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get budget summary
  const getBudgetSummary = useCallback(async (fromDate?: string, toDate?: string): Promise<BudgetSummaryResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgetSummary(fromDate, toDate);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget summary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get budget performance
  const getBudgetPerformance = useCallback(async (fromDate?: string, toDate?: string): Promise<BudgetPerformanceResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgetPerformance(fromDate, toDate);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget performance';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get budget categories
  const getBudgetCategories = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgetCategories();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget categories';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Convert multiple budget responses to frontend format
  const convertBudgetsToFrontend = useCallback((budgets: BudgetResponse[]): MonthlyBudget => {
    console.log('🔄 convertBudgetsToFrontend called with:', budgets);
    
    // Initialize default structure
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('id-ID', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    const defaultResult: MonthlyBudget = {
      id: 'current-budget',
      month: currentMonth,
      year: currentYear,
      totalIncome: 0,
      categories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('📋 Default result structure:', defaultResult);
    
    // Check if budgets is valid and has data
    if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
      console.log('⚠️ No budgets data or empty array, returning default');
      return defaultResult;
    }

    console.log('✅ Processing', budgets.length, 'budget items');
    
    // Process budget data
    const categories: BudgetCategory[] = budgets.map((budget, index) => {
      console.log(`📊 Processing budget ${index + 1}:`, budget);
      
      const type = getCategoryType(budget.category);
      const color = getCategoryColor(type);
      
      const processedCategory = {
        id: budget.id.toString(),
        name: budget.category,
        type,
        budgetedAmount: parseFloat(budget.target_amount) || 0,
        actualAmount: parseFloat(budget.spent_amount || '0') || 0,
        color,
        description: `Budget untuk kategori ${budget.category}`,
      };
      
      console.log(`✅ Processed category ${index + 1}:`, processedCategory);
      return processedCategory;
    });

    const totalIncome = categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0);
    
    const finalResult = {
      ...defaultResult,
      totalIncome,
      categories,
    };
    
    console.log('🎯 Final converted result:', finalResult);
    return finalResult;
  }, []);

  // Convert budget summary response to frontend format
  const convertSummaryToFrontend = useCallback((summary: BudgetSummaryResponse): BudgetSummary => {
    const totalBudgeted = parseFloat(summary.total_budget_amount);
    const totalSpent = parseFloat(summary.total_spent_amount);
    const totalRemaining = parseFloat(summary.remaining_amount);
    const usagePercentage = parseFloat(summary.utilization_percentage);

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      usagePercentage,
      categoryBreakdown: {
        needs: { budgeted: 0, spent: 0, percentage: 0 },
        wants: { budgeted: 0, spent: 0, percentage: 0 },
        savings: { budgeted: 0, spent: 0, percentage: 0 },
      },
    };
  }, []);

  return {
    loading,
    error,
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetSummary,
    getBudgetPerformance,
    getBudgetCategories,
    convertBudgetsToFrontend,
    convertSummaryToFrontend,
    convertBudgetResponse,
    getCategoryType,
    getCategoryColor,
  };
};

export default useBudgetAPI;