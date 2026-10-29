import React, { useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { GarmentCategory, GarmentMeasurements, Customer } from '../types/tailoring';
import { GARMENT_METADATA } from '../data/initialData';
import { 
  Scissors, 
  Save, 
  User, 
  Plus, 
  ArrowRight, 
  Check, 
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MeasurementsViewProps {
  onStartOrderWithMeasurements?: (customer: Customer, garmentType: GarmentCategory, measurements: GarmentMeasurements) => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({
  onStartOrderWithMeasurements
}) => {
  const { customers, updateCustomer } = useTailoring();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedGarment, setSelectedGarment] = useState<GarmentCategory>('barong_tagalog');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeMeasurementFocus, setActiveMeasurementFocus] = useState<string | null>(null);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Existing measurements for this customer & garment
  const existingMeasurements = selectedCustomer?.measurements[selectedGarment] || {
    unit: 'inches',
    neck: 16,
    shoulder: 18,
    chest: 40,
    waist: 34,
    armhole: 18.5,
    sleeveLength: 25,
    shirtLength: 30,
    hips: 39,
    crotchRise: 11,
    outseam: 40,
    inseam: 30,
    thigh: 24,
    knee: 17,
    bottomHem: 15
  };

  const [formValues, setFormValues] = useState<GarmentMeasurements>(existingMeasurements);

  // When customer or garment changes, reload values
  React.useEffect(() => {
    if (selectedCustomer) {
      const existing = selectedCustomer.measurements[selectedGarment];
      if (existing) {
        setFormValues(existing);
        setUnit(existing.unit || 'inches');
      } else {
        // Default template based on garment
        setFormValues({
          unit: 'inches',
          neck: selectedGarment.includes('barong') || selectedGarment.includes('polo') ? 16 : undefined,
          shoulder: 17.5,
          chest: 38,
          waist: 32,
          armhole: 18,
          sleeveLength: 24,
          shirtLength: 28,
          hips: 38,
          crotchRise: selectedGarment.includes('pants') ? 11 : undefined,
          outseam: selectedGarment.includes('pants') ? 39 : undefined,
          inseam: selectedGarment.includes('pants') ? 29 : undefined
        });
      }
    }
  }, [selectedCustomerId, selectedGarment]);

  const handleInputChange = (field: keyof GarmentMeasurements, val: string) => {
    const num = parseFloat(val);
    setFormValues(prev => ({
      ...prev,
      [field]: isNaN(num) ? undefined : num
    }));
  };

  const handleUnitToggle = (newUnit: 'inches' | 'cm') => {
    if (newUnit === unit) return;
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;

    const converted: GarmentMeasurements = {
      ...formValues,
      unit: newUnit,
      neck: formValues.neck ? Number((formValues.neck * factor).toFixed(1)) : undefined,
      shoulder: formValues.shoulder ? Number((formValues.shoulder * factor).toFixed(1)) : undefined,
      chest: formValues.chest ? Number((formValues.chest * factor).toFixed(1)) : undefined,
      bust: formValues.bust ? Number((formValues.bust * factor).toFixed(1)) : undefined,
      waist: formValues.waist ? Number((formValues.waist * factor).toFixed(1)) : undefined,
      hips: formValues.hips ? Number((formValues.hips * factor).toFixed(1)) : undefined,
      armhole: formValues.armhole ? Number((formValues.armhole * factor).toFixed(1)) : undefined,
      sleeveLength: formValues.sleeveLength ? Number((formValues.sleeveLength * factor).toFixed(1)) : undefined,
      shirtLength: formValues.shirtLength ? Number((formValues.shirtLength * factor).toFixed(1)) : undefined,
      crotchRise: formValues.crotchRise ? Number((formValues.crotchRise * factor).toFixed(1)) : undefined,
      thigh: formValues.thigh ? Number((formValues.thigh * factor).toFixed(1)) : undefined,
      knee: formValues.knee ? Number((formValues.knee * factor).toFixed(1)) : undefined,
      bottomHem: formValues.bottomHem ? Number((formValues.bottomHem * factor).toFixed(1)) : undefined,
      outseam: formValues.outseam ? Number((formValues.outseam * factor).toFixed(1)) : undefined,
      inseam: formValues.inseam ? Number((formValues.inseam * factor).toFixed(1)) : undefined
    };

    setUnit(newUnit);
    setFormValues(converted);
  };

  const handleSave = () => {
    if (!selectedCustomer) return;
    const today = new Date().toISOString().split('T')[0];

    const measurementsToSave: GarmentMeasurements = {
      ...formValues,
      unit,
      measuredDate: today
    };

    const updated = {
      ...selectedCustomer.measurements,
      [selectedGarment]: measurementsToSave
    };

    updateCustomer(selectedCustomer.id, { measurements: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Tagalog translation dictionary for master tailors
  const fieldGuides: Record<string, { tagalog: string; guide: string }> = {
    shoulder: {
      tagalog: 'Lapad ng Balikat',
      guide: 'Sukatin mula sa dulo ng kaliwang balikat hanggang sa dulo ng kanang balikat sa likod.'
    },
    chest: {
      tagalog: 'Pabilog ng Dibdib',
      guide: 'Sukatin paikot sa pinakamatambok na bahagi ng dibdib, magpasok ng dalawang daliri para sa luwag.'
    },
    waist: {
      tagalog: 'Pabilog ng Baywang',
      guide: 'Sukatin paikot sa natural na baywang (bandang pusod para sa barong, o bewang para sa pantalon).'
    },
    neck: {
      tagalog: 'Pabilog ng Leeg',
      guide: 'Sukatin paikot sa pinakababang bahagi ng leeg, may kalahating pulgadang allowance.'
    },
    armhole: {
      tagalog: 'Pabilog ng Braso / Kilikili',
      guide: 'Sukatin paikot sa kilikili pataas sa balikat upang komportable ang galaw.'
    },
    sleeveLength: {
      tagalog: 'Haba ng Manggas',
      guide: 'Mula sa buto ng balikat pababa sa pulso (long sleeve) o sa kalagitnaan ng braso (short sleeve).'
    },
    shirtLength: {
      tagalog: 'Haba ng Damit / Barong',
      guide: 'Mula sa tabi ng leeg (shoulder seam) pababa sa nais na laylayan ng Barong o polo.'
    },
    hips: {
      tagalog: 'Pabilog ng Balakang',
      guide: 'Sukatin paikot sa pinakamalapad na bahagi ng balakang o puwet.'
    },
    crotchRise: {
      tagalog: 'Tiro ng Pantalon',
      guide: 'Mula sa harapang sinturon, pababa sa pagitan ng mga hita hanggang sa likurang sinturon.'
    },
    outseam: {
      tagalog: 'Kabuuang Haba ng Pantalon',
      guide: 'Mula sa baywang o sinturon pababa sa bukana ng sapatos.'
    },
    thigh: {
      tagalog: 'Lapad ng Hita',
      guide: 'Sukatin paikot sa pinakamalaking parte ng hita, mag-iwan ng 1 pulgadang allowance.'
    },
    bottomHem: {
      tagalog: 'Bukana ng Pantalon / Laylayan',
      guide: 'Lapad ng laylayan sa ibaba (standard: 15-16 inches para sa straight cut slacks).'
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Centralized Customer Body Measurements Repository (Sukat)
          </h1>
          <p className="text-xs text-neutral-500">
            Eliminates re-measurement delays for returning clients. Preserves permanent fitting specs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => handleUnitToggle('inches')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                unit === 'inches'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Inches (Pulgada)
            </button>
            <button
              onClick={() => handleUnitToggle('cm')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                unit === 'cm'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved to Profile!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Measurements</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customer & Garment Selectors Bar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Active Customer Profile
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 font-medium focus:ring-1 focus:ring-neutral-900 focus:outline-none"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} — {c.purokAddress} ({c.contactNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Garment Template Pattern
          </label>
          <select
            value={selectedGarment}
            onChange={(e) => setSelectedGarment(e.target.value as GarmentCategory)}
            className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 font-medium focus:ring-1 focus:ring-neutral-900 focus:outline-none"
          >
            <option value="barong_tagalog">Barong Tagalog (Formal / Organza)</option>
            <option value="school_uniform">School Uniform (Polo & Pants / Skirt)</option>
            <option value="corporate_uniform">Corporate / Teacher Office Attire</option>
            <option value="pants_trousers">Trousers / Slacks / Pantalon</option>
            <option value="dress_gown">Filipiniana / Evening Gown / Dress</option>
            <option value="blazer_suit">Amerikana / Bespoke Suit</option>
            <option value="polo_shirt">Polo Barong / Casual Polo</option>
            <option value="alterations">Alterations & Adjustment Profile</option>
          </select>
        </div>
      </div>

      {/* Main Studio Grid: Form on Left + Visual Diagram & Tagalog Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                {GARMENT_METADATA[selectedGarment]?.label || selectedGarment} Specs
              </h2>
              <span className="text-xs text-neutral-500">
                Pang-itaas at Pang-ibaba na Sukat ({unit})
              </span>
            </div>

            {selectedCustomer && onStartOrderWithMeasurements && (
              <button
                type="button"
                onClick={() => onStartOrderWithMeasurements(selectedCustomer, selectedGarment, formValues)}
                className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1.5"
              >
                <span>Use for New Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upper Body Fields */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider text-neutral-500">
              Upper Garment Measurements (Pang-itaas)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'shoulder', label: 'Shoulder (Balikat)', defaultVal: formValues.shoulder },
                { key: 'chest', label: 'Chest / Bust (Dibdib)', defaultVal: formValues.chest || formValues.bust },
                { key: 'waist', label: 'Waist (Baywang)', defaultVal: formValues.waist },
                { key: 'neck', label: 'Neck (Leeg)', defaultVal: formValues.neck },
                { key: 'armhole', label: 'Armhole (Kilikili)', defaultVal: formValues.armhole },
                { key: 'sleeveLength', label: 'Sleeve (Manggas)', defaultVal: formValues.sleeveLength },
                { key: 'shirtLength', label: 'Length (Haba)', defaultVal: formValues.shirtLength },
                { key: 'bicep', label: 'Bicep (Braso)', defaultVal: formValues.bicep },
                { key: 'wristCuff', label: 'Wrist / Cuff (Pulso)', defaultVal: formValues.wristCuff },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-700 flex items-center justify-between">
                    <span>{field.label}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.25"
                      value={formValues[field.key as keyof GarmentMeasurements] as number || ''}
                      onFocus={() => setActiveMeasurementFocus(field.key)}
                      onChange={(e) => handleInputChange(field.key as keyof GarmentMeasurements, e.target.value)}
                      placeholder="0.0"
                      className="w-full text-xs font-mono font-semibold border border-neutral-300 rounded-lg p-2 bg-neutral-50/40 text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-mono">
                      {unit === 'inches' ? 'in' : 'cm'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Body Fields */}
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider text-neutral-500">
              Lower Garment & Trousers (Pang-ibaba)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'hips', label: 'Hips (Balakang)', defaultVal: formValues.hips },
                { key: 'crotchRise', label: 'Crotch / Rise (Tiro)', defaultVal: formValues.crotchRise },
                { key: 'outseam', label: 'Outseam (Kabuuang Haba)', defaultVal: formValues.outseam },
                { key: 'inseam', label: 'Inseam (Haba sa Loob)', defaultVal: formValues.inseam },
                { key: 'thigh', label: 'Thigh (Hita)', defaultVal: formValues.thigh },
                { key: 'bottomHem', label: 'Bottom Hem (Laylayan)', defaultVal: formValues.bottomHem }
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-700">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.25"
                      value={formValues[field.key as keyof GarmentMeasurements] as number || ''}
                      onFocus={() => setActiveMeasurementFocus(field.key)}
                      onChange={(e) => handleInputChange(field.key as keyof GarmentMeasurements, e.target.value)}
                      placeholder="0.0"
                      className="w-full text-xs font-mono font-semibold border border-neutral-300 rounded-lg p-2 bg-neutral-50/40 text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-mono">
                      {unit === 'inches' ? 'in' : 'cm'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Posture & Tailor Notes */}
          <div className="space-y-1 pt-3 border-t border-neutral-200">
            <label className="text-xs font-medium text-neutral-700">
              Tailor Fitting & Posture Notes (Paalala sa Tabas)
            </label>
            <textarea
              rows={2}
              value={formValues.notes || ''}
              onChange={(e) => setFormValues(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Sloping right shoulder by 0.5 in; prefers extra allowance on stomach; high-waisted pants"
              className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/40 text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Visual Mannequin & Instruction Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Authentic Workshop Photo card */}
          <div className="rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-900 h-44 shadow-xs">
            <img
              src="/src/assets/images/tailor_measuring_fabric_1793274385333.jpg"
              alt="Tailor with measuring tape in workshop"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                Precision Measurement Guide
              </span>
              <p className="text-xs text-neutral-200 leading-snug">
                Traditional Philippine tailoring standard measurements in inches with 0.25 allowance.
              </p>
            </div>
          </div>

          {/* Interactive Tagalog Measurement Helper */}
          <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
              <Info className="w-4 h-4 text-neutral-700" />
              <span>Giya sa Pagsusukat (Tailor's Reference)</span>
            </div>

            {activeMeasurementFocus && fieldGuides[activeMeasurementFocus] ? (
              <div className="bg-amber-50/80 p-3.5 rounded-lg border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-950 block capitalize">
                  {activeMeasurementFocus}: {fieldGuides[activeMeasurementFocus].tagalog}
                </span>
                <p className="text-amber-900/90 leading-relaxed text-[11px]">
                  {fieldGuides[activeMeasurementFocus].guide}
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">
                Click or focus any measurement field on the left to see the step-by-step Tagalog measuring instruction.
              </p>
            )}

            <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-800">Barong Tagalog Standard:</span>
                <span className="font-mono text-neutral-500">2-finger chest allowance</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-800">School Uniform Standard:</span>
                <span className="font-mono text-neutral-500">Growth allowance (+1 in)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-neutral-800">Slacks Crotch Rise (Tiro):</span>
                <span className="font-mono text-neutral-500">10-12 in depending on height</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
