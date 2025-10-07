'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, FileText, Calculator, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SalaryStructure {
  id: number;
  user_id: number;
  basic_salary: number;
  hra: number;
  conveyance: number;
  lta: number;
  medical: number;
  other_allowances: number;
  pf_employee: number;
  pf_employer: number;
  esi_employee: number;
  esi_employer: number;
  professional_tax: number;
  income_tax: number;
  other_deductions: number;
  created_at: string;
}

interface PayrollRecord {
  id: number;
  user_id: number;
  month: string;
  year: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  processed_at: string;
}

interface TaxDeclaration {
  id: number;
  user_id: number;
  declaration_type: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submitted_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

interface Reimbursement {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  submitted_at: string;
  approved_at?: string;
  paid_at?: string;
  rejection_reason?: string;
}

export default function AdminFinanceHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [taxDeclarations, setTaxDeclarations] = useState<TaxDeclaration[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [salaryRes, payrollRes, taxRes, reimbursementRes] = await Promise.all([
        fetch('/api/admin/finance/salary-structure'),
        fetch('/api/admin/finance/payroll-history'),
        fetch('/api/admin/finance/tax-declarations'),
        fetch('/api/admin/finance/reimbursements')
      ]);

      if (salaryRes.ok) setSalaryStructures(await salaryRes.json());
      if (payrollRes.ok) setPayrollRecords(await payrollRes.json());
      if (taxRes.ok) setTaxDeclarations(await taxRes.json());
      if (reimbursementRes.ok) setReimbursements(await reimbursementRes.json());
    } catch (error) {
      toast.error('Failed to fetch finance data');
    } finally {
      setLoading(false);
    }
  };

  const updateTaxDeclarationStatus = async (id: number, status: string, rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/admin/finance/tax-declarations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });

      if (response.ok) {
        toast.success(`Tax declaration ${status.toLowerCase()} successfully`);
        fetchFinanceData();
      } else {
        toast.error('Failed to update tax declaration status');
      }
    } catch (error) {
      toast.error('Failed to update tax declaration status');
    }
  };

  const updateReimbursementStatus = async (id: number, status: string, rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/admin/finance/reimbursements/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });

      if (response.ok) {
        toast.success(`Reimbursement ${status.toLowerCase()} successfully`);
        fetchFinanceData();
      } else {
        toast.error('Failed to update reimbursement status');
      }
    } catch (error) {
      toast.error('Failed to update reimbursement status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-purple-700">Finance Hub</h1>
          <p className="text-purple-600 font-semibold">Manage payroll, tax declarations, and reimbursements</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-white rounded-md shadow-md border border-purple-200">
          <TabsTrigger value="overview" className="text-purple-700 font-semibold hover:bg-purple-100">Overview</TabsTrigger>
          <TabsTrigger value="payroll" className="text-purple-700 font-semibold hover:bg-purple-100">Payroll</TabsTrigger>
          <TabsTrigger value="tax" className="text-purple-700 font-semibold hover:bg-purple-100">Tax Declarations</TabsTrigger>
          <TabsTrigger value="reimbursements" className="text-purple-700 font-semibold hover:bg-purple-100">Reimbursements</TabsTrigger>
          <TabsTrigger value="compliance" className="text-purple-700 font-semibold hover:bg-purple-100">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-700">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-purple-800">{salaryStructures.length}</div>
                <p className="text-xs text-purple-600">With salary structures</p>
              </CardContent>
            </Card>
            <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-700">Pending Approvals</CardTitle>
                <FileText className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-purple-800">
                  {taxDeclarations.filter(d => d.status === 'PENDING').length +
                   reimbursements.filter(r => r.status === 'PENDING').length}
                </div>
                <p className="text-xs text-purple-600">Tax & reimbursement requests</p>
              </CardContent>
            </Card>
            <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-700">Monthly Payroll</CardTitle>
                <Calculator className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-purple-800">{payrollRecords.length}</div>
                <p className="text-xs text-purple-600">Processed this month</p>
              </CardContent>
            </Card>
            <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-purple-700">Total Reimbursements</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-purple-800">
                  ₹{reimbursements.filter(r => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-purple-600">Paid this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>View and manage employee payroll records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Processed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.user_id}</TableCell>
                      <TableCell>{record.month} {record.year}</TableCell>
                      <TableCell>₹{record.gross_salary.toLocaleString()}</TableCell>
                      <TableCell>₹{record.total_deductions.toLocaleString()}</TableCell>
                      <TableCell>₹{record.net_salary.toLocaleString()}</TableCell>
                      <TableCell>{new Date(record.processed_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-purple-700 font-semibold">Tax Declarations</CardTitle>
              <CardDescription className="text-purple-600">Review and approve employee tax declarations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDeclarations.map((declaration) => (
                    <TableRow key={declaration.id}>
                      <TableCell>{declaration.user_id}</TableCell>
                      <TableCell>{declaration.declaration_type}</TableCell>
                      <TableCell>₹{declaration.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                      <TableCell>{new Date(declaration.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {declaration.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateTaxDeclarationStatus(declaration.id, 'APPROVED')}
                            >
                              Approve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">Reject</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Tax Declaration</DialogTitle>
                                  <DialogDescription>Provide a reason for rejection</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea placeholder="Rejection reason..." />
                                  <Button
                                    onClick={() => updateTaxDeclarationStatus(declaration.id, 'REJECTED', 'Reason provided')}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-4">
          <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-purple-700 font-semibold">Reimbursements</CardTitle>
              <CardDescription className="text-purple-600">Manage employee reimbursement claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell>{reimbursement.user_id}</TableCell>
                      <TableCell>{reimbursement.category}</TableCell>
                      <TableCell>₹{reimbursement.amount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{reimbursement.description}</TableCell>
                      <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                      <TableCell>{new Date(reimbursement.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {reimbursement.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateReimbursementStatus(reimbursement.id, 'APPROVED')}
                            >
                              Approve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">Reject</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Reimbursement</DialogTitle>
                                  <DialogDescription>Provide a reason for rejection</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea placeholder="Rejection reason..." />
                                  <Button
                                    onClick={() => updateReimbursementStatus(reimbursement.id, 'REJECTED', 'Reason provided')}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                        {reimbursement.status === 'APPROVED' && (
                          <Button
                            size="sm"
                            onClick={() => updateReimbursementStatus(reimbursement.id, 'PAID')}
                          >
                            Mark as Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-purple-700 font-semibold">Compliance Rules</CardTitle>
              <CardDescription className="text-purple-600">View active compliance and deduction rules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600">Compliance rules management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
