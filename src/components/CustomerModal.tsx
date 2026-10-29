import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { GarmentCategory, GarmentMeasurements } from '../types/tailoring';
import { X, UserPlus, Check } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated?: (customerId: string) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated
}) => {
  const { addCustomer } = useTailoring();

  const [fullName, setFullName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('09');
  const [email, setEmail] = useState<string>('');
  const [purokAddress, setPurokAddress] = useState<string>('Purok 1, Central District');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [notes, setNotes] = useState<string>('');
  const [initialGarment, setInitialGarment] = useState<GarmentCategory>('barong_tagalog');

  // Initial basic measurements
  const [measurements, setMeasurements] = useState<GarmentMeasurements>({
    unit: 'inches',
    shoulder: 18,
    chest: 40,
    waist: 34,
    neck: 16.5,
    sleeveLength: 25,
    shirtLength: 30
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newCust = addCustomer({
      fullName,
      contactNumber,
      email: email || undefined,
      purokAddress,
      gender,
      notes,
      measurements: {
        barong_tagalog: initialGarment === 'barong_tagalog' ? measurements : undefined,
        polo_shirt: initialGarment === 'polo_shirt' ? measurements : undefined,
        school_uniform: initialGarment === 'school_uniform' ? measurements : undefined,
        corporate_uniform: initialGarment === 'corporate_uniform' ? measurements : undefined,
        pants_trousers: initialGarment === 'pants_trousers' ? measurements : undefined,
        dress_gown: initialGarment === 'dress_gown' ? measurements : undefined,
        blazer_suit: initialGarment === 'blazer_suit' ? measurements : undefined,
        alterations: initialGarment === 'alterations' ? measurements : undefined
      }
    });

    if (onCustomerCreated) {
      onCustomerCreated(newCust.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Register New Customer (Suki)
              </h2>
              <p className="text-xs text-neutral-500">
                Customer profile & body measurements record
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kapitan Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Mobile Number (PH) *
              </label>
              <input
                type="text"
                required
                placeholder="0917-XXX-XXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="juan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Purok / Street / Address
              </label>
              <input
                type="text"
                value={purokAddress}
                onChange={(e) => setPurokAddress(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
              />
            </div>
          </div>

          {/* Initial Measurements Entry */}
          <div className="pt-3 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Initial Body Measurements (Sukat)
              </span>
              <select
                value={initialGarment}
                onChange={(e) => setInitialGarment(e.target.value as GarmentCategory)}
                className="text-xs border border-neutral-300 rounded p-1 bg-white text-neutral-800"
              >
                <option value="barong_tagalog">Barong Tagalog</option>
                <option value="school_uniform">School Uniform</option>
                <option value="corporate_uniform">Corporate / Office</option>
                <option value="pants_trousers">Pants / Slacks</option>
                <option value="dress_gown">Dress / Gown</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-neutral-600 mb-0.5">Balikat (Shoulder)</label>
                <input
                  type="number"
                  step="0.25"
                  value={measurements.shoulder || ''}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, shoulder: parseFloat(e.target.value) }))}
                  className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 mb-0.5">Dibdib (Chest)</label>
                <input
                  type="number"
                  step="0.25"
                  value={measurements.chest || ''}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, chest: parseFloat(e.target.value) }))}
                  className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 mb-0.5">Baywang (Waist)</label>
                <input
                  type="number"
                  step="0.25"
                  value={measurements.waist || ''}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, waist: parseFloat(e.target.value) }))}
                  className="w-full text-xs font-mono font-bold border border-neutral-300 rounded p-1.5 bg-white text-neutral-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Customer Notes / Fit Preference
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Suki since 2024; likes longer cuffs"
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
            >
              Save Customer Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
