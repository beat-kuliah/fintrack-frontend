"use client";

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Loader2, ChevronDown, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import BudgetForm from "@/components/BudgetForm"
import useBudgetAPI, { BudgetCategory, MonthlyBudget } from "@/components/hooks/useBudgetAPI"
import { BudgetRequest } from "@/utils/budgetService"
import useBudgetCategories from "@/components/hooks/useBudgetCategories"
import useLogout from "@/components/hooks/useLogout"
import withAuth from "@/components/hocs/withAuth"



const Budgeting = () => {
  console.log('🚀 Budgeting component mounted');
  const { logout } = useLogout();
  
  // State management
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null);
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  
  // Additional state for proper loading management
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Date selection
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ]
    return monthNames[now.getMonth()]
  })
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // API hooks
  const {
    loading: budgetLoading,
    error: budgetError,
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    convertBudgetsToFrontend,
  } = useBudgetAPI(logout);
  
  const {
    loading: categoriesLoading,
    error: categoriesError,
    fetchBudgetCategories,
  } = useBudgetCategories(logout);
  
  // Helper function to get detailed period display
  const getDetailedPeriod = (month: string, year: number) => {
    const monthNames: { [key: string]: string } = {
      january: 'Januari', february: 'Februari', march: 'Maret', april: 'April', 
      may: 'Mei', june: 'Juni', july: 'Juli', august: 'Agustus', 
      september: 'September', october: 'Oktober', november: 'November', december: 'Desember'
    }
    
    const monthMap: { [key: string]: number } = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    }
    
    const monthIndex = monthMap[month]
    const lastDay = new Date(year, monthIndex + 1, 0).getDate()
    
    return `1 - ${lastDay} ${monthNames[month]} ${year}`
  }
  
  // Load current budget data
  const loadBudgets = useCallback(async () => {
    // Prevent loading if already loading, has error, or already loaded for current period
    if (budgetLoading || (hasLoaded && !isInitialLoad)) {
      console.log('🚫 Skipping load - already loading or loaded');
      return;
    }

    try {
      setHasError(false);
      
      const budgets = await getBudgets();
      console.log('📊 Raw API response:', budgets);
      
      if (!budgets || !Array.isArray(budgets)) {
        console.warn('⚠️ Invalid budget response format');
        setBudgetData([]);
        setIsEmpty(true);
        setHasLoaded(true);
        setIsInitialLoad(false);
        return;
      }
      
      const convertedBudget = convertBudgetsToFrontend(budgets);
      console.log('🔄 Converted budget:', convertedBudget);
      console.log('📋 Categories to set:', convertedBudget.categories);
      
      const categories = convertedBudget.categories || [];
      setBudgetData(categories);
      setIsEmpty(categories.length === 0);
      setHasLoaded(true);
      setIsInitialLoad(false);
      console.log('✅ Budget data set successfully');
    } catch (error) {
      console.error('❌ Error loading budget:', error);
      
      setHasError(true);
      setHasLoaded(true);
      setIsInitialLoad(false);
      toast({
        title: "Error",
        description: `Gagal memuat data budget: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      setBudgetData([]);
    }
  }, []);
  


  // Load data on component mount and when month/year changes
  useEffect(() => {
    console.log('🔄 Month/Year changed, loading budgets:', { selectedMonth, selectedYear });
    setHasLoaded(false);
    setHasError(false);
    setIsEmpty(false);
    setIsInitialLoad(false); // Not initial load when month/year changes
    loadBudgets();
  }, [selectedMonth, selectedYear]);

  // Load categories when month/year changes
  useEffect(() => {
    console.log('🔄 Loading categories for period:', { selectedMonth, selectedYear });
    
    // Convert selectedMonth to number
    const monthMap: { [key: string]: number } = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
    };
    
    const monthNumber = monthMap[selectedMonth];
    const lastDay = new Date(selectedYear, monthNumber, 0).getDate();
    
    const periodStart = `${selectedYear}-${String(monthNumber).padStart(2, '0')}-01`;
    const periodEnd = `${selectedYear}-${String(monthNumber).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    
    console.log('📅 Period parameters:', { periodStart, periodEnd });
    
    fetchBudgetCategories(periodStart, periodEnd);
  }, [selectedMonth, selectedYear]);

  // Initial load on component mount
  useEffect(() => {
    setIsInitialLoad(true);
    loadBudgets();
  }, []);

  // Show toast error when budgetError or categoriesError occurs
  useEffect(() => {
    if (budgetError) {
      toast({
        title: "Error",
        description: `Error budget: ${budgetError}`,
        variant: "destructive"
      });
    }
  }, [budgetError]);

  useEffect(() => {
    if (categoriesError) {
      toast({
        title: "Error",
        description: `Error kategori: ${categoriesError}`,
        variant: "destructive"
      });
    }
  }, [categoriesError]);
  
  // Handle save budget (create/update)
  const handleSaveBudget = async (budgetData: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsAddingBudget(true);
    try {
      // Convert each category to BudgetRequest format for API
      const budgetPromises = budgetData.categories.map(async (category) => {
        const budgetRequest: BudgetRequest = {
          category: category.name,
          target_amount: category.budgetedAmount.toString(),
          period_type: 'monthly',
          period_start: `${budgetData.year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
          period_end: `${budgetData.year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date(budgetData.year, new Date().getMonth() + 1, 0).getDate()}`,
          is_active: true
        };
        
        return await createBudget(budgetRequest);
      });
      
      const results = await Promise.all(budgetPromises);
      const successCount = results.filter(result => result !== null).length;
      
      if (successCount > 0) {
        toast({
          title: "Berhasil",
          description: `${successCount} budget berhasil disimpan!`
        });
        setIsAddModalOpen(false);
        // Reset states and reload
        setHasLoaded(false);
        setIsInitialLoad(true);
        loadBudgets();
      } else {
        toast({
          title: "Error",
          description: 'Gagal menyimpan budget',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: `Gagal menyimpan budget: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsAddingBudget(false);
    }
  };
  
  // Handle delete budget
  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus budget ini?')) return;
    
    setIsDeletingBudget(true);
    try {
      const result = await deleteBudget(parseInt(budgetId));
      if (result) {
        toast({
          title: "Berhasil",
          description: 'Budget berhasil dihapus!'
        });
        // Reset states and reload
        setHasLoaded(false);
        setIsInitialLoad(true);
        loadBudgets();
      } else {
        toast({
          title: "Error",
          description: 'Gagal menghapus budget',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: `Gagal menghapus budget: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsDeletingBudget(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (budget: BudgetCategory) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };
  
  // Handle edit budget
  const handleEditBudget = async (budgetData: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedBudget) return;
    
    setIsEditingBudget(true);
    try {
      // Find the category to update
      const categoryToUpdate = budgetData.categories.find(cat => cat.id === selectedBudget.id);
      if (categoryToUpdate) {
        const budgetRequest: BudgetRequest = {
          category: categoryToUpdate.name,
          target_amount: categoryToUpdate.budgetedAmount.toString(),
          period_type: 'monthly',
          period_start: `${budgetData.year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
          period_end: `${budgetData.year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date(budgetData.year, new Date().getMonth() + 1, 0).getDate()}`,
          is_active: true
        };
        
        const result = await updateBudget(parseInt(selectedBudget.id), budgetRequest);
        if (result) {
          toast({
          title: "Berhasil",
          description: 'Budget berhasil diupdate!'
        });
          setIsEditModalOpen(false);
          setSelectedBudget(null);
          // Reset states and reload
          setHasLoaded(false);
          setIsInitialLoad(true);
          loadBudgets();
        } else {
          toast({
            title: "Error",
            description: 'Gagal mengupdate budget',
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
          title: "Error",
          description: `Gagal mengupdate budget: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
    } finally {
      setIsEditingBudget(false);
    }
  };

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">
            Budget Management
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 rounded-xl">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            
            {/* Month and Year Selection */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 border-b border-gray-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-400">Budget Period:</span>
                <span className="text-sm font-medium">{getDetailedPeriod(selectedMonth, selectedYear)}</span>
              </div>
              <div className="flex items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32 bg-white text-blue-500 border-blue-200">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="w-20 bg-white text-blue-500 border-blue-200">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => 2025 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
            </motion.div>



            {/* Add Button and Loading */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center"
            >
              <div>
                {(budgetLoading || categoriesLoading) && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500">
                      {budgetLoading && categoriesLoading ? 'Loading data...' : 
                       budgetLoading ? 'Loading budgets...' : 'Loading categories...'}
                    </span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={budgetLoading || isAddingBudget}
              >
                {(budgetLoading || isAddingBudget) ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />{budgetLoading ? "Loading..." : "Adding..."}</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Add New Budget</>
                )}
              </Button>
            </motion.div>

            {/* Budget Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-100 p-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-3 flex items-center gap-1">
                  Category <ChevronDown className="h-3 w-3" />
                </div>
                <div className="col-span-2">Budget Amount</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Period</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {(() => {
                  console.log('🎯 Current budgetData state:', budgetData);
                  console.log('📊 budgetData.length:', budgetData.length);
                  console.log('⏳ budgetLoading:', budgetLoading);
                  console.log('❌ hasError:', hasError);
                  console.log('📭 isEmpty:', isEmpty);
                  console.log('🔄 hasLoaded:', hasLoaded);
                  return null;
                })()}
                {budgetLoading && !hasLoaded ? (
                  <div className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading budget data...</span>
                    </div>
                  </div>
                ) : hasError ? (
                  <div className="p-8 text-center text-red-500">
                    <div className="mb-4">❌</div>
                    <div className="font-medium mb-2">Gagal memuat data budget</div>
                    <div className="text-sm text-gray-500 mb-4">Terjadi kesalahan saat mengambil data dari server</div>
                  </div>
                ) : isEmpty || budgetData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="mb-2">📊</div>
                    <div className="font-medium mb-1">Tidak ada budget ditemukan</div>
                    <div className="text-sm mb-4">Buat budget pertama Anda untuk {selectedMonth} {selectedYear}</div>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)} 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Buat Budget
                    </Button>
                  </div>
                ) : (
                  budgetData.map((budget, index) => {
                    console.log(`🔍 Rendering budget ${index + 1}:`, budget);
                    return (
                      <motion.div
                        key={budget.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                        className="grid grid-cols-12 p-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
                      >
                        <div className="col-span-3 font-medium">{budget.name}</div>
                        <div className="col-span-2 font-mono">Rp{(budget.budgetedAmount || 0).toLocaleString()}</div>
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            budget.type === 'needs' ? 'bg-red-100 text-red-600' :
                            budget.type === 'wants' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {budget.type === 'needs' ? 'Kebutuhan' : budget.type === 'wants' ? 'Keinginan' : 'Tabungan'}
                          </span>
                        </div>
                        <div className="col-span-2 text-gray-600">{selectedMonth} {selectedYear}</div>
                        <div className="col-span-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                            Active
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openEditModal(budget)}>
                            <Edit2 className="h-3 w-3 text-gray-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700" 
                            onClick={() => handleDeleteBudget(budget.id)}
                            disabled={isDeletingBudget}
                          >
                            {isDeletingBudget ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      <BudgetForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBudget}
        loading={isAddingBudget}
      />

      {/* Edit Budget Modal */}
      <BudgetForm
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialBudget={selectedBudget ? {
          id: 'edit-budget',
          month: selectedMonth,
          year: selectedYear,
          totalIncome: 0,
          categories: [selectedBudget],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : null}
        onSave={handleEditBudget}
        loading={isEditingBudget}
      />
    </div>
  );
};

export default withAuth(Budgeting);
