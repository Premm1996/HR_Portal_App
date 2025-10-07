'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Calculator, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SalaryStructure {
  id: number;
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
}

interface PayrollRecord {
  id: number;
  month: string;
  year: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  processed_at: string;
}

interface TaxDeclaration {
  id: number;
  declaration_type: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submitted_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

interface Reimbursement {
  id: number;
  category: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  submitted_at: string;
  approved_at?: string;
  paid_at?: string;
  rejection_reason?: string;
}

export default function EmployeeFinanceHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
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
        fetch('/api/finance/salary-structure'),
        fetch('/api/finance/payroll-history'),
        fetch('/api/finance/tax-declarations'),
        fetch('/api/finance/reimbursements')
      ]);

      if (salaryRes.ok) {
        const salaryData = await salaryRes.json();
        setSalaryStructure(salaryData.length > 0 ? salaryData[0] : null);
      }
      if (payrollRes.ok) setPayrollRecords(await payrollRes.json());
      if (taxRes.ok) setTaxDeclarations(await taxRes.json());
      if (reimbursementRes.ok) setReimbursements(await reimbursementRes.json());
    } catch (error) {
      toast.error('Failed to fetch finance data');
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Hub</h1>
        <p className="text-muted-foreground">View your payroll, tax declarations, and reimbursements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salary">Salary Structure</TabsTrigger>
          <TabsTrigger value="payroll">Payroll History</TabsTrigger>
          <TabsTrigger value="tax">Tax Declarations</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
        </TabsList>

        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
              <CardDescription>Your current salary breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {salaryStructure ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(salaryStructure).map(([key, value]) => {
                      if (key === 'id' || key === 'user_id' || key === 'created_at') return null;
                      return (
                        <TableRow key={key}>
                          <TableCell>{key.replace(/_/g, ' ').toUpperCase()}</TableCell>
                          <TableCell>₹{(value as number).toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p>No salary structure found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>View your past payroll records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
          <Card>
            <CardHeader>
              <CardTitle>Tax Declarations</CardTitle>
              <CardDescription>View your submitted tax declarations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Approved At</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDeclarations.map((declaration) => (
                    <TableRow key={declaration.id}>
                      <TableCell>{declaration.declaration_type}</TableCell>
                      <TableCell>₹{declaration.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                      <TableCell>{new Date(declaration.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>{declaration.approved_at ? new Date(declaration.approved_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{declaration.rejection_reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursements</CardTitle>
              <CardDescription>View your reimbursement claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Approved At</TableHead>
                    <TableHead>Paid At</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell>{reimbursement.category}</TableCell>
                      <TableCell>₹{reimbursement.amount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{reimbursement.description}</TableCell>
                      <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                      <TableCell>{new Date(reimbursement.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>{reimbursement.approved_at ? new Date(reimbursement.approved_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{reimbursement.paid_at ? new Date(reimbursement.paid_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{reimbursement.rejection_reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
