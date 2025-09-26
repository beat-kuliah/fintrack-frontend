import { useState } from 'react';
import useAxiosHandler from '@/utils/axiosHandler';
import { budgetUrl } from '@/utils/network';

// Budget interfaces
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
  totalIncome: number; // Will be calculated from income transactions API
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

const useBudget = (onUnauthorized?: () => void) => {
  const { axiosHandler } = useAxiosHandler(onUnauthorized);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current month budget
  const getCurrentBudget = async (): Promise<MonthlyBudget | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Return dummy data for demonstration
      const dummyCategories: BudgetCategory[] = [
          {
            id: 'cat-1',
            name: 'Makanan & Minuman',
            type: 'needs',
            budgetedAmount: 3500000,
            actualAmount: 3200000,
            color: '#ef4444',
            description: 'Kebutuhan makanan sehari-hari, groceries, dan makan di luar'
          },
          {
            id: 'cat-2',
            name: 'Transportasi',
            type: 'needs',
            budgetedAmount: 1200000,
            actualAmount: 1350000,
            color: '#f97316',
            description: 'Bensin, ojek online, transportasi umum'
          },
          {
            id: 'cat-3',
            name: 'Utilitas',
            type: 'needs',
            budgetedAmount: 800000,
            actualAmount: 750000,
            color: '#eab308',
            description: 'Listrik, air, gas, internet, telepon'
          },
          {
            id: 'cat-4',
            name: 'Hiburan',
            type: 'wants',
            budgetedAmount: 1000000,
            actualAmount: 1200000,
            color: '#22c55e',
            description: 'Nonton bioskop, streaming, games, rekreasi'
          },
          {
            id: 'cat-5',
            name: 'Tabungan',
            type: 'savings',
            budgetedAmount: 4000000,
            actualAmount: 4000000,
            color: '#3b82f6',
            description: 'Dana darurat dan investasi jangka panjang'
          },
          {
            id: 'cat-6',
            name: 'Kesehatan',
            type: 'needs',
            budgetedAmount: 500000,
            actualAmount: 300000,
            color: '#8b5cf6',
            description: 'Obat-obatan, vitamin, check-up kesehatan'
          },
          {
            id: 'cat-7',
            name: 'Belanja',
            type: 'wants',
            budgetedAmount: 1500000,
            actualAmount: 1800000,
            color: '#ec4899',
            description: 'Pakaian, aksesoris, barang elektronik'
          },
          {
            id: 'cat-8',
            name: 'Pendidikan',
            type: 'needs',
            budgetedAmount: 800000,
            actualAmount: 600000,
            color: '#06b6d4',
            description: 'Kursus online, buku, pelatihan'
          },
          {
            id: 'cat-9',
            name: 'Lain-lain',
            type: 'wants',
            budgetedAmount: 700000,
            actualAmount: 850000,
            color: '#84cc16',
            description: 'Pengeluaran tak terduga dan miscellaneous'
          }
      ];
      
      // Calculate total income from categories (in real app, this will come from income transactions API)
      const calculatedTotalIncome = dummyCategories.reduce((sum, cat) => sum + cat.budgetedAmount, 0);
      
      const dummyBudget: MonthlyBudget = {
        id: 'dummy-budget-2024-01',
        month: 'Januari',
        year: 2024,
        totalIncome: calculatedTotalIncome, // In real app: fetch from income transactions API
        categories: dummyCategories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return dummyBudget;
      
      // Original API call (commented out for dummy data)
      /*
      const response = await axiosHandler<MonthlyBudget>({
        method: 'GET',
        url: `${budgetUrl}/current`,
        isAuthorized: true,
      });
      
      if (response.data && !response.error) {
        return response.data;
      } else {
        setError('Failed to fetch current budget');
        return null;
      }
      */
    } catch {
      setError('An error occurred while fetching budget');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get total income from transactions API for specific month
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getMonthlyIncome = async (month: string, year: number): Promise<number> => {
    try {
      // TODO: Implement API call to get income transactions for specific month
      // const response = await axiosHandler<{totalIncome: number}>({
      //   method: 'GET',
      //   url: `/transactions/income/monthly?month=${month}&year=${year}`,
      //   isAuthorized: true,
      // });
      // return response.data?.totalIncome || 0;
      
      // For now, return calculated total from categories as placeholder
      return 0;
    } catch {
      return 0;
    }
  };

  // Create or update monthly budget
  const saveBudget = async (budgetData: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>): Promise<MonthlyBudget | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get actual income from transactions API
      const actualIncome = await getMonthlyIncome(budgetData.month, budgetData.year);
      
      // If no income found, use sum of categories as fallback for demo
      const totalIncome = actualIncome > 0 ? actualIncome : 
        budgetData.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0);
      
      const finalBudgetData = {
        ...budgetData,
        totalIncome
      };
      
      const response = await axiosHandler<MonthlyBudget>({
        method: 'POST',
        url: budgetUrl,
        data: finalBudgetData,
        isAuthorized: true,
      });
      
      if (response.data && !response.error) {
        return response.data;
      } else {
        setError('Failed to save budget');
        return null;
      }
    } catch {
      setError('An error occurred while saving budget');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add or update budget category
  const saveBudgetCategory = async (budgetId: string, category: Omit<BudgetCategory, 'id'>): Promise<BudgetCategory | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosHandler<BudgetCategory>({
        method: 'POST',
        url: `${budgetUrl}/${budgetId}/categories`,
        data: category,
        isAuthorized: true,
      });
      
      if (response.data && !response.error) {
        return response.data;
      } else {
        setError('Failed to save category');
        return null;
      }
    } catch {
      setError('An error occurred while saving category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete budget category
  const deleteBudgetCategory = async (budgetId: string, categoryId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosHandler<void>({
        method: 'DELETE',
        url: `${budgetUrl}/${budgetId}/categories/${categoryId}`,
        isAuthorized: true,
      });
      
      if (!response.error) {
        return true;
      } else {
        setError('Failed to delete category');
        return false;
      }
    } catch {
      setError('An error occurred while deleting category');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get budget summary
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getBudgetSummary = async (budgetId: string): Promise<BudgetSummary | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Return dummy summary data for demonstration
      const dummySummary: BudgetSummary = {
        totalBudgeted: 14000000, // Total budget excluding savings
        totalSpent: 14050000, // Slightly over budget
        totalRemaining: -50000, // Over budget by 50k
        usagePercentage: 100.36, // 100.36% usage
        categoryBreakdown: {
          needs: {
            budgeted: 6800000, // Makanan + Transportasi + Utilitas + Kesehatan + Pendidikan
            spent: 6200000,
            percentage: 91.18
          },
          wants: {
            budgeted: 3200000, // Hiburan + Belanja + Lain-lain
            spent: 3850000,
            percentage: 120.31
          },
          savings: {
            budgeted: 4000000, // Tabungan
            spent: 4000000,
            percentage: 100.0
          }
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return dummySummary;
      
      // Original API call (commented out for dummy data)
      /*
      const response = await axiosHandler<BudgetSummary>({
        method: 'GET',
        url: `${budgetUrl}/${budgetId}/summary`,
        isAuthorized: true,
      });
      
      if (response.data && !response.error) {
        return response.data;
      } else {
        setError('Failed to fetch budget summary');
        return null;
      }
      */
    } catch {
      setError('An error occurred while fetching budget summary');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get budget history
  const getBudgetHistory = async (limit: number = 12): Promise<MonthlyBudget[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosHandler<MonthlyBudget[]>({
        method: 'GET',
        url: `${budgetUrl}/history?limit=${limit}`,
        isAuthorized: true,
      });
      
      if (response.data && !response.error) {
        return response.data;
      } else {
        setError('Failed to fetch budget history');
        return [];
      }
    } catch {
      setError('An error occurred while fetching budget history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCurrentBudget,
    saveBudget,
    saveBudgetCategory,
    deleteBudgetCategory,
    getBudgetSummary,
    getBudgetHistory,
    getMonthlyIncome, // For future income API integration
  };
};

export default useBudget;