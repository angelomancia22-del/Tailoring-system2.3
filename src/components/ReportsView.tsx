import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem } from '../types/tailoring';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Users,
  Filter
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, customers, shopSettings } = useTailoring();

  const [activeReportType, setActiveReportType] = useState<
    'sales' | 'outstanding' | 'completed' | 'customer_history'
  >('sales');

  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');

  // Compute Sales statistics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const collectedRevenue = orders.reduce((sum, o) => sum + o.depositAmount, 0);
  const pendingBalance = orders
    .filter(o => o.status !== 'claimed')
    .reduce((sum, o) => sum + o.balanceAmount, 0);

  const completedOrders = orders.filter(o => o.status === 'claimed');
  const outstandingOrders = orders.filter(o => o.status !== 'claimed');

  // Filter orders by time period for the sales report
  const getFilteredSalesOrders = () => {
    const today = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      if (timePeriod === 'daily') {
        return orderDate.toDateString() === today.toDateString();
      }
      if (timePeriod === 'weekly') {
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      }
      if (timePeriod === 'monthly') {
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return orderDate >= oneMonthAgo;
      }
      return true;
    });
  };

  const salesReportOrders = getFilteredSalesOrders();

  // Export to CSV Function
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `Tailoring_${activeReportType}_report.csv`;

    if (activeReportType === 'sales') {
      csvContent += "Order Number,Customer Name,Garment,Order Date,Due Date,Total (PHP),Deposit (PHP),Balance (PHP),Payment Status,Payment Method\n";
      salesReportOrders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.garmentTitle}","${o.orderDate}","${o.dueDate}",${o.totalAmount},${o.depositAmount},${o.balanceAmount},"${o.paymentStatus}","${o.paymentMethod}"\n`;
      });
    } else if (activeReportType === 'outstanding') {
      csvContent += "Order Number,Customer Name,Phone,Garment,Stage,Priority,Due Date,Total (PHP),Balance (PHP)\n";
      outstandingOrders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.garmentTitle}","${o.status}","${o.priority}","${o.dueDate}",${o.totalAmount},${o.balanceAmount}\n`;
      });
    } else if (activeReportType === 'completed') {
      csvContent += "Order Number,Customer Name,Garment,Order Date,Claimed Date,Total (PHP),Payment Method,Tailor Assigned\n";
      completedOrders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.garmentTitle}","${o.orderDate}","${o.claimedDate || o.dueDate}",${o.totalAmount},"${o.paymentMethod}","${o.assignedTailor || 'Shop'}"\n`;
      });
    } else if (activeReportType === 'customer_history') {
      csvContent += "Customer Name,Phone,Purok Address,Total Orders,Total Spent (PHP),Unpaid Balance (PHP)\n";
      customers.forEach(c => {
        const custOrders = orders.filter(o => o.customerId === c.id);
        const spent = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const bal = custOrders.reduce((sum, o) => sum + o.balanceAmount, 0);
        csvContent += `"${c.fullName}","${c.contactNumber}","${c.purokAddress}",${custOrders.length},${spent},${bal}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Financial & Tailoring Production Reports
          </h1>
          <p className="text-xs text-neutral-500">
            Audit daily/weekly sales ledgers, outstanding balances, and customer history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
          <button
            onClick={exportToCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Total Booked Value</span>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            ₱{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Across all {orders.length} orders</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Cash & GCash Collected</span>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            ₱{collectedRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Deposits and full settlements</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Uncollected Balances</span>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            ₱{pendingBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">To be collected upon pickup</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Completed & Claimed</span>
          <div className="text-2xl font-bold text-neutral-800 font-mono tabular-nums">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">
            {Math.round((completedOrders.length / (orders.length || 1)) * 100)}% completion rate
          </span>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveReportType('sales')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeReportType === 'sales'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Sales & Revenue Ledger</span>
          </button>

          <button
            onClick={() => setActiveReportType('outstanding')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeReportType === 'outstanding'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Outstanding Orders ({outstandingOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveReportType('completed')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeReportType === 'completed'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Orders ({completedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveReportType('customer_history')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeReportType === 'customer_history'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer History ({customers.length})</span>
          </button>
        </div>

        {/* Sales Period Filter (when sales tab is active) */}
        {activeReportType === 'sales' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-500 mr-1">Period:</span>
            {(['daily', 'weekly', 'monthly', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                  timePeriod === period
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* REPORT CONTENT TABLES */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Printable Header - Visible when printed */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {shopSettings.shopName}
              </h2>
              <p className="text-xs text-neutral-500">
                {shopSettings.barangay} · Official Management Report: {activeReportType.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="text-right text-xs text-neutral-500">
              <div>Date Generated: {new Date().toLocaleDateString()}</div>
              <div>System: Automated Tailoring & Order Ledger</div>
            </div>
          </div>
        </div>

        {/* 1. SALES REPORT TABLE */}
        {activeReportType === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Garment Description</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total Price</th>
                  <th className="py-3 px-4 text-right">Deposit Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {salesReportOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-500">
                      No sales records for selected {timePeriod} period.
                    </td>
                  </tr>
                ) : (
                  salesReportOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/60">
                      <td className="py-2.5 px-4 font-mono font-bold text-neutral-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-neutral-800">
                        {order.customerName}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-700">
                        {order.garmentTitle}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600">
                        {order.orderDate}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-neutral-600">
                        {order.dueDate}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-neutral-900">
                        ₱{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-600">
                        ₱{order.depositAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-rose-600 font-medium">
                        ₱{order.balanceAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="capitalize text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-neutral-50 border-t-2 border-neutral-200 font-semibold text-neutral-900">
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-right text-xs">
                    Period Subtotal:
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    ₱{salesReportOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-emerald-700">
                    ₱{salesReportOrders.reduce((s, o) => s + o.depositAmount, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-rose-700">
                    ₱{salesReportOrders.reduce((s, o) => s + o.balanceAmount, 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* 2. OUTSTANDING ORDERS TABLE */}
        {activeReportType === 'outstanding' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer & Mobile</th>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Production Stage</th>
                  <th className="py-3 px-4">Assigned Tailor</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Unpaid Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {outstandingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-800">
                      {order.garmentTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {order.assignedTailor || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-800">
                      {order.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600">
                      ₱{order.balanceAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. COMPLETED ORDERS TABLE */}
        {activeReportType === 'completed' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Claimed Date</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {completedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      No claimed orders yet in this archive.
                    </td>
                  </tr>
                ) : (
                  completedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-neutral-800">
                        {order.garmentTitle}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {order.orderDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-medium">
                        {order.claimedDate || order.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-900">
                        ₱{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Paid & Claimed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. CUSTOMER ORDER HISTORY TABLE */}
        {activeReportType === 'customer_history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer Full Name</th>
                  <th className="py-3 px-4">Contact #</th>
                  <th className="py-3 px-4">Barangay Address</th>
                  <th className="py-3 px-4 text-center">Lifetime Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent (PHP)</th>
                  <th className="py-3 px-4 text-right">Outstanding Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((c) => {
                  const custOrders = orders.filter(o => o.customerId === c.id);
                  const totalSpent = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                  const totalBal = custOrders.reduce((sum, o) => sum + o.balanceAmount, 0);

                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        {c.fullName}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {c.contactNumber}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {c.purokAddress}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-neutral-800">
                        {custOrders.length}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-900">
                        ₱{totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {totalBal > 0 ? (
                          <span className="text-rose-600">₱{totalBal.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600">₱0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
