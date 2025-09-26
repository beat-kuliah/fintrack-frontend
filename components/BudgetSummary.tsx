"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  PieChart, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BudgetCategory, BudgetSummary as BudgetSummaryType } from './hooks/useBudgetAPI';
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
} from 'recharts';

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
  categories: BudgetCategory[];
  totalIncome: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ summary, categories, totalIncome }) => {
  // Format currency with NaN handling
  const formatCurrency = (amount: number): string => {
    // Handle NaN, null, undefined, or invalid numbers
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0';
    }
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Calculate category performance with NaN handling
  const getCategoryPerformance = (category: BudgetCategory) => {
    // Ensure we have valid numbers
    const budgetedAmount = isNaN(category.budgetedAmount) ? 0 : category.budgetedAmount;
    const actualAmount = isNaN(category.actualAmount) ? 0 : category.actualAmount;
    
    const percentage = budgetedAmount > 0 ? (actualAmount / budgetedAmount) * 100 : 0;
    const remaining = budgetedAmount - actualAmount;
    
    let status: 'good' | 'warning' | 'danger' = 'good';
    if (percentage > 100) status = 'danger';
    else if (percentage > 80) status = 'warning';
    
    return { 
      percentage: isNaN(percentage) ? 0 : percentage, 
      remaining: isNaN(remaining) ? 0 : remaining, 
      status 
    };
  };

  // Prepare chart data with NaN handling
  const pieChartData = [
    { name: 'Kebutuhan', value: isNaN(summary.categoryBreakdown.needs.budgeted) ? 0 : summary.categoryBreakdown.needs.budgeted, color: '#ef4444' },
    { name: 'Keinginan', value: isNaN(summary.categoryBreakdown.wants.budgeted) ? 0 : summary.categoryBreakdown.wants.budgeted, color: '#3b82f6' },
    { name: 'Tabungan', value: isNaN(summary.categoryBreakdown.savings.budgeted) ? 0 : summary.categoryBreakdown.savings.budgeted, color: '#10b981' },
  ];

  const barChartData = categories.map(cat => ({
    name: cat.name.length > 10 ? cat.name.substring(0, 10) + '...' : cat.name,
    budgeted: isNaN(cat.budgetedAmount) ? 0 : cat.budgetedAmount,
    actual: isNaN(cat.actualAmount) ? 0 : cat.actualAmount,
    color: cat.color,
  }));

  const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Total Pendapatan</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Rp{formatCurrency(isNaN(totalIncome) ? 0 : totalIncome)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              *Dari transaksi income bulan ini
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
              Rp{formatCurrency(isNaN(summary.totalBudgeted) ? 0 : summary.totalBudgeted)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Total Pengeluaran</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Rp{formatCurrency(isNaN(summary.totalSpent) ? 0 : summary.totalSpent)}
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
              (isNaN(summary.totalRemaining) ? 0 : summary.totalRemaining) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Rp{formatCurrency(isNaN(summary.totalRemaining) ? 0 : summary.totalRemaining)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(isNaN(summary.usagePercentage) ? 0 : summary.usagePercentage).toFixed(1)}% terpakai
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performa Kategori Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Kategori</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Pengeluaran</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                  <TableHead className="w-[200px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => {
                  const performance = getCategoryPerformance(category);
                  const typeColors = {
                    needs: 'bg-red-100 text-red-800',
                    wants: 'bg-blue-100 text-blue-800',
                    savings: 'bg-green-100 text-green-800',
                  };
                  
                  return (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[category.type]}>
                          {category.type === 'needs' ? 'Kebutuhan' : 
                           category.type === 'wants' ? 'Keinginan' : 'Tabungan'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp{formatCurrency(isNaN(category.budgetedAmount) ? 0 : category.budgetedAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp{formatCurrency(isNaN(category.actualAmount) ? 0 : category.actualAmount)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        performance.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {performance.remaining >= 0 ? 
                          `Rp${formatCurrency(performance.remaining)}` :
                          `-Rp${formatCurrency(Math.abs(performance.remaining))}`
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className={`text-sm font-medium ${
                            performance.status === 'danger' ? 'text-red-600' :
                            performance.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {performance.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Progress 
                              value={Math.min(performance.percentage, 100)} 
                              className={`h-2 ${
                                performance.status === 'danger' ? 'bg-red-100' :
                                performance.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            {performance.status === 'danger' && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            {performance.status === 'warning' && (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            {performance.status === 'good' && performance.percentage > 0 && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart - Budget Allocation by Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alokasi Budget per Tipe</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`Rp${formatCurrency(value)}`, 'Budget']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Budget vs Actual by Category */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget vs Pengeluaran Aktual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    fontSize={10}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `Rp${formatCurrency(value)}`,
                      name === 'budgeted' ? 'Budget' : 'Aktual'
                    ]}
                  />
                  <Bar dataKey="budgeted" fill="#3b82f6" name="Budget" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="actual" fill="#ef4444" name="Aktual" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Category Breakdown Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan per Tipe Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Needs */}
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <h4 className="font-medium text-red-800">Kebutuhan</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600">Budget:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.needs.budgeted) ? 0 : summary.categoryBreakdown.needs.budgeted)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Pengeluaran:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.needs.spent) ? 0 : summary.categoryBreakdown.needs.spent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Persentase:</span>
                    <span className="font-medium">{(isNaN(summary.categoryBreakdown.needs.percentage) ? 0 : summary.categoryBreakdown.needs.percentage).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Wants */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <h4 className="font-medium text-blue-800">Keinginan</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Budget:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.wants.budgeted) ? 0 : summary.categoryBreakdown.wants.budgeted)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Pengeluaran:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.wants.spent) ? 0 : summary.categoryBreakdown.wants.spent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Persentase:</span>
                    <span className="font-medium">{(isNaN(summary.categoryBreakdown.wants.percentage) ? 0 : summary.categoryBreakdown.wants.percentage).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Savings */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <h4 className="font-medium text-green-800">Tabungan</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Budget:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.savings.budgeted) ? 0 : summary.categoryBreakdown.savings.budgeted)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Pengeluaran:</span>
                    <span className="font-medium">Rp{formatCurrency(isNaN(summary.categoryBreakdown.savings.spent) ? 0 : summary.categoryBreakdown.savings.spent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Persentase:</span>
                    <span className="font-medium">{(isNaN(summary.categoryBreakdown.savings.percentage) ? 0 : summary.categoryBreakdown.savings.percentage).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BudgetSummary;