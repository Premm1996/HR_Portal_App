'use client';

import React, { useState } from 'react';

export default function PayslipsPage({ params }: { params: { id: string } }) {
  const [payslips] = useState([
    {
      id: 1,
      month: 'September 2023',
      dateIssued: '2023-10-01',
      grossSalary: '$5,000',
      deductions: '$500',
      netSalary: '$4,500',
      downloadLink: '#'
    },
    {
      id: 2,
      month: 'August 2023',
      dateIssued: '2023-09-01',
      grossSalary: '$5,000',
      deductions: '$450',
      netSalary: '$4,550',
      downloadLink: '#'
    }
  ]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Payslips</h1>
      <div className="bg-[#1E2A44] rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-6">Month</th>
              <th className="py-3 px-6">Date Issued</th>
              <th className="py-3 px-6">Gross Salary</th>
              <th className="py-3 px-6">Deductions</th>
              <th className="py-3 px-6">Net Salary</th>
              <th className="py-3 px-6">Download</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((payslip) => (
              <tr key={payslip.id} className="border-b border-slate-700 hover:bg-[#15253B] transition-colors">
                <td className="py-3 px-6">{payslip.month}</td>
                <td className="py-3 px-6">{payslip.dateIssued}</td>
                <td className="py-3 px-6">{payslip.grossSalary}</td>
                <td className="py-3 px-6">{payslip.deductions}</td>
                <td className="py-3 px-6">{payslip.netSalary}</td>
                <td className="py-3 px-6">
                  <a
                    href={payslip.downloadLink}
                    className="text-blue-400 hover:text-blue-300"
                    download
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
