import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem } from '../types/tailoring';
import { X, DollarSign, Check, Smartphone, Banknote } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { updateOrderPayment } = useTailoring();

  const [paymentAmount, setPaymentAmount] = useState<number>(order?.balanceAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [cashTendered, setCashTendered] = useState<number>(order?.balanceAmount || 0);
  const [reference, setReference] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Re-sync when order changes
  React.useEffect(() => {
    if (order) {
      setPaymentAmount(order.balanceAmount);
      setCashTendered(order.balanceAmount);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const changeDue = Math.max(0, cashTendered - paymentAmount);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    updateOrderPayment(order.id, paymentAmount, paymentMethod, reference);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Record Payment Settlement
              </h2>
              <span className="text-[11px] text-neutral-500 font-mono">
                {order.orderNumber} · {order.customerName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRecordPayment} className="p-6 space-y-4 text-xs">
          {/* Balance Status Card */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-500 block">Total Contract: ₱{order.totalAmount.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-700 block">Previously Paid: ₱{order.depositAmount.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 block uppercase font-bold text-rose-600">Balance Due</span>
              <span className="text-lg font-bold font-mono text-rose-600">
                ₱{order.balanceAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Amount to Collect */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Payment Amount to Collect (₱)
            </label>
            <input
              type="number"
              min="1"
              max={order.balanceAmount}
              value={paymentAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setPaymentAmount(val);
                setCashTendered(val);
              }}
              className="w-full text-sm font-mono font-bold border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
            />
          </div>

          {/* Payment Channel */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-medium"
            >
              <option value="cash">Cash (Counter / Over the Counter)</option>
              <option value="gcash">GCash (0917-842-9102)</option>
              <option value="maya">Maya</option>
              <option value="bank_transfer">Bank Transfer (BDO)</option>
            </select>
          </div>

          {/* Cash Change Calculator */}
          {paymentMethod === 'cash' && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Cash Tendered (₱)
                  </label>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Change Due (Sukli)
                  </label>
                  <div className="w-full text-xs font-mono font-bold p-1.5 bg-white border border-neutral-200 rounded text-emerald-700">
                    ₱{changeDue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Non-cash reference code */}
          {paymentMethod !== 'cash' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Reference / Transaction Number
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. GCASH-REF-0912384"
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-mono"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={paymentAmount <= 0}
              className="px-4 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {success ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recorded!</span>
                </>
              ) : (
                <span>Confirm & Issue Receipt</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
