import React, { useState, useEffect } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { Customer, GarmentCategory, GarmentMeasurements, OrderItem, OrderPriority, PaymentMethod } from '../types/tailoring';
import { GARMENT_METADATA } from '../data/initialData';
import { X, Check, Plus, UserPlus, Scissors, Calendar, DollarSign } from 'lucide-react';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCustomer?: Customer | null;
  preSelectedGarment?: GarmentCategory;
  preSelectedMeasurements?: GarmentMeasurements;
  onOrderCreated?: (order: OrderItem) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  preSelectedCustomer,
  preSelectedGarment,
  preSelectedMeasurements,
  onOrderCreated
}) => {
  const { customers, addCustomer, addOrder } = useTailoring();

  const [step, setStep] = useState<number>(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preSelectedCustomer?.id || (customers[0]?.id || '')
  );

  // Quick Customer Creation inline
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('09');
  const [newCustAddress, setNewCustAddress] = useState<string>('Purok 1, Central District');

  // Garment Details
  const [garmentCategory, setGarmentCategory] = useState<GarmentCategory>(
    preSelectedGarment || 'barong_tagalog'
  );
  const [garmentTitle, setGarmentTitle] = useState<string>('Traditional Barong Tagalog (Custom Cut)');
  const [quantity, setQuantity] = useState<number>(1);
  const [fabricSource, setFabricSource] = useState<'customer_provided' | 'shop_inventory'>('shop_inventory');
  const [fabricNotes, setFabricNotes] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [priority, setPriority] = useState<OrderPriority>('regular');
  const [assignedTailor, setAssignedTailor] = useState<string>('Mang Ruben (Master)');

  // Dates
  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultFittingDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [dueDate, setDueDate] = useState<string>(defaultDueDate);
  const [fittingDate, setFittingDate] = useState<string>(defaultFittingDate);

  // Financials
  const [unitPrice, setUnitPrice] = useState<number>(GARMENT_METADATA.barong_tagalog.defaultPrice);
  const [depositAmount, setDepositAmount] = useState<number>(Math.round(GARMENT_METADATA.barong_tagalog.defaultPrice * 0.5));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentReference, setPaymentReference] = useState<string>('');

  // Measurements
  const [measurements, setMeasurements] = useState<GarmentMeasurements>({
    unit: 'inches',
    neck: 16.5,
    shoulder: 18,
    chest: 40,
    waist: 34,
    armhole: 18.5,
    sleeveLength: 25,
    shirtLength: 30
  });

  // Calculate totals
  const totalAmount = unitPrice * quantity;
  const balanceAmount = Math.max(0, totalAmount - depositAmount);

  // Sync customer measurements when customer or garment changes
  useEffect(() => {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (cust) {
      const saved = cust.measurements[garmentCategory];
      if (saved) {
        setMeasurements(saved);
      }
    }
  }, [selectedCustomerId, garmentCategory, customers]);

  // Adjust defaults when garment category changes
  useEffect(() => {
    const meta = GARMENT_METADATA[garmentCategory];
    if (meta) {
      setUnitPrice(meta.defaultPrice);
      setDepositAmount(Math.round(meta.defaultPrice * 0.5));
      setGarmentTitle(`${meta.label} (Custom Fit)`);
      const days = meta.estimatedDays || 10;
      setDueDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setFittingDate(new Date(Date.now() + Math.round(days / 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [garmentCategory]);

  if (!isOpen) return null;

  const handleCreateCustomerQuick = () => {
    if (!newCustName.trim()) return;
    const created = addCustomer({
      fullName: newCustName,
      contactNumber: newCustPhone,
      purokAddress: newCustAddress,
      measurements: {
        barong_tagalog: undefined,
        polo_shirt: undefined,
        school_uniform: undefined,
        corporate_uniform: undefined,
        pants_trousers: undefined,
        dress_gown: undefined,
        blazer_suit: undefined,
        alterations: undefined
      }
    });
    setSelectedCustomerId(created.id);
    setIsCreatingNewCustomer(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    const paymentStatus = balanceAmount === 0 ? 'paid' : depositAmount > 0 ? 'partial' : 'unpaid';

    const newOrder = addOrder({
      customerId: cust.id,
      customerName: cust.fullName,
      customerPhone: cust.contactNumber,
      garmentCategory,
      garmentTitle,
      quantity,
      fabricSource,
      fabricNotes,
      measurements,
      status: 'placed',
      priority,
      orderDate: today,
      dueDate,
      fittingDate,
      assignedTailor,
      unitPrice,
      totalAmount,
      depositAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod,
      paymentReference,
      specialInstructions
    });

    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Record New Customer Tailoring Order
              </h2>
              <p className="text-xs text-neutral-500">
                Book job, assign fitting & delivery dates, and record downpayment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-3 border-b border-neutral-200 text-xs font-semibold text-center bg-white">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2.5 border-b-2 transition-colors ${
              step === 1 ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400'
            }`}
          >
            1. Customer & Garment
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2.5 border-b-2 transition-colors ${
              step === 2 ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400'
            }`}
          >
            2. Sukat / Measurements
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-2.5 border-b-2 transition-colors ${
              step === 3 ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400'
            }`}
          >
            3. Pricing & Downpayment
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Customer & Garment */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Customer Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-800">
                    Customer (Suki)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewCustomer(!isCreatingNewCustomer)}
                    className="text-[11px] font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>{isCreatingNewCustomer ? 'Select Existing Suki' : '+ Quick Register New Customer'}</span>
                  </button>
                </div>

                {isCreatingNewCustomer ? (
                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-300 space-y-2.5">
                    <span className="text-xs font-bold text-neutral-900 block">
                      Quick Register Customer
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Customer Full Name *"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        className="text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Mobile (09XX-XXX-XXXX) *"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Customer Address / Location"
                        value={newCustAddress}
                        onChange={(e) => setNewCustAddress(e.target.value)}
                        className="text-xs border border-neutral-300 rounded p-1.5 bg-white text-neutral-900 sm:col-span-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateCustomerQuick}
                      disabled={!newCustName.trim()}
                      className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 rounded disabled:opacity-50"
                    >
                      Save & Select Customer
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.contactNumber}) — {c.purokAddress}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Garment Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Garment Category
                  </label>
                  <select
                    value={garmentCategory}
                    onChange={(e) => setGarmentCategory(e.target.value as GarmentCategory)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-medium"
                  >
                    <option value="barong_tagalog">Barong Tagalog</option>
                    <option value="school_uniform">School Uniform</option>
                    <option value="corporate_uniform">Corporate / Teacher Uniform</option>
                    <option value="pants_trousers">Pants & Trousers (Slacks)</option>
                    <option value="dress_gown">Dress & Gown</option>
                    <option value="blazer_suit">Suit & Blazer</option>
                    <option value="polo_shirt">Polo Shirt</option>
                    <option value="alterations">Alterations & Repairs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Garment Item Description
                  </label>
                  <input
                    type="text"
                    value={garmentTitle}
                    onChange={(e) => setGarmentTitle(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                    placeholder="e.g. Piña Cocoon Barong Tagalog (U-pechera)"
                  />
                </div>
              </div>

              {/* Fabric Source & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Fabric Origin
                  </label>
                  <select
                    value={fabricSource}
                    onChange={(e) => setFabricSource(e.target.value as any)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                  >
                    <option value="shop_inventory">Shop Inventory Fabric</option>
                    <option value="customer_provided">Customer Provided Fabric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Quantity (Pcs/Sets)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as OrderPriority)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                  >
                    <option value="regular">Regular Priority</option>
                    <option value="rush">Rush (3-5 Days)</option>
                    <option value="urgent">Urgent / Event Due</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Fabric Type & Color Notes
                </label>
                <input
                  type="text"
                  value={fabricNotes}
                  onChange={(e) => setFabricNotes(e.target.value)}
                  placeholder="e.g. 4 yards tetoron cotton ivory white; includes gold buttons"
                  className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Special Tailoring Instructions
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Needs interior pocket for teacher ID; double stitch crotch for durability"
                  className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Body Measurements */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">
                    Cutting Measurements ({measurements.unit || 'inches'})
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Preloaded from {customers.find(c => c.id === selectedCustomerId)?.fullName}'s profile
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { key: 'shoulder', label: 'Balikat (Shoulder)' },
                  { key: 'chest', label: 'Dibdib (Chest/Bust)' },
                  { key: 'waist', label: 'Baywang (Waist)' },
                  { key: 'neck', label: 'Leeg (Neck)' },
                  { key: 'armhole', label: 'Kilikili (Armhole)' },
                  { key: 'sleeveLength', label: 'Manggas (Sleeve)' },
                  { key: 'shirtLength', label: 'Haba (Length)' },
                  { key: 'hips', label: 'Balakang (Hips)' },
                  { key: 'crotchRise', label: 'Tiro (Crotch)' },
                  { key: 'outseam', label: 'Haba Pantalon (Outseam)' },
                  { key: 'thigh', label: 'Hita (Thigh)' },
                  { key: 'bottomHem', label: 'Bukana (Bottom)' }
                ].map((f) => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-700">
                      {f.label}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={measurements[f.key as keyof GarmentMeasurements] as number || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMeasurements(prev => ({ ...prev, [f.key]: isNaN(val) ? undefined : val }));
                      }}
                      placeholder="0.0"
                      className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Dates, Pricing & Downpayment */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Due Date & Fitting Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Target Fitting Date (Basting)
                  </label>
                  <input
                    type="date"
                    value={fittingDate}
                    onChange={(e) => setFittingDate(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-700 mb-1">
                    Promised Due Date / Claim Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-rose-300 rounded-lg p-2 bg-white text-neutral-900 font-semibold"
                  />
                </div>
              </div>

              {/* Tailor Assigned */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Assigned Master Tailor / Cutter
                </label>
                <select
                  value={assignedTailor}
                  onChange={(e) => setAssignedTailor(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                >
                  <option value="Mang Ruben (Master)">Mang Ruben (Master Tailor)</option>
                  <option value="Aling Tessie (Senior Dressmaker)">Aling Tessie (Senior Dressmaker)</option>
                  <option value="Kuya Jun (Cutter)">Kuya Jun (Cutter)</option>
                </select>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-300 space-y-3">
                <span className="text-xs font-bold text-neutral-900 block uppercase tracking-wider">
                  Payment Computation (Philippine Peso ₱)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Unit Price (₱)
                    </label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Total Order Amount (₱)
                    </label>
                    <div className="w-full text-sm font-mono font-bold p-1.5 bg-white border border-neutral-300 rounded text-neutral-900">
                      ₱{totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-emerald-800 mb-1">
                      Downpayment Received (₱)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-mono font-bold border border-emerald-400 rounded p-1.5 bg-white text-emerald-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <span className="text-xs font-semibold text-neutral-700">Remaining Balance Due Upon Pickup:</span>
                  <span className="font-mono font-bold text-base text-rose-600">
                    ₱{balanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method & Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
                  >
                    <option value="cash">Cash (Counter)</option>
                    <option value="gcash">GCash (0917-842-9102)</option>
                    <option value="maya">Maya</option>
                    <option value="bank_transfer">Bank Transfer (BDO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Reference Code / Receipt # (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g. GCASH-1928471"
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation between steps */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
              >
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
              >
                Next: {step === 1 ? 'Sukat / Measurements' : 'Pricing & Deposit'}
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Book Order & Print Claim Slip</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
