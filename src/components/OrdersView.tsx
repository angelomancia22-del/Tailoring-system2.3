import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem, OrderStatus, GarmentCategory } from '../types/tailoring';
import { GARMENT_METADATA } from '../data/initialData';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Kanban, 
  Table as TableIcon, 
  Plus, 
  Printer, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';

interface OrdersViewProps {
  onOpenNewOrder: () => void;
  onOpenOrderDetails: (order: OrderItem) => void;
  onOpenPrintSlip: (order: OrderItem) => void;
  onOpenCommModal: (order: OrderItem) => void;
  onOpenPaymentModal: (order: OrderItem) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  onOpenNewOrder,
  onOpenOrderDetails,
  onOpenPrintSlip,
  onOpenCommModal,
  onOpenPaymentModal
}) => {
  const { 
    filteredOrders, 
    filterCriteria, 
    setFilterCriteria, 
    resetFilters, 
    updateOrderStatus,
    currentRole
  } = useTailoring();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Status columns for Kanban
  const kanbanStages: { key: OrderStatus; label: string; tagalog: string }[] = [
    { key: 'placed', label: 'Order Placed', tagalog: 'Tala' },
    { key: 'cutting', label: 'Fabric Cutting', tagalog: 'Tabas' },
    { key: 'fitting', label: 'Basting Fitting', tagalog: 'Sukat' },
    { key: 'sewing', label: 'Sewing Assembly', tagalog: 'Tahi' },
    { key: 'ready', label: 'Ready for Pickup', tagalog: 'Handa na' },
    { key: 'claimed', label: 'Claimed', tagalog: 'Nakuha na' }
  ];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">URGENT</span>;
    }
    if (priority === 'rush') {
      return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">RUSH</span>;
    }
    return <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">Regular</span>;
  };

  const getPaymentBadge = (status: string, balance: number) => {
    if (status === 'paid') {
      return <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Paid in Full</span>;
    }
    if (status === 'partial') {
      return <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Bal: ₱{balance.toLocaleString()}</span>;
    }
    return <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Unpaid</span>;
  };

  return (
    <div className="space-y-4">
      {/* Title & Top View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Customer Orders & Production Pipeline
          </h1>
          <p className="text-xs text-neutral-500">
            Monitor sewing milestones, fabric cutting, client deadlines, and payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenNewOrder}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Advanced Search & Filtering Strip */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by customer name, order ID (e.g. ORD-2026-001), phone, or garment..."
              value={filterCriteria.searchQuery}
              onChange={(e) =>
                setFilterCriteria(prev => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50/50 text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Quick Garment Filter */}
          <select
            value={filterCriteria.garmentType}
            onChange={(e) =>
              setFilterCriteria(prev => ({ ...prev, garmentType: e.target.value as any }))
            }
            className="text-xs border border-neutral-300 rounded-lg px-3 py-2 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Garment Types</option>
            <option value="barong_tagalog">Barong Tagalog</option>
            <option value="school_uniform">School Uniform</option>
            <option value="corporate_uniform">Corporate / Office</option>
            <option value="pants_trousers">Pants & Slacks</option>
            <option value="dress_gown">Dress & Gown</option>
            <option value="blazer_suit">Suit & Blazer</option>
            <option value="polo_shirt">Polo Shirt</option>
            <option value="alterations">Alterations</option>
          </select>

          {/* Quick Status Filter */}
          <select
            value={filterCriteria.orderStatus}
            onChange={(e) =>
              setFilterCriteria(prev => ({ ...prev, orderStatus: e.target.value as any }))
            }
            className="text-xs border border-neutral-300 rounded-lg px-3 py-2 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Production Stages</option>
            <option value="placed">Order Placed (Tala)</option>
            <option value="cutting">Fabric Cutting (Tabas)</option>
            <option value="fitting">Fitting Scheduled (Sukat)</option>
            <option value="sewing">Sewing (Tahi)</option>
            <option value="ready">Ready for Pickup</option>
            <option value="claimed">Claimed (Nakuha na)</option>
          </select>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showAdvancedFilters || filterCriteria.paymentStatus !== 'all' || filterCriteria.startDate
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Reset button */}
          {(filterCriteria.searchQuery ||
            filterCriteria.garmentType !== 'all' ||
            filterCriteria.orderStatus !== 'all' ||
            filterCriteria.paymentStatus !== 'all' ||
            filterCriteria.priority !== 'all' ||
            filterCriteria.startDate ||
            filterCriteria.endDate) && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Payment Status
              </label>
              <select
                value={filterCriteria.paymentStatus}
                onChange={(e) =>
                  setFilterCriteria(prev => ({ ...prev, paymentStatus: e.target.value as any }))
                }
                className="w-full text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid in Full (Bayad na)</option>
                <option value="partial">Partial Deposit (May Balanse)</option>
                <option value="unpaid">Unpaid (Walang Downpayment)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Order Priority
              </label>
              <select
                value={filterCriteria.priority}
                onChange={(e) =>
                  setFilterCriteria(prev => ({ ...prev, priority: e.target.value as any }))
                }
                className="w-full text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="rush">Rush</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Order Date From
              </label>
              <input
                type="date"
                value={filterCriteria.startDate}
                onChange={(e) =>
                  setFilterCriteria(prev => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Order Date To
              </label>
              <input
                type="date"
                value={filterCriteria.endDate}
                onChange={(e) =>
                  setFilterCriteria(prev => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
              />
            </div>
          </div>
        )}

        {/* Filter results counter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Showing <strong>{filteredOrders.length}</strong> matching orders
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px]">
              Tap card to inspect measurements & audit history
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {kanbanStages.map((stage) => {
            const stageOrders = filteredOrders.filter(o => o.status === stage.key);

            return (
              <div
                key={stage.key}
                className="bg-neutral-100/80 rounded-xl p-3 border border-neutral-200/80 flex flex-col min-h-[380px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-800">
                      {stage.label}
                    </h3>
                    <span className="text-[10px] text-neutral-500 block">
                      {stage.tagalog}
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-white text-neutral-800 font-mono text-[11px] font-semibold flex items-center justify-center border border-neutral-200">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Orders in Column */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageOrders.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-[11px] text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
                      No orders
                    </div>
                  ) : (
                    stageOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg p-3 border border-neutral-200 shadow-2xs hover:border-neutral-400 transition-all space-y-2 group"
                      >
                        {/* Order # and Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-neutral-900">
                            {order.orderNumber}
                          </span>
                          {getPriorityBadge(order.priority)}
                        </div>

                        {/* Customer & Garment */}
                        <div>
                          <div 
                            onClick={() => onOpenOrderDetails(order)}
                            className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer line-clamp-1"
                          >
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                            {order.garmentTitle}
                          </div>
                        </div>

                        {/* Dates & Payment */}
                        <div className="pt-1.5 border-t border-neutral-100 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-neutral-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              <span>Due: {order.dueDate}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            {getPaymentBadge(order.paymentStatus, order.balanceAmount)}
                            <span className="text-[10px] text-neutral-500 font-mono">
                              Total: ₱{order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions Strip */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                          {/* Quick stage transition */}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="text-[10px] font-medium py-1 px-1.5 border border-neutral-200 rounded bg-neutral-50 text-neutral-700 focus:outline-none"
                          >
                            <option value="placed">Placed</option>
                            <option value="cutting">Cutting</option>
                            <option value="fitting">Fitting</option>
                            <option value="sewing">Sewing</option>
                            <option value="ready">Ready</option>
                            <option value="claimed">Claimed</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenPaymentModal(order)}
                              title="Record Payment"
                              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenPrintSlip(order)}
                              title="Print Job Slip / Claim Ticket"
                              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenCommModal(order)}
                              title="Send SMS"
                              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DENSE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Garment & Qty</th>
                  <th className="py-3 px-4">Production Stage</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total Price</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-500">
                      No matching tailoring orders found. Adjust your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        {order.orderNumber}
                        <div className="mt-0.5">{getPriorityBadge(order.priority)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onOpenOrderDetails(order)}
                          className="font-medium text-neutral-900 hover:underline text-left block"
                        >
                          {order.customerName}
                        </button>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {order.customerPhone}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-800">
                          {order.garmentTitle}
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Qty: {order.quantity} · {order.fabricSource === 'customer_provided' ? 'Customer Fabric' : 'Shop Fabric'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="text-xs py-1 px-2 border border-neutral-300 rounded-md bg-white text-neutral-800 focus:outline-none"
                        >
                          <option value="placed">Placed (Tala)</option>
                          <option value="cutting">Cutting (Tabas)</option>
                          <option value="fitting">Fitting (Sukat)</option>
                          <option value="sewing">Sewing (Tahi)</option>
                          <option value="ready">Ready for Pickup</option>
                          <option value="claimed">Claimed (Nakuha na)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-700 whitespace-nowrap">
                        {order.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-neutral-900 whitespace-nowrap">
                        ₱{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold whitespace-nowrap">
                        {order.balanceAmount > 0 ? (
                          <span className="text-rose-600">₱{order.balanceAmount.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600">₱0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getPaymentBadge(order.paymentStatus, order.balanceAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenPaymentModal(order)}
                            title="Collect Payment"
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPrintSlip(order)}
                            title="Print Official Job Slip & Claim Ticket"
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenCommModal(order)}
                            title="Send SMS Status Update"
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenOrderDetails(order)}
                            title="Inspect Details"
                            className="px-2 py-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
