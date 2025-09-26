"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, DollarSign, Target, PieChart } from 'lucide-react';
import { BudgetCategory, MonthlyBudget } from './hooks/useBudgetAPI';
import { CategoryConfig } from './hooks/useBudgetCategories';
import { toast } from 'react-toastify';

interface BudgetFormProps {
  initialBudget?: MonthlyBudget | null;
  onSave: (budget: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading?: boolean;
  availableCategories?: string[];
  categoryConfigs?: CategoryConfig[];
}

const categoryColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6366f1', // indigo
];

const categoryTypes = [
  { value: 'needs', label: 'Kebutuhan', color: 'bg-red-100 text-red-800' },
  { value: 'wants', label: 'Keinginan', color: 'bg-blue-100 text-blue-800' },
  { value: 'savings', label: 'Tabungan', color: 'bg-green-100 text-green-800' },
];

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  initialBudget, 
  onSave, 
  loading = false, 
  availableCategories = [], 
  categoryConfigs = [] 
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'needs' as 'needs' | 'wants' | 'savings',
    budgetedAmount: '',
    description: '',
  });

  // Initialize form with existing budget data
  useEffect(() => {
    if (initialBudget) {
      setCategories(initialBudget.categories);
    }
  }, [initialBudget]);

  // Calculate totals from categories only
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0);
  
  // TODO: Replace with actual API call to get monthly income
  // const { data: monthlyIncome } = useMonthlyIncome(currentMonth, currentYear);
  // Note: totalIncome will be fetched from income transactions API
  const totalIncome = initialBudget?.totalIncome || 0;
  const remaining = totalIncome - totalBudgeted;
  const usagePercentage = totalIncome > 0 ? (totalBudgeted / totalIncome) * 100 : 0;

  // Add new category
  const addCategory = () => {
    if (!newCategory.name.trim() || !newCategory.budgetedAmount) {
      toast.error('Nama kategori dan jumlah budget harus diisi');
      return;
    }

    const amount = parseFloat(newCategory.budgetedAmount);
    if (amount <= 0) {
      toast.error('Jumlah budget harus lebih dari 0');
      return;
    }

    const category: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      type: newCategory.type,
      budgetedAmount: amount,
      actualAmount: 0,
      color: categoryColors[categories.length % categoryColors.length],
      description: newCategory.description.trim() || undefined,
    };

    setCategories([...categories, category]);
    setNewCategory({
      name: '',
      type: 'needs',
      budgetedAmount: '',
      description: '',
    });
  };

  // Remove category
  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // Update category
  const updateCategory = (id: string, field: keyof BudgetCategory, value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.length === 0) {
      toast.error('Minimal harus ada satu kategori budget');
      return;
    }

    const now = new Date();
    const budgetData = {
      month: now.toLocaleString('id-ID', { month: 'long' }),
      year: now.getFullYear(),
      totalIncome: totalIncome, // This will be updated from income API
      categories,
    };

    await onSave(budgetData);
  };

  const getCategoryTypeInfo = (type: string) => {
    return categoryTypes.find(ct => ct.value === type) || categoryTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Total Pendapatan</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Rp{totalIncome.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              *Diambil dari transaksi income bulan ini
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total Budget</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Rp{totalBudgeted.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Sisa Budget</span>
            </div>
            <p className={`text-2xl font-bold ${
              remaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Rp{remaining.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {usagePercentage.toFixed(1)}% terpakai
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">


        {/* Categories List */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategori Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category, index) => {
                  const typeInfo = getCategoryTypeInfo(category.type);
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-gray-600">Nama Kategori</Label>
                          <Input
                            value={category.name}
                            onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Tipe</Label>
                          <Select
                            value={category.type}
                            onValueChange={(value) => updateCategory(category.id, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Budget</Label>
                          <Input
                            type="number"
                            value={category.budgetedAmount}
                            onChange={(e) => updateCategory(category.id, 'budgetedAmount', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add New Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tambah Kategori Baru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryName">Nama Kategori</Label>
                  <Input
                    id="categoryName"
                    placeholder="Contoh: Makanan, Transport, dll"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryType">Tipe Kategori</Label>
                  <Select
                    value={newCategory.type}
                    onValueChange={(value: 'needs' | 'wants' | 'savings') => 
                      setNewCategory({ ...newCategory, type: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryAmount">Jumlah Budget</Label>
                  <Input
                    id="categoryAmount"
                    type="number"
                    placeholder="Masukkan jumlah budget"
                    value={newCategory.budgetedAmount}
                    onChange={(e) => setNewCategory({ ...newCategory, budgetedAmount: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addCategory}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kategori
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="categoryDescription">Deskripsi (Opsional)</Label>
                <Textarea
                  id="categoryDescription"
                  placeholder="Deskripsi kategori budget"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={loading || categories.length === 0}
            className="px-8"
          >
            {loading ? 'Menyimpan...' : 'Simpan Budget'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default BudgetForm;