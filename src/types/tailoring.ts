export type GarmentCategory =
  | 'barong_tagalog'
  | 'polo_shirt'
  | 'school_uniform'
  | 'corporate_uniform'
  | 'pants_trousers'
  | 'dress_gown'
  | 'blazer_suit'
  | 'alterations';

export type OrderStatus =
  | 'placed'
  | 'cutting'
  | 'fitting'
  | 'sewing'
  | 'finishing'
  | 'ready'
  | 'claimed';

export type OrderPriority = 'regular' | 'rush' | 'urgent';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export type PaymentMethod = 'cash' | 'gcash' | 'maya' | 'bank_transfer';

export type UserRole = 'owner' | 'tailor' | 'cashier' | 'customer';

export type MeasurementUnit = 'inches' | 'cm';

export interface GarmentMeasurements {
  unit: MeasurementUnit;
  // Upper body
  neck?: number;
  shoulder?: number; // Balikat
  chest?: number; // Dibdib
  bust?: number;
  waist?: number; // Baywang
  armhole?: number; // Pabilog ng braso
  sleeveLength?: number; // Haba ng manggas
  bicep?: number;
  wristCuff?: number;
  shirtLength?: number; // Haba ng damit / Barong
  frontChest?: number;
  backWidth?: number;

  // Lower body
  hips?: number; // Balakang
  crotchRise?: number; // Tiro
  thigh?: number; // Lapad ng hita
  knee?: number; // Tuhod
  bottomHem?: number; // Bukana ng pantalon / Laylayan
  inseam?: number; // Haba sa loob
  outseam?: number; // Kabuuang haba ng pantalon

  // Dress & Gown
  shoulderToWaist?: number;
  apexHeight?: number;
  apexDistance?: number;
  skirtLength?: number;
  slitHeight?: number;

  // Extra notes
  notes?: string;
  measuredDate?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  contactNumber: string;
  email?: string;
  purokAddress: string; // e.g., "Purok 3, Barangay Bagong Bayan 1"
  gender?: 'male' | 'female' | 'other';
  notes?: string;
  measurements: Record<GarmentCategory, GarmentMeasurements | undefined>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string; // e.g. BBB1-2026-001
  customerId: string;
  customerName: string;
  customerPhone: string;
  garmentCategory: GarmentCategory;
  garmentTitle: string; // e.g., "Piña-Organza Barong Tagalog (Hand Embroidered)"
  quantity: number;
  fabricSource: 'customer_provided' | 'shop_inventory';
  fabricNotes?: string;
  measurements: GarmentMeasurements;
  status: OrderStatus;
  priority: OrderPriority;
  orderDate: string; // YYYY-MM-DD
  fittingDate?: string;
  dueDate: string;
  claimedDate?: string;
  assignedTailor?: string;
  
  // Financials
  unitPrice: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string; // GCash ref or receipt #
  
  specialInstructions?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }[];
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  barangay: string;
  contactNumber: string;
  gcashNumber: string;
  gcashAccountName: string;
  termsAndConditions: string;
}

export interface ISOEvaluationCategory {
  name: string;
  description: string;
  score: number; // 1 to 5 scale
  feedback?: string;
}

export interface SystemEvaluationReport {
  respondentType: 'Shop Owner' | 'Head Tailor' | 'Tailor Apprentice' | 'Customer';
  respondentName: string;
  date: string;
  ratings: {
    functionalSuitability: number;
    performanceEfficiency: number;
    usability: number;
    reliability: number;
    security: number;
  };
  comments: string;
}
