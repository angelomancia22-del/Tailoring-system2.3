import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { Customer, OrderItem, GarmentCategory } from '../types/tailoring';
import { GARMENT_METADATA } from '../data/initialData';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  Calendar, 
  Scissors, 
  MessageSquare, 
  ChevronRight, 
  Edit3, 
  Clock, 
  Plus,
  X,
  Check
} from 'lucide-react';

interface CustomersViewProps {
  onOpenNewCustomer: () => void;
  onOpenNewOrderForCustomer: (customer: Customer) => void;
  onOpenCommModal: (order?: OrderItem, customer?: Customer) => void;
  onOpenOrderDetails: (order: OrderItem) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onOpenNewCustomer,
  onOpenNewOrderForCustomer,
  onOpenCommModal,
  onOpenOrderDetails
}) => {
  const { customers, orders, updateCustomer } = useTailoring();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.contactNumber.includes(q) ||
      c.purokAddress.toLowerCase().includes(q)
    );
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || filteredCustomers[0];
  const customerOrders = orders.filter(o => o.customerId === selectedCustomer?.id);
  const totalCustomerSpend = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCustomerBalance = customerOrders.reduce((sum, o) => sum + o.balanceAmount, 0);

  const startEdit = () => {
    if (!selectedCustomer) return;
    setEditForm({
      fullName: selectedCustomer.fullName,
      contactNumber: selectedCustomer.contactNumber,
      email: selectedCustomer.email || '',
      purokAddress: selectedCustomer.purokAddress,
      notes: selectedCustomer.notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedCustomer) return;
    updateCustomer(selectedCustomer.id, editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Customer Directory (Suki Registry)
          </h1>
          <p className="text-xs text-neutral-500">
            Secure client directory with permanent body measurements and order histories
          </p>
        </div>

        <button
          onClick={onOpenNewCustomer}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Main Split: Customer List on Left (5 Cols) + Customer Dossier on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customer List & Search */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden flex flex-col max-h-[800px]">
          {/* Search Box */}
          <div className="p-3 border-b border-neutral-200 bg-neutral-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search suki by name, mobile, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="text-[11px] text-neutral-500 mt-1.5 flex items-center justify-between">
              <span>{filteredCustomers.length} registered customers</span>
              <span>Client Directory</span>
            </div>
          </div>

          {/* Customer Items */}
          <div className="divide-y divide-neutral-100 overflow-y-auto flex-1">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No matching customer found.
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;
                const cOrders = orders.filter(o => o.customerId === c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-100/90 border-l-2 border-neutral-900'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{c.contactNumber}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{c.purokAddress}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold text-neutral-700 bg-neutral-200/80 px-1.5 py-0.5 rounded">
                        {cOrders.length} {cOrders.length === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Customer Profile & History */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-6">
          {selectedCustomer ? (
            <>
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">
                      {selectedCustomer.fullName}
                    </h2>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Verified Suki
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-0.5 mt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-mono font-medium">{selectedCustomer.contactNumber}</span>
                      {selectedCustomer.email && (
                        <>
                          <span className="text-neutral-300">·</span>
                          <span>{selectedCustomer.email}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{selectedCustomer.purokAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenCommModal(undefined, selectedCustomer)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </button>
                  <button
                    onClick={() => onOpenNewOrderForCustomer(selectedCustomer)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Order</span>
                  </button>
                  <button
                    onClick={startEdit}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline Edit Form if triggered */}
              {isEditing && (
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-neutral-900">
                      Edit Customer Information
                    </h3>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.fullName || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={editForm.contactNumber || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                        className="w-full text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                        Address / Location
                      </label>
                      <input
                        type="text"
                        value={editForm.purokAddress || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, purokAddress: e.target.value }))}
                        className="w-full text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-xs text-neutral-600 hover:text-neutral-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 rounded hover:bg-neutral-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="text-[11px] text-neutral-500 block">Lifetime Orders</span>
                  <span className="text-base font-bold font-mono text-neutral-900">
                    {customerOrders.length}
                  </span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="text-[11px] text-neutral-500 block">Total Amount Spent</span>
                  <span className="text-base font-bold font-mono text-neutral-900">
                    ₱{totalCustomerSpend.toLocaleString()}
                  </span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="text-[11px] text-neutral-500 block">Current Balance</span>
                  <span className="text-base font-bold font-mono text-rose-600">
                    ₱{totalCustomerBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Saved Measurements Showcase */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider text-neutral-500">
                  Saved Body Measurements on File
                </h3>

                <div className="space-y-2">
                  {Object.entries(selectedCustomer.measurements)
                    .filter(([_, m]) => m !== undefined)
                    .map(([garment, measurements]) => {
                      if (!measurements) return null;
                      const meta = GARMENT_METADATA[garment];

                      return (
                        <div
                          key={garment}
                          className="bg-neutral-50/70 p-3.5 rounded-lg border border-neutral-200 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-900">
                              {meta?.label || garment} ({measurements.unit})
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              Measured: {measurements.measuredDate || 'On file'}
                            </span>
                          </div>

                          {/* Measurement Pills/Grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-[11px]">
                            {measurements.shoulder && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Balikat</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.shoulder}"</span>
                              </div>
                            )}
                            {(measurements.chest || measurements.bust) && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Dibdib</span>
                                <span className="font-mono font-bold text-neutral-800">
                                  {(measurements.chest || measurements.bust)}"
                                </span>
                              </div>
                            )}
                            {measurements.waist && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Baywang</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.waist}"</span>
                              </div>
                            )}
                            {measurements.sleeveLength && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Manggas</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.sleeveLength}"</span>
                              </div>
                            )}
                            {measurements.shirtLength && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Haba</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.shirtLength}"</span>
                              </div>
                            )}
                            {measurements.crotchRise && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Tiro</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.crotchRise}"</span>
                              </div>
                            )}
                            {measurements.outseam && (
                              <div className="bg-white p-1.5 rounded border border-neutral-200">
                                <span className="text-neutral-400 block text-[10px]">Haba Pantalon</span>
                                <span className="font-mono font-bold text-neutral-800">{measurements.outseam}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Order History List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider text-neutral-500">
                  Order History & Statuses
                </h3>

                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
                  {customerOrders.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      No orders recorded yet for this client.
                    </div>
                  ) : (
                    customerOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => onOpenOrderDetails(o)}
                        className="p-3 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-900">
                              {o.orderNumber}
                            </span>
                            <span className="capitalize font-medium text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded text-[10px]">
                              {o.status}
                            </span>
                          </div>
                          <div className="text-neutral-800 font-medium">
                            {o.garmentTitle}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            Ordered: {o.orderDate} · Due: {o.dueDate}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-neutral-900">
                            ₱{o.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-mono">
                            {o.balanceAmount > 0 ? (
                              <span className="text-rose-600 font-semibold">Bal: ₱{o.balanceAmount.toLocaleString()}</span>
                            ) : (
                              <span className="text-emerald-600">Fully Paid</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-neutral-400 text-xs">
              Select a customer from the left to view profile details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
