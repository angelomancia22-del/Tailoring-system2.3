import React from 'react';
import { OrderItem } from '../types/tailoring';
import { useTailoring } from '../context/TailoringContext';
import { Printer, X, Download, Scissors, Check, QrCode } from 'lucide-react';

interface JobTicketPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
}

export const JobTicketPrintModal: React.FC<JobTicketPrintModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { shopSettings, getCustomerById } = useTailoring();

  if (!isOpen || !order) return null;

  const customer = getCustomerById(order.customerId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-neutral-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 bg-neutral-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">
              Printable Official Job Ticket & Claim Slip ({order.orderNumber})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Job Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-neutral-900 font-sans print:p-0 print:m-0">
          {/* Shop Header */}
          <div className="text-center pb-4 border-b-2 border-neutral-900 space-y-1">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs mb-1">
              <Scissors className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold uppercase tracking-tight text-neutral-900">
              {shopSettings.shopName}
            </h1>
            <p className="text-xs text-neutral-600">
              {shopSettings.barangay} · Tel: {shopSettings.contactNumber}
            </p>
            <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
              GCash: {shopSettings.gcashNumber} ({shopSettings.gcashAccountName})
            </div>
            <div className="inline-block mt-2 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded text-xs font-bold uppercase tracking-wider">
              Official Tailoring Job Ticket & Customer Claim Slip
            </div>
          </div>

          {/* Ticket Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">Order Number</span>
              <span className="font-mono font-bold text-sm text-neutral-900">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">Date Booked</span>
              <span className="font-mono text-neutral-800">{order.orderDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">Fitting Date</span>
              <span className="font-mono text-neutral-800">{order.fittingDate || 'To be notified'}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase font-bold text-rose-600">Due / Claim Date</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">{order.dueDate}</span>
            </div>
          </div>

          {/* Customer & Garment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-neutral-200 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Customer Information</span>
              <div className="font-bold text-sm text-neutral-900">{order.customerName}</div>
              <div className="font-mono text-neutral-700">Contact: {order.customerPhone}</div>
              <div className="text-neutral-600">Address: {customer?.purokAddress || 'Main Street, Central'}</div>
            </div>

            <div className="p-3 border border-neutral-200 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Garment & Fabric Details</span>
              <div className="font-bold text-neutral-900">{order.garmentTitle}</div>
              <div className="text-neutral-700">
                Quantity: <strong>{order.quantity} pcs</strong> · Priority: <strong className="uppercase">{order.priority}</strong>
              </div>
              <div className="text-neutral-600">
                Fabric: {order.fabricSource === 'customer_provided' ? 'Customer Provided' : 'Shop Stock'}
                {order.fabricNotes && ` (${order.fabricNotes})`}
              </div>
            </div>
          </div>

          {/* Tailor's Cutting Measurements Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Tailor's Precision Cutting Sheet (Mga Sukat - {order.measurements.unit})
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Cutter / Tailor: {order.assignedTailor || 'Master Ruben'}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs border border-neutral-300 rounded-lg p-3 bg-white">
              {order.measurements.shoulder && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Balikat (Shoulder)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.shoulder}"</span>
                </div>
              )}
              {(order.measurements.chest || order.measurements.bust) && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Dibdib (Chest/Bust)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    {(order.measurements.chest || order.measurements.bust)}"
                  </span>
                </div>
              )}
              {order.measurements.waist && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Baywang (Waist)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.waist}"</span>
                </div>
              )}
              {order.measurements.neck && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Leeg (Neck)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.neck}"</span>
                </div>
              )}
              {order.measurements.armhole && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Kilikili (Armhole)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.armhole}"</span>
                </div>
              )}
              {order.measurements.sleeveLength && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Manggas (Sleeve)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.sleeveLength}"</span>
                </div>
              )}
              {order.measurements.shirtLength && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Haba (Length)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.shirtLength}"</span>
                </div>
              )}
              {order.measurements.crotchRise && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Tiro (Crotch Rise)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.crotchRise}"</span>
                </div>
              )}
              {order.measurements.hips && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Balakang (Hips)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.hips}"</span>
                </div>
              )}
              {order.measurements.outseam && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Haba Pantalon</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.outseam}"</span>
                </div>
              )}
              {order.measurements.thigh && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Hita (Thigh)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.thigh}"</span>
                </div>
              )}
              {order.measurements.bottomHem && (
                <div className="text-center p-1.5 border border-neutral-200 rounded">
                  <span className="text-[10px] text-neutral-500 block">Bukana (Bottom)</span>
                  <span className="font-mono font-bold text-sm text-neutral-900">{order.measurements.bottomHem}"</span>
                </div>
              )}
            </div>

            {order.specialInstructions && (
              <div className="p-2.5 bg-neutral-100 rounded text-xs border border-neutral-200 text-neutral-800">
                <strong>Special Instructions:</strong> {order.specialInstructions}
              </div>
            )}
          </div>

          {/* Payment Statement */}
          <div className="p-4 border border-neutral-300 rounded-lg bg-neutral-50 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 font-semibold">
              <span>Payment Statement & Financial Record</span>
              <span className="capitalize text-neutral-700">Mode: {order.paymentMethod}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">Total Contract Price</span>
                <span className="font-mono font-bold text-sm text-neutral-900">₱{order.totalAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase text-emerald-700">Downpayment Paid</span>
                <span className="font-mono font-bold text-sm text-emerald-700">₱{order.depositAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase text-rose-600 font-bold">Remaining Balance Due</span>
                <span className="font-mono font-bold text-base text-rose-600">₱{order.balanceAmount.toLocaleString()}</span>
              </div>
            </div>

            {order.paymentReference && (
              <div className="text-[11px] text-neutral-500 text-center font-mono">
                Transaction Ref: {order.paymentReference}
              </div>
            )}
          </div>

          {/* Tear-off dotted separator for Customer Claim Stub */}
          <div className="relative my-4 border-t-2 border-dashed border-neutral-400 text-center">
            <span className="bg-white px-3 text-[10px] font-mono uppercase text-neutral-500 tracking-widest relative -top-2.5">
              ✂ Cut along dotted line · Resibo at Claim Stub para sa Kostumer ✂
            </span>
          </div>

          {/* Customer Claim Stub */}
          <div className="p-4 border border-neutral-900 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm">{shopSettings.shopName}</span>
                <span className="text-[11px] text-neutral-500 block">Customer Claim Slip</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-neutral-900">{order.orderNumber}</span>
                <span className="text-[10px] text-neutral-500 block">Due Date: {order.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-neutral-700 pt-1">
              <span>Customer: <strong>{order.customerName}</strong></span>
              <span>Balance to pay upon pickup: <strong className="text-rose-600 font-mono text-sm">₱{order.balanceAmount.toLocaleString()}</strong></span>
            </div>

            <p className="text-[10px] text-neutral-500 leading-tight pt-1">
              Paunawa: Ipakita ang resibong ito bago kunin ang damit. Ang hindi nakukuhang kasuotan matapos ang 60 araw ay mapapasailalim sa polisiya ng shop. Maraming salamat sa inyong pagtangkilik!
            </p>

            <div className="flex justify-between items-end pt-3 text-[10px] text-neutral-600">
              <div>
                Authorized Tailor Signature: ______________________
              </div>
              <div>
                Customer Received Signature: ______________________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
