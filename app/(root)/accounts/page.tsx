"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, CreditCard, Building2, Eye, EyeOff, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import useAxiosHandler from "@/utils/axiosHandler"
import { pocketUrl, userUrl } from "@/utils/network"
import { userShowBalanceKey } from "@/utils/contants"
import { toast } from "react-toastify"

// Define the account type based on API response
interface ApiAccount {
  id: number
  user_id: number
  name: string
  account: {
    String: string
    Valid: boolean
  }
  amount: string
  account_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Internal account interface for UI
interface Account {
  id: number
  name: string
  accountNumber: string
  balance: number
  type: string
  color: string
}



// Account types
const accountTypes = ["Checking", "Savings", "Savings Account", "Investment", "Business", "Credit Card"]

// Available colors
const colors = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Teal", value: "bg-teal-500" },
]

const Accounts = () => {
  const { axiosHandler } = useAxiosHandler();
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [showBalances, setShowBalances] = useState(true)
  // Loading states to prevent double clicks
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false)
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    accountNumber: "",
    type: "Checking",
    color: "bg-blue-500",
  })

  useEffect(() => {
    const showBalance = localStorage.getItem(userShowBalanceKey);
    if (showBalance) {
      setShowBalances(showBalance === "true");
    }
  }, [])

  const handleUpdateShowBalance = async (value: boolean) => {
    if (isUpdatingBalance) return
    
    setIsUpdatingBalance(true)
    setShowBalances(value);
    localStorage.setItem(userShowBalanceKey, value.toString());

    try {
      await axiosHandler({
        method: "PATCH",
        url: userUrl.updateHideBalance,
        isAuthorized: true,
        data: {
          hide_balance: !value,
        }
      })
    } catch (error) {
      console.error('Error updating show balance:', error)
      // Revert on error
      setShowBalances(!value)
      localStorage.setItem(userShowBalanceKey, (!value).toString())
    } finally {
      setIsUpdatingBalance(false)
    }
  }


  // Function to transform API data to UI format
  const transformApiAccountToAccount = (apiAccount: ApiAccount): Account => {
    // Assign colors cyclically based on account ID
    const colorIndex = (apiAccount.id - 1) % colors.length
    const assignedColor = colors[colorIndex].value
    
    return {
      id: apiAccount.id,
      name: apiAccount.name,
      accountNumber: apiAccount.account.Valid ? apiAccount.account.String : "N/A",
      balance: parseFloat(apiAccount.amount),
      type: apiAccount.account_type,
      color: assignedColor,
    }
  }

  // Get List Account
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        const response = await axiosHandler<ApiAccount[]>({
          method: "GET",
          url: pocketUrl.list,
          isAuthorized: true
        })
        
        if (response.data) {
          const transformedAccounts = response.data.map(transformApiAccountToAccount)
          setAccounts(transformedAccounts)
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
        // Fallback to initial data on error
        setAccounts([])
        toast("Internal Server Error", {type: "error"})
        setAccounts([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const totalAccounts = accounts.length

  // Handle adding a new account
  const handleAddAccount = async () => {
    // Prevent double click
    if (isAddingAccount) return
    
    // Validate required fields
    if (!newAccount.name || !newAccount.accountNumber || !newAccount.type) {
      toast("Please fill in all required fields (Name, Account Number, and Account Type)", { type: "error" })
      return
    }
    
    if (newAccount.name && newAccount.accountNumber) {
      try {
        setIsAddingAccount(true)
        const requestBody = {
          name: newAccount.name,
          account: newAccount.accountNumber,
          account_type: newAccount.type || "Checking",
        }

        const response = await axiosHandler({
          method: "POST",
          url: pocketUrl.add, // Use existing 'add' endpoint
          data: requestBody,
          isAuthorized: true
        })
        
        console.log(response.data)
        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
          // Transform the API response and add to accounts
          const newAccountData = transformApiAccountToAccount(response.data as ApiAccount)
          setAccounts([...accounts, newAccountData])
          
          // Close modal and reset form only on success
          setIsAddModalOpen(false)
          setNewAccount({
            name: "",
            accountNumber: "",
            type: "Checking",
            color: "bg-blue-500",
          })
          
          toast("Account added successfully", { type: "success" })
        } else {
          // API call succeeded but didn't return proper data
          toast("Failed to add account", { type: "error" })
        }
      } catch {
        toast("Failed to add account", { type: "error" })
        // Don't update accounts state or close modal on error
      } finally {
        setIsAddingAccount(false)
      }
    }
  }

  // Handle editing an account
  const handleEditAccount = async () => {
    // Prevent double click
    if (isEditingAccount) return
    
    // Validate required fields
    if (!selectedAccount || !selectedAccount.name || !selectedAccount.accountNumber || !selectedAccount.type) {
      toast("Please fill in all required fields (Name, Account Number, and Account Type)", { type: "error" })
      return
    }
    
    if (selectedAccount && selectedAccount.name && selectedAccount.accountNumber) {
      try {
        setIsEditingAccount(true)
        const requestBody = {
          name: selectedAccount.name,
          account: selectedAccount.accountNumber,
          account_type: selectedAccount.type,
        }

        const response = await axiosHandler({
          method: "PUT", // Use PATCH method
          url: pocketUrl.update.replace(":id", selectedAccount.id.toString()), // Use correct update endpoint
          data: requestBody,
          isAuthorized: true
        })

        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
          // Transform the API response and update accounts
          const updatedAccountData = transformApiAccountToAccount(response.data as ApiAccount)
          const updatedAccounts = accounts.map((account) => 
            account.id === selectedAccount.id ? updatedAccountData : account
          )
          setAccounts(updatedAccounts)
          
          // Close modal and reset state only on success
          setIsEditModalOpen(false)
          setSelectedAccount(null)
          
          toast("Account updated successfully", { type: "success" })
        } else {
          // API call succeeded but didn't return proper data
          toast("Failed to update account: Invalid response from server", { type: "error" })
        }
      } catch (error) {
        console.error('Error updating account:', error)
        toast("Failed to update account: Network error or server issue", { type: "error" })
        // Don't update accounts state or close modal on error
      } finally {
        setIsEditingAccount(false)
      }
    }
  }

  // Handle deleting an account
  const handleDeleteAccount = async () => {
    // Prevent double click
    if (isDeletingAccount) return
    
    if (accountToDelete) {
      try {
        setIsDeletingAccount(true)
        await axiosHandler({
          method: "DELETE",
          url: pocketUrl.delete.replace(":id", accountToDelete.id.toString()),
          isAuthorized: true
        })
        
        // Only update local state if API call succeeds
        const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete.id)
        setAccounts(updatedAccounts)
        setIsDeleteDialogOpen(false)
        setAccountToDelete(null)
        
        toast("Account deleted successfully", { type: "success" })
      } catch (error) {
        console.error('Error deleting account:', error)
        toast("Failed to delete account", { type: "error" })
        // Don't update local state or close dialog on error
      } finally {
        setIsDeletingAccount(false)
      }
    }
  }

  // Open edit modal for an account
  const openEditModal = (account: Account) => {
    setSelectedAccount({ ...account })
    setIsEditModalOpen(true)
  }

  // Open delete dialog for an account
  const openDeleteDialog = (account: Account) => {
    setAccountToDelete(account)
    setIsDeleteDialogOpen(true)
  }

  // Mask account number
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber
    return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4)
  }
  
  return <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm sm:text-lg font-semibold truncate">Account Management</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 rounded-xl">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Account Management</h1>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {totalAccounts} Total Accounts
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateShowBalance(!showBalances)}
                    disabled={isUpdatingBalance}
                    className="flex items-center gap-2"
                  >
                    {isUpdatingBalance ? (
                       <><Loader2 className="h-4 w-4 animate-spin" />Updating...</>
                     ) : (
                       <>{showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       {showBalances ? "Hide" : "Show"} Balances</>
                     )}
                  </Button>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isAddingAccount || isEditingAccount || isDeletingAccount}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Account
                  </Button>
                </div>
              </motion.div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {isLoading ? (
                  // Loading skeletons for summary cards
                  Array.from({ length: 3 }).map((_, index) => (
                    <motion.div 
                      key={`summary-skeleton-${index}`}
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-8 w-32" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  // Actual summary cards
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Balance</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {showBalances ? `Rp${totalBalance.toLocaleString()}` : "••••••••"}
                              </p>
                            </div>
                            <div className="p-2 rounded-full bg-green-100">
                              <CreditCard className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                              <p className="text-2xl font-bold text-gray-900">{totalAccounts}</p>
                            </div>
                            <div className="p-2 rounded-full bg-blue-100">
                              <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>


                  </>
                )}
              </div>

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Card className="relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200" />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-8 w-8 rounded" />
                              <Skeleton className="h-8 w-8 rounded" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                          <div className="pt-2 border-t">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : accounts.length > 0 ? (
                  // Actual account data
                  accounts.map((account, index) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${account.color}`} />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openEditModal(account)}
                                disabled={isAddingAccount || isEditingAccount || isDeletingAccount}
                              >
                                <Edit2 className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                onClick={() => openDeleteDialog(account)}
                                disabled={isAddingAccount || isEditingAccount || isDeletingAccount}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {account.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-mono text-gray-500">
                              {showBalances ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                            </p>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-sm text-gray-600">Balance</p>
                            <p className="text-xl font-bold text-gray-900">
                              {showBalances ? `Rp${account.balance.toLocaleString()}` : "••••••••"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full flex flex-col items-center justify-center py-12 text-center"
                  >
                    <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No accounts found</h3>
                    <p className="text-gray-500 mb-4">Get started by adding your first account</p>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isAddingAccount || isEditingAccount || isDeletingAccount}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Account
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Add Account Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>Enter the details of your new bank account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-sm font-medium">
                Account Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Primary Checking"
                className="col-span-3"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                maxLength={30}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right text-sm font-medium">
                Account Number *
              </Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                className="col-span-3"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-sm font-medium">
                Account Type *
              </Label>
              <Select value={newAccount.type} onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAccount} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isAddingAccount}
            >
              {isAddingAccount ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update the details of your account.</DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right text-sm font-medium">
                  Account Name *
                </Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Primary Checking"
                  className="col-span-3"
                  value={selectedAccount.name}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })}
                  maxLength={30}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-accountNumber" className="text-right text-sm font-medium">
                  Account Number *
                </Label>
                <Input
                  id="edit-accountNumber"
                  placeholder="1234567890"
                  className="col-span-3"
                  value={selectedAccount.accountNumber}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, accountNumber: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right text-sm font-medium">
                  Account Type *
                </Label>
                <Select
                  value={selectedAccount.type}
                  onValueChange={(value) => setSelectedAccount({ ...selectedAccount, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditAccount} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isEditingAccount}
            >
              {isEditingAccount ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{accountToDelete?.name}&quot;? This action cannot be undone and will remove
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700" disabled={isDeletingAccount}>
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
};

export default Accounts;
