import { useState, useCallback, useEffect } from 'react';
import createBudgetService from '@/utils/budgetService';
import useAxiosHandler from '@/utils/axiosHandler';

// Category configuration with predefined types and colors
export interface CategoryConfig {
  name: string;
  type: 'needs' | 'wants' | 'savings';
  color: string;
  icon?: string;
  description?: string;
}

// Default category configurations
const DEFAULT_CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'Food': {
    name: 'Food',
    type: 'needs',
    color: '#ef4444',
    icon: '🍽️',
    description: 'Makanan dan minuman sehari-hari'
  },
  'Makanan': {
    name: 'Makanan',
    type: 'needs',
    color: '#ef4444',
    icon: '🍽️',
    description: 'Makanan dan minuman sehari-hari'
  },
  'Transportation': {
    name: 'Transportation',
    type: 'needs',
    color: '#f97316',
    icon: '🚗',
    description: 'Transportasi dan perjalanan'
  },
  'Transportasi': {
    name: 'Transportasi',
    type: 'needs',
    color: '#f97316',
    icon: '🚗',
    description: 'Transportasi dan perjalanan'
  },
  'Utilities': {
    name: 'Utilities',
    type: 'needs',
    color: '#eab308',
    icon: '⚡',
    description: 'Listrik, air, gas, internet'
  },
  'Utilitas': {
    name: 'Utilitas',
    type: 'needs',
    color: '#eab308',
    icon: '⚡',
    description: 'Listrik, air, gas, internet'
  },
  'Healthcare': {
    name: 'Healthcare',
    type: 'needs',
    color: '#8b5cf6',
    icon: '🏥',
    description: 'Kesehatan dan obat-obatan'
  },
  'Kesehatan': {
    name: 'Kesehatan',
    type: 'needs',
    color: '#8b5cf6',
    icon: '🏥',
    description: 'Kesehatan dan obat-obatan'
  },
  'Education': {
    name: 'Education',
    type: 'needs',
    color: '#06b6d4',
    icon: '📚',
    description: 'Pendidikan dan pelatihan'
  },
  'Pendidikan': {
    name: 'Pendidikan',
    type: 'needs',
    color: '#06b6d4',
    icon: '📚',
    description: 'Pendidikan dan pelatihan'
  },
  'Entertainment': {
    name: 'Entertainment',
    type: 'wants',
    color: '#22c55e',
    icon: '🎬',
    description: 'Hiburan dan rekreasi'
  },
  'Hiburan': {
    name: 'Hiburan',
    type: 'wants',
    color: '#22c55e',
    icon: '🎬',
    description: 'Hiburan dan rekreasi'
  },
  'Shopping': {
    name: 'Shopping',
    type: 'wants',
    color: '#ec4899',
    icon: '🛍️',
    description: 'Belanja dan fashion'
  },
  'Belanja': {
    name: 'Belanja',
    type: 'wants',
    color: '#ec4899',
    icon: '🛍️',
    description: 'Belanja dan fashion'
  },
  'Miscellaneous': {
    name: 'Miscellaneous',
    type: 'wants',
    color: '#84cc16',
    icon: '📦',
    description: 'Lain-lain'
  },
  'Lain-lain': {
    name: 'Lain-lain',
    type: 'wants',
    color: '#84cc16',
    icon: '📦',
    description: 'Pengeluaran lain-lain'
  },
  'Savings': {
    name: 'Savings',
    type: 'savings',
    color: '#3b82f6',
    icon: '💰',
    description: 'Tabungan dan investasi'
  },
  'Tabungan': {
    name: 'Tabungan',
    type: 'savings',
    color: '#3b82f6',
    icon: '💰',
    description: 'Tabungan dan investasi'
  },
  'Investment': {
    name: 'Investment',
    type: 'savings',
    color: '#1d4ed8',
    icon: '📈',
    description: 'Investasi jangka panjang'
  },
  'Investasi': {
    name: 'Investasi',
    type: 'savings',
    color: '#1d4ed8',
    icon: '📈',
    description: 'Investasi jangka panjang'
  }
};

