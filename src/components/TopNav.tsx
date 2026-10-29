import React from 'react';
import { useTailoring } from '../context/TailoringContext';
import { UserRole } from '../types/tailoring';
import { 
  Scissors, 
  Plus, 
  Database, 
  UserCheck, 
  Search, 
  HelpCircle 
} from 'lucide-react';

interface TopNavProps {
  activeTab: 'dashboard' | 'orders' | 'customers' | 'measurements' | 'communications' | 'reports' | 'evaluation';
  setActiveTab: (tab: 'dashboard' | 'orders' | 'customers' | 'measurements' | 'communications' | 'reports' | 'evaluation') => void;
  onOpenNewOrder: () => void;
  onOpenBackup: () => void;
  onOpenCustomerTracker: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  onOpenBackup,
  onOpenCustomerTracker
}) => {
  const { currentRole, setCurrentRole, lastSavedTimestamp } = useTailoring();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left text-neutral-900 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                <Scissors className="w-4 h-4 text-neutral-100" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-neutral-900 whitespace-nowrap block leading-tight">
                  TailorCraft Atelier
                </span>
                <span className="text-[11px] text-neutral-500 whitespace-nowrap block">
                  Orders & Measurements System
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'dashboard' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'orders' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Orders & Pipeline
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'customers' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Customers (Suki)
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'measurements' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Measurements (Sukat)
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'communications' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              SMS & Notifications
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'reports' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Reports & Sales
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`whitespace-nowrap transition-colors hover:text-neutral-900 ${
                activeTab === 'evaluation' ? 'text-neutral-900 font-semibold text-emerald-800' : ''
              }`}
            >
              Study Evaluation
            </button>
          </nav>

          {/* Zone 3: Primary Action & Tools */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Customer Lookup button */}
            <button
              onClick={onOpenCustomerTracker}
              title="Customer Self-Service Claim Status Tracker"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span>Claim Tracker</span>
            </button>

            {/* Backup & Data menu */}
            <button
              onClick={onOpenBackup}
              title="Backup, Export JSON, & Local Data Status"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Role Switcher */}
            <div className="relative inline-flex items-center">
              <label htmlFor="role-select" className="sr-only">User Role</label>
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="text-xs bg-neutral-100 border border-neutral-300 rounded-lg py-1.5 px-2.5 text-neutral-800 font-medium focus:ring-1 focus:ring-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="owner">Role: Master Tailor (Owner)</option>
                <option value="tailor">Role: Tailor / Cutter</option>
                <option value="cashier">Role: Front Desk / Cashier</option>
                <option value="customer">Role: Customer View</option>
              </select>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewOrder}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-4 border-t border-neutral-200 text-xs font-medium text-neutral-600 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'dashboard' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'orders' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'customers' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'measurements' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Measurements
          </button>
          <button
            onClick={() => setActiveTab('communications')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'communications' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            SMS
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'reports' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md ${
              activeTab === 'evaluation' ? 'bg-neutral-900 text-white font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Study Evaluation
          </button>
        </div>
      </div>
    </header>
  );
};
