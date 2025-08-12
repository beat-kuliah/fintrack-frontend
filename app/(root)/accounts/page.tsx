"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, CreditCard, Building2, Eye, EyeOff, Trash2 } from "lucide-react"
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
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/AppSidebar"
import useAxiosHandler from "@/utils/axiosHandler"
import { pocketUrl } from "@/utils/network"

// Define the account type
interface Account {
  id: number
  name: string
  bank: string
  accountNumber: string
  balance: number
  type: string
  color: string
  isActive: boolean
}

interface ListAccountResponse {
  data: Account[]
}


// Initial account data
const initialAccountData: Account[] = [
  {
    id: 1,
    name: "Primary Checking",
    bank: "Bank BCA",
    accountNumber: "1234567890",
    balance: 4200000,
    type: "Checking",
    color: "bg-blue-500",
    isActive: true,
  },
  {
    id: 2,
    name: "Savings Account",
    bank: "Bank Jago",
    accountNumber: "0987654321",
    balance: 5550000,
    type: "Savings",
    color: "bg-purple-500",
    isActive: true,
  },
  {
    id: 3,
    name: "Emergency Fund",
    bank: "Bank BNI",
    accountNumber: "1122334455",
    balance: 4800000,
    type: "Savings",
    color: "bg-green-500",
    isActive: true,
  },
  {
    id: 4,
    name: "Investment Account",
    bank: "Bank Mandiri",
    accountNumber: "5566778899",
    balance: 4500000,
    type: "Investment",
    color: "bg-red-500",
    isActive: true,
  },
  {
    id: 5,
    name: "Business Account",
    bank: "Bank CIMB",
    accountNumber: "9988776655",
    balance: 2300000,
    type: "Business",
    color: "bg-orange-500",
    isActive: false,
  },
]

// Available banks
const banks = [
  "Bank BCA",
  "Bank Jago",
  "Bank BNI",
  "Bank Mandiri",
  "Bank CIMB",
  "Bank BRI",
  "Bank Danamon",
  "Bank Permata",
]

// Account types
const accountTypes = ["Checking", "Savings", "Investment", "Business", "Credit Card"]

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
  const [accounts, setAccounts] = useState<Account[]>(initialAccountData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [showBalances, setShowBalances] = useState(true)
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    bank: "",
    accountNumber: "",
    balance: 0,
    type: "Checking",
    color: "bg-blue-500",
    isActive: true,
  })

  // Get List Account
  useEffect(() => {
    axiosHandler<Account[]>({
      method: "GET",
      url: pocketUrl.list,
      isAuthorized: true
    }).then(response => {
      if (response.data) {
        console.log(response.data);
        // setAccounts(response.data);
      }
    });
  }, [])


  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + (account.isActive ? account.balance : 0), 0)
  const activeAccounts = accounts.filter((account) => account.isActive).length

  // Handle adding a new account
  const handleAddAccount = () => {
    if (newAccount.name && newAccount.bank && newAccount.accountNumber) {
      const account: Account = {
        id: accounts.length + 1,
        name: newAccount.name,
        bank: newAccount.bank,
        accountNumber: newAccount.accountNumber,
        balance: newAccount.balance || 0,
        type: newAccount.type || "Checking",
        color: newAccount.color || "bg-blue-500",
        isActive: newAccount.isActive !== false,
      }

      setAccounts([...accounts, account])
      setIsAddModalOpen(false)
      setNewAccount({
        name: "",
        bank: "",
        accountNumber: "",
        balance: 0,
        type: "Checking",
        color: "bg-blue-500",
        isActive: true,
      })
    }
  }

  // Handle editing an account
  const handleEditAccount = () => {
    if (selectedAccount && selectedAccount.name && selectedAccount.bank && selectedAccount.accountNumber) {
      const updatedAccounts = accounts.map((account) => (account.id === selectedAccount.id ? selectedAccount : account))
      setAccounts(updatedAccounts)
      setIsEditModalOpen(false)
      setSelectedAccount(null)
    }
  }

  // Handle deleting an account
  const handleDeleteAccount = () => {
    if (accountToDelete) {
      const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete.id)
      setAccounts(updatedAccounts)
      setIsDeleteDialogOpen(false)
      setAccountToDelete(null)
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
                    {activeAccounts} Active Accounts
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBalances(!showBalances)}
                    className="flex items-center gap-2"
                  >
                    {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showBalances ? "Hide" : "Show"} Balances
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Account
                  </Button>
                </div>
              </motion.div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                          <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                          <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                        </div>
                        <div className="p-2 rounded-full bg-purple-100">
                          <CreditCard className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {accounts.map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden ${!account.isActive ? "opacity-60" : ""}`}>
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
                            >
                              <Edit2 className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => openDeleteDialog(account)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {account.type}
                          </Badge>
                          <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs">
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">{account.bank}</p>
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
                ))}
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
                Account Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Primary Checking"
                className="col-span-3"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank" className="text-right text-sm font-medium">
                Bank
              </Label>
              <Select value={newAccount.bank} onValueChange={(value) => setNewAccount({ ...newAccount, bank: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right text-sm font-medium">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                className="col-span-3"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-sm font-medium">
                Account Type
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right text-sm font-medium">
                Initial Balance (Rp)
              </Label>
              <Input
                id="balance"
                type="number"
                placeholder="0"
                className="col-span-3"
                value={newAccount.balance || ""}
                onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right text-sm font-medium">
                Color Theme
              </Label>
              <Select
                value={newAccount.color}
                onValueChange={(value) => setNewAccount({ ...newAccount, color: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`} />
                        {color.name}
                      </div>
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
            <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
              Add Account
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
                  Account Name
                </Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Primary Checking"
                  className="col-span-3"
                  value={selectedAccount.name}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bank" className="text-right text-sm font-medium">
                  Bank
                </Label>
                <Select
                  value={selectedAccount.bank}
                  onValueChange={(value) => setSelectedAccount({ ...selectedAccount, bank: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-accountNumber" className="text-right text-sm font-medium">
                  Account Number
                </Label>
                <Input
                  id="edit-accountNumber"
                  placeholder="1234567890"
                  className="col-span-3"
                  value={selectedAccount.accountNumber}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, accountNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right text-sm font-medium">
                  Account Type
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-balance" className="text-right text-sm font-medium">
                  Balance (Rp)
                </Label>
                <Input
                  id="edit-balance"
                  type="number"
                  placeholder="0"
                  className="col-span-3"
                  value={selectedAccount.balance}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-color" className="text-right text-sm font-medium">
                  Color Theme
                </Label>
                <Select
                  value={selectedAccount.color}
                  onValueChange={(value) => setSelectedAccount({ ...selectedAccount, color: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.value}`} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={selectedAccount.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setSelectedAccount({ ...selectedAccount, isActive: value === "active" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAccount} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
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
              Are you sure you want to delete "{accountToDelete?.name}"? This action cannot be undone and will remove
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
};

export default Accounts;