const useBudgetCategories = (onUnauthorized?: () => void) => {
  const { axiosHandler } = useAxiosHandler(onUnauthorized);
  const budgetService = createBudgetService(axiosHandler);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryConfigs, setCategoryConfigs] = useState<Record<string, CategoryConfig>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get category configuration
  const getCategoryConfig = useCallback((categoryName: string): CategoryConfig => {
    // Check if we have a predefined config
    if (DEFAULT_CATEGORY_CONFIGS[categoryName]) {
      return DEFAULT_CATEGORY_CONFIGS[categoryName];
    }

    // Check custom configs
    if (categoryConfigs[categoryName]) {
      return categoryConfigs[categoryName];
    }

    // Generate default config based on category name
    const lowerName = categoryName.toLowerCase();
    let type: 'needs' | 'wants' | 'savings' = 'wants';
    let color = '#6b7280';
    const icon = '📋';

    // Determine type based on keywords
    if (lowerName.includes('food') || lowerName.includes('makanan') ||
        lowerName.includes('transport') || lowerName.includes('utilities') ||
        lowerName.includes('health') || lowerName.includes('kesehatan') ||
        lowerName.includes('education') || lowerName.includes('pendidikan')) {
      type = 'needs';
      color = '#ef4444';
    } else if (lowerName.includes('saving') || lowerName.includes('tabungan') ||
               lowerName.includes('investment') || lowerName.includes('investasi')) {
      type = 'savings';
      color = '#3b82f6';
    } else {
      type = 'wants';
      color = '#22c55e';
    }

    return {
      name: categoryName,
      type,
      color,
      icon,
      description: `Budget untuk kategori ${categoryName}`
    };
  }, [categoryConfigs]);

  // Fetch budget categories from API
  const fetchBudgetCategories = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await budgetService.getBudgetCategories();
      setCategories(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget categories';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [budgetService]);

  // Get categories with their configurations
  const getCategoriesWithConfig = useCallback((): CategoryConfig[] => {
    return categories.map(categoryName => getCategoryConfig(categoryName));
  }, [categories, getCategoryConfig]);

  // Get categories by type
  const getCategoriesByType = useCallback((type: 'needs' | 'wants' | 'savings'): CategoryConfig[] => {
    return getCategoriesWithConfig().filter(config => config.type === type);
  }, [getCategoriesWithConfig]);

  // Get category statistics
  const getCategoryStatistics = useCallback(() => {
    const configs = getCategoriesWithConfig();
    const total = configs.length;
    const needs = configs.filter(c => c.type === 'needs').length;
    const wants = configs.filter(c => c.type === 'wants').length;
    const savings = configs.filter(c => c.type === 'savings').length;

    return {
      total,
      needs,
      wants,
      savings,
      percentages: {
        needs: total > 0 ? (needs / total) * 100 : 0,
        wants: total > 0 ? (wants / total) * 100 : 0,
        savings: total > 0 ? (savings / total) * 100 : 0,
      }
    };
  }, [getCategoriesWithConfig]);

  // Update category configuration
  const updateCategoryConfig = useCallback((categoryName: string, config: Partial<CategoryConfig>) => {
    setCategoryConfigs(prev => ({
      ...prev,
      [categoryName]: {
        ...getCategoryConfig(categoryName),
        ...config,
        name: categoryName // Ensure name stays consistent
      }
    }));
  }, [getCategoryConfig]);

  // Get suggested categories based on common budget categories
  const getSuggestedCategories = useCallback((): string[] => {
    const commonCategories = [
      'Makanan & Minuman',
      'Transportasi',
      'Utilitas',
      'Kesehatan',
      'Pendidikan',
      'Hiburan',
      'Belanja',
      'Tabungan',
      'Investasi',
      'Lain-lain'
    ];

    // Filter out categories that are already in use
    return commonCategories.filter(cat => !categories.includes(cat));
  }, [categories]);

  // Check if category exists
  const categoryExists = useCallback((categoryName: string): boolean => {
    return categories.includes(categoryName);
  }, [categories]);

  // Get category type distribution
  const getTypeDistribution = useCallback(() => {
    const configs = getCategoriesWithConfig();
    const distribution = {
      needs: configs.filter(c => c.type === 'needs'),
      wants: configs.filter(c => c.type === 'wants'),
      savings: configs.filter(c => c.type === 'savings'),
    };

    return {
      needs: {
        categories: distribution.needs,
        count: distribution.needs.length,
        percentage: configs.length > 0 ? (distribution.needs.length / configs.length) * 100 : 0
      },
      wants: {
        categories: distribution.wants,
        count: distribution.wants.length,
        percentage: configs.length > 0 ? (distribution.wants.length / configs.length) * 100 : 0
      },
      savings: {
        categories: distribution.savings,
        count: distribution.savings.length,
        percentage: configs.length > 0 ? (distribution.savings.length / configs.length) * 100 : 0
      }
    };
  }, [getCategoriesWithConfig]);

  // Load categories on mount
  useEffect(() => {
    fetchBudgetCategories();
  }, [fetchBudgetCategories]);

  return {
    categories,
    categoryConfigs,
    loading,
    error,
    fetchBudgetCategories,
    getCategoryConfig,
    getCategoriesWithConfig,
    getCategoriesByType,
    getCategoryStatistics,
    updateCategoryConfig,
    getSuggestedCategories,
    categoryExists,
    getTypeDistribution,
  };
};

export default useBudgetCategories;