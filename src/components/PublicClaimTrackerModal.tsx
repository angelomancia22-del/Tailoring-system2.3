import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem } from '../types/tailoring';
import { 
  Search, 
  X, 
  Scissors, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PublicClaimTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicClaimTrackerModal: React.FC<PublicClaimTrackerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { orders, shopSettings } = useTailoring();
  const [query, setQuery] = useState<string>('ORD-2026-001');
  const [matchedOrder, setMatchedOrder] = useState<OrderItem | null>(() => {
    return orders.find(o => o.orderNumber === 'ORD-2026-001') || orders[0] || null;
  });
  const [searched, setSearched] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const clean = query.trim().toLowerCase();
    const found = orders.find(
      o => o.orderNumber.toLowerCase() === clean || o.customerPhone.includes(clean)
    );
    setMatchedOrder(found || null);
    setSearched(true);
  };

  const stages = [
    { key: 'placed', label: 'Tala (Placed)' },
    { key: 'cutting', label: 'Tabas (Cutting)' },
    { key: 'fitting', label: 'Sukat (Fitting)' },
    { key: 'sewing', label: 'Tahi (Sewing)' },
    { key: 'ready', label: 'Handa na (Ready)' },
    { key: 'claimed', label: 'Nakuha na (Claimed)' }
  ];

  const currentStageIndex = matchedOrder
    ? stages.findIndex(s => s.key === matchedOrder.status)
    : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-neutral-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-900 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                Customer Claim & Order Progress Tracker
              </h2>
              <span className="text-[11px] text-neutral-300">
                Customer Online Self-Service Portal
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-800">
              Enter Order Number or Registered Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. ORD-2026-001 or 09175551234"
                className="flex-1 text-xs border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs"
              >
                Track Garment
              </button>
            </div>
          </form>

          {/* Results Display */}
          {matchedOrder ? (
            <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50/70 space-y-5">
              {/* Order summary header */}
              <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {matchedOrder.orderNumber}
                    </span>
                    <span className="capitalize text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {matchedOrder.status === 'ready' ? 'Ready for Pickup!' : matchedOrder.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-800 mt-1">
                    {matchedOrder.garmentTitle}
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Customer: {matchedOrder.customerName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block">Due / Pickup Date</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    {matchedOrder.dueDate}
                  </span>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Tailoring Production Progress
                </span>

                <div className="relative flex items-center justify-between text-center pt-2">
                  {/* Progress Line */}
                  <div className="absolute left-4 right-4 top-5 h-1 bg-neutral-200 -z-0">
                    <div
                      className="h-full bg-neutral-900 transition-all duration-300"
                      style={{
                        width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%`
                      }}
                    />
                  </div>

                  {stages.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex flex-col items-center z-10 w-16">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-neutral-900 text-white'
                              : 'bg-white border-2 border-neutral-300 text-neutral-400'
                          } ${isCurrent ? 'ring-2 ring-amber-400 scale-110' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-1.5 leading-tight ${isCurrent ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>
                          {stage.label.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Contract Price: ₱{matchedOrder.totalAmount.toLocaleString()}</span>
                  <span className="text-emerald-700 font-medium text-[11px]">Downpayment: ₱{matchedOrder.depositAmount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold text-rose-600">
                    Balance Upon Pickup
                  </span>
                  <span className="text-base font-bold font-mono text-rose-600">
                    ₱{matchedOrder.balanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Atelier contact & pickup location */}
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{shopSettings.barangay}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{shopSettings.contactNumber}</span>
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-300 rounded-xl">
              <AlertCircle className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
              <p>No active order found with identifier "{query}".</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Please verify your Official Claim Slip number (e.g. ORD-2026-001) or call {shopSettings.contactNumber}.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
