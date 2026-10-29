import React from 'react';
import { useTailoring } from '../context/TailoringContext';
import { GARMENT_METADATA } from '../data/initialData';
import { OrderItem } from '../types/tailoring';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Printer, 
  Plus, 
  UserPlus, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'customers' | 'measurements' | 'communications' | 'reports' | 'evaluation') => void;
  onOpenNewOrder: () => void;
  onOpenNewCustomer: () => void;
  onOpenOrderDetails: (order: OrderItem) => void;
  onOpenPrintSlip: (order: OrderItem) => void;
  onOpenCommModal: (order?: OrderItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenNewOrder,
  onOpenNewCustomer,
  onOpenOrderDetails,
  onOpenPrintSlip,
  onOpenCommModal
}) => {
  const { orders, customers, shopSettings } = useTailoring();

  // Metrics computation
  const activeOrders = orders.filter(o => o.status !== 'claimed');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const fittingOrders = orders.filter(o => o.status === 'fitting');
  const sewingOrders = orders.filter(o => o.status === 'sewing' || o.status === 'cutting');
  
  const totalRevenueCollected = orders.reduce((sum, o) => sum + o.depositAmount, 0);
  const totalOutstandingBalance = orders
    .filter(o => o.status !== 'claimed')
    .reduce((sum, o) => sum + o.balanceAmount, 0);

  // Urgent and upcoming due dates
  const today = new Date().toISOString().split('T')[0];
  const upcomingOrders = [...activeOrders].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  const getDaysDiff = (targetDate: string) => {
    const diffTime = new Date(targetDate).getTime() - new Date(today).getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'placed': return 'Order Placed (Tala)';
      case 'cutting': return 'Cutting (Tabas)';
      case 'fitting': return 'Fitting (Sukat)';
      case 'sewing': return 'Sewing (Tahi)';
      case 'finishing': return 'Finishing & Pressing';
      case 'ready': return 'Ready for Pickup';
      case 'claimed': return 'Claimed (Nakuha na)';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Workshop Banner */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/bagong_bayan_tailor_shop_1793274386116.jpg"
            alt="Tailoring & Barong Atelier"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300 uppercase tracking-wider mb-2">
            <span>Customer Order & Measurement System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 text-balance">
            {shopSettings.shopName}
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed mb-6 max-w-2xl">
            Computerized customer order, body measurement repository, and job slip tracking. Replacing vulnerable paper notebooks and lost index cards with instant retrieval and automated customer SMS alerts.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Order</span>
            </button>
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View Production Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenCommModal()}
              className="px-3.5 py-2 text-xs font-medium text-amber-200 bg-amber-950/60 hover:bg-amber-950/90 border border-amber-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send SMS Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Numerical Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Active Orders</span>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {activeOrders.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Ongoing production</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Ready for Pickup</span>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {readyOrders.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Handa nang kunin</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Needs Fitting</span>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {fittingOrders.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Nakatakdang sukat</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">In Cutting/Sewing</span>
          <div className="text-2xl font-bold text-neutral-800 font-mono tabular-nums">
            {sewingOrders.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Nasa makina / tabas</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Unpaid Balance</span>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            ₱{totalOutstandingBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Remaining balance</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Registered Suki</span>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {customers.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">Suki database</span>
        </div>
      </div>

      {/* Main Grid: Priority Deadlines & Production Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Priority Deadlines & Orders Nearing Due Date */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Approaching Deadlines & Critical Orders
              </h2>
              <p className="text-xs text-neutral-500">
                Monitors delivery commitments to prevent missed dates and customer dissatisfaction
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
            {upcomingOrders.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">
                No active pending orders. All customer orders are up-to-date!
              </div>
            ) : (
              upcomingOrders.map((order) => {
                const daysLeft = getDaysDiff(order.dueDate);
                const isOverdue = daysLeft < 0;
                const isDueToday = daysLeft === 0;

                return (
                  <div key={order.id} className="p-4 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-xs font-medium text-neutral-800">
                          {order.customerName}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {order.customerPhone}
                        </span>
                        {order.priority === 'urgent' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            URGENT
                          </span>
                        )}
                        {order.priority === 'rush' && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            RUSH
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-neutral-600 truncate">
                        {order.garmentTitle}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Due: {order.dueDate}</span>
                        </span>
                        <span>·</span>
                        <span>Stage: <strong>{getStatusLabel(order.status)}</strong></span>
                        <span>·</span>
                        <span className="font-mono">
                          Bal: ₱{order.balanceAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Urgency indicator */}
                      <div className="text-right mr-2 hidden sm:block">
                        {isOverdue ? (
                          <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {Math.abs(daysLeft)}d overdue!
                          </span>
                        ) : isDueToday ? (
                          <span className="text-xs font-bold text-amber-600">
                            Due Today
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-600 font-mono tabular-nums">
                            {daysLeft} days left
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenOrderDetails(order)}
                        title="View Details"
                        className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onOpenPrintSlip(order)}
                        title="Print Job Slip / Claim Ticket"
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenCommModal(order)}
                        title="Send SMS Status Update"
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Tailoring Workshop Quick Actions & Research Info */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900">
              Quick Counter Actions
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={onOpenNewOrder}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Record New Order</span>
                    <span className="text-[11px] text-neutral-500 block">Accept deposit & assign due date</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
              </button>

              <button
                onClick={onOpenNewCustomer}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Register Suki Customer</span>
                    <span className="text-[11px] text-neutral-500 block">Save contact & Purok address</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
              </button>

              <button
                onClick={() => onNavigateTab('measurements')}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Visual Measurement Studio</span>
                    <span className="text-[11px] text-neutral-500 block">Barong, Slacks & Gown sukat guide</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
              </button>

              <button
                onClick={() => onNavigateTab('reports')}
                className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">Sales & Production Reports</span>
                    <span className="text-[11px] text-neutral-500 block">Export CSV or Print Ledger</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
              </button>
            </div>
          </div>

          {/* Research Alignment Card */}
          <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-950">Study Objectives Addressed</span>
              <button
                onClick={() => onNavigateTab('evaluation')}
                className="text-[11px] underline font-medium text-amber-900 hover:text-amber-950"
              >
                View Rubric
              </button>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Solves key operational challenges of tailoring businesses: eliminates index card loss, provides real-time stage tracking, protects client measurements, and enables SMS milestone communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
