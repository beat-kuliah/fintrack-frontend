"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
} from "lucide-react";
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
} from "recharts";

const summaryData = [
  {
    name: "BCA",
    amount: 4200000,
    color: "bg-blue-600",
    textColor: "text-blue-600",
  },
  {
    name: "Jago",
    amount: 5550000,
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
  {
    name: "BNI",
    amount: 4800000,
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    name: "Mandiri",
    amount: 4500000,
    color: "bg-red-400",
    textColor: "text-red-400",
  },
];

const expenseData = [
  {
    id: 1,
    account: "BCA",
    category: "General Savings",
    type: "Savings",
    allocation: 2000000,
    percentage: 18.18,
    color: "bg-teal-400", // Changed from bg-green-500
  },
  {
    id: 2,
    account: "Jago",
    category: "Emergency Funds",
    type: "Savings",
    allocation: 1500000,
    percentage: 13.64,
    color: "bg-teal-400", // Changed from bg-green-500
  },
  {
    id: 3,
    account: "BNI",
    category: "Deposits",
    type: "Savings",
    allocation: 1000000,
    percentage: 9.09,
    color: "bg-teal-400", // Changed from bg-green-500
  },
  {
    id: 4,
    account: "BCA",
    category: "Home Rent",
    type: "Needs",
    allocation: 1350000,
    percentage: 12.27,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 5,
    account: "BCA",
    category: "Utilities",
    type: "Needs",
    allocation: 450000,
    percentage: 4.09,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 6,
    account: "BCA",
    category: "Food",
    type: "Needs",
    allocation: 1750000,
    percentage: 15.91,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 7,
    account: "BNI",
    category: "Supplies",
    type: "Needs",
    allocation: 500000,
    percentage: 4.55,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 8,
    account: "BCA",
    category: "Transportation",
    type: "Needs",
    allocation: 300000,
    percentage: 2.73,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 9,
    account: "BCA",
    category: "Healthcare",
    type: "Needs",
    allocation: 700000,
    percentage: 6.36,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 10,
    account: "BNI",
    category: "Debt",
    type: "Needs",
    allocation: 500000,
    percentage: 4.55,
    color: "bg-teal-400", // Changed from bg-yellow-500
  },
  {
    id: 11,
    account: "Jago",
    category: "Shopping",
    type: "Wants",
    allocation: 500000,
    percentage: 4.55,
    color: "bg-teal-400", // Changed from bg-red-400
  },
  {
    id: 12,
    account: "BCA",
    category: "Entertainment",
    type: "Wants",
    allocation: 250000,
    percentage: 2.27,
    color: "bg-teal-400", // Changed from bg-red-400
  },
  {
    id: 13,
    account: "BNI",
    category: "Gifts",
    type: "Wants",
    allocation: 200000,
    percentage: 1.82,
    color: "bg-teal-400", // Changed from bg-red-400
  },
];

const chartData = [
  { name: "BCA", value: 6200000, color: "#3b82f6" },
  { name: "Jago", value: 2000000, color: "#8b5cf6" },
  { name: "BNI", value: 1700000, color: "#10b981" },
  { name: "Mandiri", value: 1100000, color: "#ef4444" },
];

const pieData = [
  { name: "Savings", value: 40.9, color: "#2dd4bf" }, // Changed to emerald-500
  { name: "Needs", value: 50.5, color: "#2dd4bf" }, // Changed to amber-500
  { name: "Wants", value: 8.6, color: "#2dd4bf" }, // Changed to rose-500
];

const COLORS = ["#2dd4bf", "#2dd4bf", "#2dd4bf"]; // Updated to match new colors

const Budgeting = () => {
  const totalIncome = 11000000;
  const totalAllocated = expenseData.reduce(
    (sum, item) => sum + item.allocation,
    0
  );
  const usagePercentage = (totalAllocated / totalIncome) * 100;

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">
            Budgeting
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 rounded-xl">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    25 January 2024
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-orange-500 border-orange-200 text-xs"
                >
                  Next review in 5 days
                </Badge>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center px-4"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Budgeting Summary Sheet
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Monitor your financial portfolio and track asset allocation
              </p>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {summaryData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 w-full h-2 ${item.color}`}
                    />
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                            {item.name}
                          </p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            Rp{item.amount.toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`p-2 rounded-full ${item.color} bg-opacity-10 flex-shrink-0`}
                        >
                          <DollarSign
                            className={`h-4 w-4 sm:h-6 sm:w-6 ${item.textColor}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Income
                    </span>
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Rp{totalIncome.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Non-allocated
                    </span>
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Rp{(totalIncome - totalAllocated).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2 lg:col-span-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Usage Percentage
                    </span>
                    <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {usagePercentage.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expense Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Expenses List
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-3 p-4">
                    {expenseData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.account}
                            </Badge>
                          </div>
                          <Badge className={`${item.color} text-white text-xs`}>
                            {item.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.category}</p>
                          <p className="text-xs text-gray-600">
                            Rp{item.allocation.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {item.percentage}%
                          </span>
                          <div className="w-20">
                            <Progress
                              value={item.percentage * 5}
                              className="h-1"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left first:pl-0 last:pr-0 px-0 py-2 font-medium text-gray-600 text-sm">
                            Bank
                          </th>
                          <th className="text-left first:pl-0 last:pr-0 px-0 py-2 font-medium text-gray-600 text-sm">
                            Expenses List
                          </th>
                          <th className="text-left first:pl-0 last:pr-0 px-0 py-2 font-medium text-gray-600 text-sm">
                            Main Category
                          </th>
                          <th className="text-left first:pl-0 last:pr-0 px-0 py-2 font-medium text-gray-600 text-sm">
                            Allocation
                          </th>
                          <th className="text-left first:pl-0 last:pr-0 px-0 py-2 font-medium text-gray-600 text-sm">
                            Progress
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseData.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">
                                {item.account}
                              </Badge>
                            </td>
                            <td className="p-2 font-medium text-sm">
                              {item.category}
                            </td>
                            <td className="p-2">
                              <Badge
                                className={`${item.color} text-white text-xs`}
                              >
                                {item.type}
                              </Badge>
                            </td>
                            <td className="p-2 font-mono text-sm">
                              Rp{item.allocation.toLocaleString()}
                            </td>
                            <td className="p-2 flex items-center gap-5">
                              <div className="w-32">
                                <Progress
                                  value={item.percentage * 5}
                                  className="h-2 pr-0"
                                />
                              </div>
                              {item.percentage}%
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">
                      Portfolio by Bank
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 sm:pt-0">
                    <ResponsiveContainer width="100%" height={342}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          fontSize={12}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(1)}M`
                          }
                          fontSize={12}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `Rp${value.toLocaleString()}`,
                            "Amount",
                          ]}
                          labelStyle={{ color: "#374151" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">
                      Allocation by Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 sm:pt-0">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={false}
                          fontSize={10}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `${value}%`,
                            "Percentage",
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {pieData.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs sm:text-sm font-medium">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-bold">
                            {item.value}%
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgeting;
