import useAxiosHandler from '@/utils/axiosHandler';
import { budgetUrl } from '@/utils/network';

// Budget API Types
export interface BudgetRequest {
  category: string;
  target_amount: string;
  period_type: string;
  period_start: string;
  period_end: string;
  is_active?: boolean;
}

export interface BudgetResponse {
  id: number;
  user_id: number;
  category: string;
  target_amount: string;
  period_type: string;
  period_start: string;
  period_end: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  spent_amount?: string;
  remaining_amount?: string;
  utilization_percentage?: number;
  transaction_count?: number;
  status?: string;
}

export interface BudgetListResponse {
  budgets: BudgetResponse[];
}

export interface BudgetSummaryResponse {
  total_budgets: number;
  total_budget_amount: string;
  total_spent_amount: string;
  remaining_amount: string;
  utilization_percentage: string;
}

export interface BudgetPerformanceItem {
  category: string;
  target_amount: string;
  spent_amount: string;
  utilization_percentage: string;
  status: string;
}

export interface BudgetPerformanceResponse {
  performance: BudgetPerformanceItem[];
  from_date: string;
  to_date: string;
}

export interface BudgetCategoriesResponse {
  categories: string[];
}

export interface DeleteBudgetResponse {
  message: string;
}

// Budget Service Class
class BudgetService {
  private axiosHandler: ReturnType<typeof useAxiosHandler>['axiosHandler'];

  constructor(axiosHandler: ReturnType<typeof useAxiosHandler>['axiosHandler']) {
    this.axiosHandler = axiosHandler;
  }

  // 25. POST /budgets - Create a new budget
  async createBudget(budgetData: BudgetRequest): Promise<BudgetResponse | null> {
    try {
      const response = await this.axiosHandler<BudgetResponse>({
        method: 'POST',
        url: budgetUrl.create,
        data: budgetData,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data;
      } else {
        throw new Error('Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  // 26. GET /budgets - Get user budgets with spending data
  async getBudgets(): Promise<BudgetResponse[]> {
    try {
      const response = await this.axiosHandler<BudgetListResponse>({
        method: 'GET',
        url: budgetUrl.list,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data.budgets;
      } else {
        throw new Error('Failed to fetch budgets');
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  // 27. GET /budgets/:id - Get specific budget with spending data
  async getBudgetById(id: number): Promise<BudgetResponse | null> {
    try {
      const response = await this.axiosHandler<BudgetResponse>({
        method: 'GET',
        url: `${budgetUrl.get}/${id}`,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data;
      } else {
        throw new Error('Failed to fetch budget');
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw error;
    }
  }

  // 28. PUT /budgets/:id - Update budget
  async updateBudget(id: number, budgetData: BudgetRequest): Promise<BudgetResponse | null> {
    try {
      const response = await this.axiosHandler<BudgetResponse>({
        method: 'PUT',
        url: `${budgetUrl.update}/${id}`,
        data: budgetData,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data;
      } else {
        throw new Error('Failed to update budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  // 29. DELETE /budgets/:id - Delete budget (soft delete)
  async deleteBudget(id: number): Promise<boolean> {
    try {
      const response = await this.axiosHandler<DeleteBudgetResponse>({
        method: 'DELETE',
        url: `${budgetUrl.delete}/${id}`,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return true;
      } else {
        throw new Error('Failed to delete budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  // 30. GET /budgets/summary - Get budget overview
  async getBudgetSummary(fromDate?: string, toDate?: string): Promise<BudgetSummaryResponse | null> {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      
      const queryString = params.toString();
      const url = queryString ? `${budgetUrl.summary}?${queryString}` : `${budgetUrl.summary}`;

      const response = await this.axiosHandler<BudgetSummaryResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data;
      } else {
        throw new Error('Failed to fetch budget summary');
      }
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  // 31. GET /budgets/performance - Get budget performance by category
  async getBudgetPerformance(fromDate?: string, toDate?: string): Promise<BudgetPerformanceResponse | null> {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      
      const queryString = params.toString();
      const url = queryString ? `${budgetUrl.performance}?${queryString}` : `${budgetUrl.performance}`;

      const response = await this.axiosHandler<BudgetPerformanceResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data;
      } else {
        throw new Error('Failed to fetch budget performance');
      }
    } catch (error) {
      console.error('Error fetching budget performance:', error);
      throw error;
    }
  }

  // 32. GET /budgets/categories - Get user's budget categories
  async getBudgetCategories(periodStart?: string, periodEnd?: string): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      if (periodStart) params.append('period_start', periodStart);
      if (periodEnd) params.append('period_end', periodEnd);
      
      const queryString = params.toString();
      const url = queryString ? `${budgetUrl.categories}?${queryString}` : `${budgetUrl.categories}`;

      console.log('🔗 Calling budget categories API:', url);
      console.log('📅 Period parameters:', { periodStart, periodEnd });

      const response = await this.axiosHandler<BudgetCategoriesResponse>({
        method: 'GET',
        url,
        isAuthorized: true,
      });

      if (response.data && !response.error) {
        return response.data.categories;
      } else {
        throw new Error('Failed to fetch budget categories');
      }
    } catch (error) {
      console.error('Error fetching budget categories:', error);
      throw error;
    }
  }
}

// Export factory function to create service with axiosHandler
export const createBudgetService = (axiosHandler: ReturnType<typeof useAxiosHandler>['axiosHandler']) => {
  return new BudgetService(axiosHandler);
};

export default createBudgetService;