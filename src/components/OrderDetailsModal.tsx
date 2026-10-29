import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem, OrderStatus } from '../types/tailoring';
import { 
  X, 
  Printer, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  History, 
  Scissors, 
  Send 
} from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
  onOpenPrintSlip: (order: OrderItem) => void;
  onOpenCommModal: (order: OrderItem) => void;
  onOpenPaymentModal: (order: OrderItem) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenPrintSlip,
  onOpenCommModal,
  onOpenPaymentModal
}) => {
  const { updateOrderStatus, getCustomerById } = useTailoring();
  const [newStatusNote, setNewStatusNote] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'placed');

  if (!isOpen || !order) return null;

  const customer = getCustomerById(order.customerId);

  const handleUpdateStatus = () => {
    updateOrderStatus(order.id, selectedStatus, newStatusNote);
    setNewStatusNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-neutral-900">{order.orderNumber}</span>
                <span className="capitalize text-[10px] font-bold text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {order.customerName} · Due: {order.dueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintSlip(order)}
              title="Print Job Slip & Claim Ticket"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenCommModal(order)}
              title="Send SMS"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Quick Financial Summary */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">Total Contract</span>
              <span className="font-mono font-bold text-sm text-neutral-900">₱{order.totalAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase text-emerald-700">Downpayment Paid</span>
              <span className="font-mono font-bold text-sm text-emerald-700">₱{order.depositAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase text-rose-600 font-bold">Remaining Balance</span>
              <span className="font-mono font-bold text-sm text-rose-600">₱{order.balanceAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Garment Details & Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Garment Title</span>
              <div className="font-bold text-neutral-900">{order.garmentTitle}</div>
              <div className="text-neutral-600">
                Quantity: {order.quantity} · Fabric: {order.fabricSource === 'customer_provided' ? 'Customer Fabric' : 'Shop Stock'}
              </div>
              {order.fabricNotes && <div className="text-neutral-500 italic">Notes: {order.fabricNotes}</div>}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Customer Contact</span>
              <div className="font-bold text-neutral-900">{order.customerName}</div>
              <div className="font-mono text-neutral-700">{order.customerPhone}</div>
              <div className="text-neutral-600">{customer?.purokAddress || 'Barangay Bagong Bayan 1'}</div>
            </div>
          </div>

          {/* Measurements on File for this order */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">
              Cutting Measurements ({order.measurements.unit})
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              {order.measurements.shoulder && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Balikat</span>
                  <span className="font-mono font-bold text-neutral-800">{order.measurements.shoulder}"</span>
                </div>
              )}
              {(order.measurements.chest || order.measurements.bust) && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Dibdib</span>
                  <span className="font-mono font-bold text-neutral-800">
                    {(order.measurements.chest || order.measurements.bust)}"
                  </span>
                </div>
              )}
              {order.measurements.waist && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Baywang</span>
                  <span className="font-mono font-bold text-neutral-800">{order.measurements.waist}"</span>
                </div>
              )}
              {order.measurements.sleeveLength && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Manggas</span>
                  <span className="font-mono font-bold text-neutral-800">{order.measurements.sleeveLength}"</span>
                </div>
              )}
              {order.measurements.shirtLength && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Haba</span>
                  <span className="font-mono font-bold text-neutral-800">{order.measurements.shirtLength}"</span>
                </div>
              )}
              {order.measurements.crotchRise && (
                <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Tiro</span>
                  <span className="font-mono font-bold text-neutral-800">{order.measurements.crotchRise}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Update Stage Form */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <span className="text-xs font-bold text-neutral-900 block">
              Advance Production Stage
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-800 font-semibold"
              >
                <option value="placed">Order Placed (Tala)</option>
                <option value="cutting">Cutting (Tabas)</option>
                <option value="fitting">Fitting Scheduled (Sukat)</option>
                <option value="sewing">Sewing & Assembly (Tahi)</option>
                <option value="ready">Ready for Pickup (Handa na)</option>
                <option value="claimed">Claimed (Nakuha na)</option>
              </select>

              <input
                type="text"
                placeholder="Audit note (e.g. Sleeves stitched, basted fitting done)..."
                value={newStatusNote}
                onChange={(e) => setNewStatusNote(e.target.value)}
                className="flex-1 text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
              />

              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded shrink-0"
              >
                Update Stage
              </button>
            </div>
          </div>

          {/* Audit Trail Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <span>Production Milestones & History Log</span>
            </div>

            <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100 overflow-hidden">
              {order.statusHistory.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-start justify-between gap-3 text-[11px] bg-white">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-bold text-neutral-900">{item.status}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-600">By {item.updatedBy}</span>
                    </div>
                    {item.note && <div className="text-neutral-500">{item.note}</div>}
                  </div>
                  <span className="font-mono text-neutral-400 shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={() => onOpenPaymentModal(order)}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Settle Payment</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
