import { Customer, OrderItem, ShopSettings, SystemEvaluationReport } from '../types/tailoring';

export const INITIAL_SHOP_SETTINGS: ShopSettings = {
  shopName: "Master Stitch Tailoring & Barong Atelier",
  tagline: "Custom Tailoring, Uniforms & Formal Garment Specialists",
  barangay: "Main Workshop & Central Atelier",
  contactNumber: "(+63) 917 842 9102",
  gcashNumber: "0917-842-9102",
  gcashAccountName: "Ruben Dela Cruz (Master Tailor)",
  termsAndConditions: "A minimum of 50% downpayment is required before cutting fabric. Claim within 60 days of completion notification. All garments are checked for fitting and quality before release."
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    fullName: "Hon. Roberto 'Berting' Santos",
    contactNumber: "09175551234",
    email: "roberto.santos@email.ph",
    purokAddress: "Purok 2 (Near District Hall), Central District",
    gender: "male",
    notes: "Councilor. Prefers loose traditional cut for Barong Tagalog with embroidered collar.",
    measurements: {
      barong_tagalog: {
        unit: "inches",
        neck: 16.5,
        shoulder: 18.5,
        chest: 42,
        waist: 38,
        armhole: 19.5,
        sleeveLength: 25,
        bicep: 14.5,
        wristCuff: 9.5,
        shirtLength: 31,
        frontChest: 16,
        backWidth: 17.5,
        measuredDate: "2026-10-15",
        notes: "Gusot Mayaman / Piña Organza fabric with lining."
      },
      pants_trousers: {
        unit: "inches",
        waist: 38,
        hips: 43,
        crotchRise: 11.5,
        thigh: 25,
        knee: 18.5,
        bottomHem: 16,
        outseam: 40.5,
        inseam: 29.5,
        measuredDate: "2026-10-15",
        notes: "Straight cut black slacks with double pleats."
      },
      polo_shirt: undefined,
      school_uniform: undefined,
      corporate_uniform: undefined,
      dress_gown: undefined,
      blazer_suit: undefined,
      alterations: undefined
    },
    createdAt: "2026-09-10",
    updatedAt: "2026-10-15"
  },
  {
    id: "cust-002",
    fullName: "Maria Clara D. Fernandez",
    contactNumber: "09285558912",
    email: "clara.fernandez@deped.edu.ph",
    purokAddress: "Purok 4, Riverside Avenue",
    gender: "female",
    notes: "Teacher at Central Elementary. Needs DepEd teacher formal blouse and matching skirt.",
    measurements: {
      corporate_uniform: {
        unit: "inches",
        neck: 14,
        shoulder: 15.5,
        bust: 36,
        waist: 29,
        hips: 38,
        armhole: 16.5,
        sleeveLength: 17,
        shirtLength: 24,
        measuredDate: "2026-10-18",
        notes: "3/4 sleeve tailored blazer with mandarin collar."
      },
      dress_gown: {
        unit: "inches",
        shoulder: 15.5,
        bust: 36,
        waist: 28.5,
        hips: 38,
        shoulderToWaist: 15,
        apexHeight: 9.5,
        apexDistance: 7.5,
        skirtLength: 38,
        measuredDate: "2026-09-20",
        notes: "Floor length modern Filipiniana evening gown."
      },
      barong_tagalog: undefined,
      polo_shirt: undefined,
      school_uniform: undefined,
      pants_trousers: undefined,
      blazer_suit: undefined,
      alterations: undefined
    },
    createdAt: "2026-09-20",
    updatedAt: "2026-10-18"
  },
  {
    id: "cust-003",
    fullName: "Mark Jayson 'MJ' Alcantara",
    contactNumber: "09951114477",
    email: "mj.alcantara@gmail.com",
    purokAddress: "Purok 1, Block 5 Lot 12, San Jose",
    gender: "male",
    notes: "Senior High School Student at National High School.",
    measurements: {
      school_uniform: {
        unit: "inches",
        neck: 15,
        shoulder: 17,
        chest: 37,
        waist: 31,
        armhole: 17.5,
        sleeveLength: 9.5,
        shirtLength: 27,
        measuredDate: "2026-10-20",
        notes: "White short sleeve polo with school crest pocket patch."
      },
      pants_trousers: {
        unit: "inches",
        waist: 31,
        hips: 36,
        crotchRise: 10,
        thigh: 22,
        knee: 16,
        bottomHem: 14.5,
        outseam: 39,
        inseam: 29,
        measuredDate: "2026-10-20",
        notes: "Standard navy blue school uniform trousers."
      },
      barong_tagalog: undefined,
      polo_shirt: undefined,
      corporate_uniform: undefined,
      dress_gown: undefined,
      blazer_suit: undefined,
      alterations: undefined
    },
    createdAt: "2026-10-20",
    updatedAt: "2026-10-20"
  },
  {
    id: "cust-004",
    fullName: "Engr. Danilo 'Danny' Magno",
    contactNumber: "09187779900",
    email: "danilo.magno@builders.ph",
    purokAddress: "Purok 5, Main Boulevard",
    gender: "male",
    notes: "Wedding sponsor for December wedding in San Roque Parish.",
    measurements: {
      barong_tagalog: {
        unit: "inches",
        neck: 17,
        shoulder: 19,
        chest: 44,
        waist: 40,
        armhole: 20,
        sleeveLength: 26,
        shirtLength: 32,
        measuredDate: "2026-10-22",
        notes: "Full-open Cocoon Barong with Calado embroidery."
      },
      blazer_suit: {
        unit: "inches",
        shoulder: 19,
        chest: 44,
        waist: 40,
        armhole: 20,
        sleeveLength: 26,
        shirtLength: 30,
        measuredDate: "2026-10-22",
        notes: "Dark navy bespoke single breasted two-button suit jacket."
      },
      polo_shirt: undefined,
      school_uniform: undefined,
      corporate_uniform: undefined,
      pants_trousers: undefined,
      dress_gown: undefined,
      alterations: undefined
    },
    createdAt: "2026-10-22",
    updatedAt: "2026-10-22"
  },
  {
    id: "cust-005",
    fullName: "Atty. Katrina 'Rina' Morales",
    contactNumber: "09398882233",
    email: "katrina.morales@lexph.com",
    purokAddress: "Purok 3, Rizal Street",
    gender: "female",
    notes: "Requires formal court attire and barong for women.",
    measurements: {
      corporate_uniform: {
        unit: "inches",
        shoulder: 15,
        bust: 35,
        waist: 28,
        hips: 37,
        sleeveLength: 23,
        shirtLength: 25,
        measuredDate: "2026-10-24"
      },
      alterations: {
        unit: "inches",
        notes: "Taper waist of 2 ready-to-wear blazers by 1.5 inches each.",
        measuredDate: "2026-10-24"
      },
      barong_tagalog: undefined,
      polo_shirt: undefined,
      school_uniform: undefined,
      pants_trousers: undefined,
      dress_gown: undefined,
      blazer_suit: undefined
    },
    createdAt: "2026-10-24",
    updatedAt: "2026-10-24"
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-101",
    orderNumber: "ORD-2026-001",
    customerId: "cust-001",
    customerName: "Hon. Roberto 'Berting' Santos",
    customerPhone: "09175551234",
    garmentCategory: "barong_tagalog",
    garmentTitle: "Piña-Organza Traditional Barong Tagalog (Formal Session)",
    quantity: 1,
    fabricSource: "shop_inventory",
    fabricNotes: "First-class Piña Organza with ivory lining and U-pechera embroidery design",
    measurements: {
      unit: "inches",
      neck: 16.5,
      shoulder: 18.5,
      chest: 42,
      waist: 38,
      armhole: 19.5,
      sleeveLength: 25,
      bicep: 14.5,
      wristCuff: 9.5,
      shirtLength: 31,
      frontChest: 16,
      backWidth: 17.5
    },
    status: "ready",
    priority: "rush",
    orderDate: "2026-10-18",
    fittingDate: "2026-10-23",
    dueDate: "2026-10-30",
    assignedTailor: "Mang Ruben (Master)",
    unitPrice: 3800,
    totalAmount: 3800,
    depositAmount: 2000,
    balanceAmount: 1800,
    paymentStatus: "partial",
    paymentMethod: "gcash",
    paymentReference: "GCASH-99182371",
    specialInstructions: "Customer needs this for the District Council General Assembly on Friday.",
    statusHistory: [
      { status: "placed", timestamp: "2026-10-18 09:30", updatedBy: "Staff Cashier", note: "Order recorded with ₱2,000 GCash downpayment." },
      { status: "cutting", timestamp: "2026-10-19 14:15", updatedBy: "Mang Ruben", note: "Fabric inspected and cut according to pattern." },
      { status: "fitting", timestamp: "2026-10-23 11:00", updatedBy: "Mang Ruben", note: "Customer fitted. Adjusted shoulder slope by 0.25in." },
      { status: "sewing", timestamp: "2026-10-24 16:30", updatedBy: "Aling Tessie", note: "Assembly of sleeves and hand-embroidered pechera." },
      { status: "finishing", timestamp: "2026-10-26 10:00", updatedBy: "Mang Ruben", note: "Final buttoning, pressing, and steam iron." },
      { status: "ready", timestamp: "2026-10-27 15:45", updatedBy: "Staff Cashier", note: "Hung in garment bag, SMS notification drafted." }
    ]
  },
  {
    id: "ord-102",
    orderNumber: "ORD-2026-002",
    customerId: "cust-002",
    customerName: "Maria Clara D. Fernandez",
    customerPhone: "09285558912",
    garmentCategory: "corporate_uniform",
    garmentTitle: "DepEd Teacher Formal Blouse & Matching Pencil Skirt (Set)",
    quantity: 2,
    fabricSource: "customer_provided",
    fabricNotes: "Customer brought 4 yards of DepEd peach-toned polyester-cotton uniform fabric",
    measurements: {
      unit: "inches",
      neck: 14,
      shoulder: 15.5,
      bust: 36,
      waist: 29,
      hips: 38,
      armhole: 16.5,
      sleeveLength: 17,
      shirtLength: 24,
      skirtLength: 23
    },
    status: "sewing",
    priority: "regular",
    orderDate: "2026-10-20",
    fittingDate: "2026-10-26",
    dueDate: "2026-11-03",
    assignedTailor: "Aling Tessie (Senior Dressmaker)",
    unitPrice: 1400,
    totalAmount: 2800,
    depositAmount: 1500,
    balanceAmount: 1300,
    paymentStatus: "partial",
    paymentMethod: "cash",
    specialInstructions: "Add interior secret pocket on the blouse for teacher ID and ballpen.",
    statusHistory: [
      { status: "placed", timestamp: "2026-10-20 10:45", updatedBy: "Staff Cashier", note: "Received fabric bundle and ₱1,500 cash deposit." },
      { status: "cutting", timestamp: "2026-10-22 13:00", updatedBy: "Aling Tessie", note: "Cut front and back panels." },
      { status: "fitting", timestamp: "2026-10-26 14:00", updatedBy: "Aling Tessie", note: "First baste fitting completed, waist fit approved." },
      { status: "sewing", timestamp: "2026-10-27 09:30", updatedBy: "Aling Tessie", note: "Overlocking seams and sewing darts." }
    ]
  },
  {
    id: "ord-103",
    orderNumber: "ORD-2026-003",
    customerId: "cust-003",
    customerName: "Mark Jayson 'MJ' Alcantara",
    customerPhone: "09951114477",
    garmentCategory: "school_uniform",
    garmentTitle: "High School Senior Polo & Navy Pants (Set)",
    quantity: 1,
    fabricSource: "shop_inventory",
    fabricNotes: "Tetoron cotton for polo, Gabardine heavy twill for navy pants",
    measurements: {
      unit: "inches",
      neck: 15,
      shoulder: 17,
      chest: 37,
      waist: 31,
      armhole: 17.5,
      sleeveLength: 9.5,
      shirtLength: 27,
      hips: 36,
      crotchRise: 10,
      thigh: 22,
      knee: 16,
      bottomHem: 14.5,
      outseam: 39,
      inseam: 29
    },
    status: "cutting",
    priority: "regular",
    orderDate: "2026-10-24",
    fittingDate: "2026-10-31",
    dueDate: "2026-11-06",
    assignedTailor: "Kuya Jun (Cutter)",
    unitPrice: 1250,
    totalAmount: 1250,
    depositAmount: 1250,
    balanceAmount: 0,
    paymentStatus: "paid",
    paymentMethod: "gcash",
    paymentReference: "GCASH-88129033",
    specialInstructions: "Student ID patch on left chest pocket.",
    statusHistory: [
      { status: "placed", timestamp: "2026-10-24 16:15", updatedBy: "Staff Cashier", note: "Fully paid via GCash." },
      { status: "cutting", timestamp: "2026-10-26 11:20", updatedBy: "Kuya Jun", note: "Fabrics laid out and cut." }
    ]
  },
  {
    id: "ord-104",
    orderNumber: "ORD-2026-004",
    customerId: "cust-004",
    customerName: "Engr. Danilo 'Danny' Magno",
    customerPhone: "09187779900",
    garmentCategory: "barong_tagalog",
    garmentTitle: "Cocoon Silk Barong with Hand Calado Embroidery & Slacks",
    quantity: 1,
    fabricSource: "shop_inventory",
    fabricNotes: "Premium Cocoon Silk and Wool-blend fabric for slacks",
    measurements: {
      unit: "inches",
      neck: 17,
      shoulder: 19,
      chest: 44,
      waist: 40,
      armhole: 20,
      sleeveLength: 26,
      shirtLength: 32,
      hips: 44,
      crotchRise: 12,
      outseam: 41
    },
    status: "fitting",
    priority: "urgent",
    orderDate: "2026-10-22",
    fittingDate: "2026-10-29",
    dueDate: "2026-11-05",
    assignedTailor: "Mang Ruben (Master)",
    unitPrice: 5200,
    totalAmount: 5200,
    depositAmount: 3000,
    balanceAmount: 2200,
    paymentStatus: "partial",
    paymentMethod: "bank_transfer",
    paymentReference: "BDO-REF-449102",
    specialInstructions: "Wedding principal sponsor attire. Scheduled for first basted fitting today.",
    statusHistory: [
      { status: "placed", timestamp: "2026-10-22 11:00", updatedBy: "Mang Ruben", note: "Consultation and fabric selection." },
      { status: "cutting", timestamp: "2026-10-25 15:00", updatedBy: "Kuya Jun", note: "Precision cutting for embroidery clearance." },
      { status: "fitting", timestamp: "2026-10-28 09:00", updatedBy: "Mang Ruben", note: "Ready for fitting appointment." }
    ]
  },
  {
    id: "ord-105",
    orderNumber: "ORD-2026-005",
    customerId: "cust-005",
    customerName: "Atty. Katrina 'Rina' Morales",
    customerPhone: "09398882233",
    garmentCategory: "alterations",
    garmentTitle: "Blazer Waist Tapering & Hemming (2 Ready-to-Wear Suits)",
    quantity: 2,
    fabricSource: "customer_provided",
    fabricNotes: "Customer brought 2 Zara dark grey work suits",
    measurements: {
      unit: "inches",
      waist: 28,
      notes: "Take in waist 1.5 inches each, shorten sleeves by 0.75 inch."
    },
    status: "claimed",
    priority: "regular",
    orderDate: "2026-10-16",
    dueDate: "2026-10-23",
    claimedDate: "2026-10-23",
    assignedTailor: "Aling Tessie",
    unitPrice: 450,
    totalAmount: 900,
    depositAmount: 900,
    balanceAmount: 0,
    paymentStatus: "paid",
    paymentMethod: "cash",
    specialInstructions: "Preserve original sleeve button stitching pattern.",
    statusHistory: [
      { status: "placed", timestamp: "2026-10-16 14:00", updatedBy: "Staff Cashier" },
      { status: "sewing", timestamp: "2026-10-18 10:00", updatedBy: "Aling Tessie" },
      { status: "ready", timestamp: "2026-10-21 16:00", updatedBy: "Aling Tessie" },
      { status: "claimed", timestamp: "2026-10-23 17:30", updatedBy: "Staff Cashier", note: "Customer claimed and tested fit; fully satisfied." }
    ]
  }
];

export const INITIAL_EVALUATIONS: SystemEvaluationReport[] = [
  {
    respondentType: "Shop Owner",
    respondentName: "Ruben Dela Cruz (Shop Owner / Master Cutter)",
    date: "2026-10-25",
    ratings: {
      functionalSuitability: 4.8,
      performanceEfficiency: 4.9,
      usability: 4.7,
      reliability: 4.9,
      security: 4.8
    },
    comments: "Napakalaking tulong sa shop. Hindi na kami nahihirapan maghanap ng notebook kapag nagbalik ang suki. Kitang-kita agad ang downpayment at balance."
  },
  {
    respondentType: "Head Tailor",
    respondentName: "Teresita 'Aling Tessie' Mendoza",
    date: "2026-10-26",
    ratings: {
      functionalSuitability: 4.9,
      performanceEfficiency: 4.8,
      usability: 4.6,
      reliability: 4.7,
      security: 4.6
    },
    comments: "Malinaw ang mga sukat (Balikat, Dibdib, Baywang). May Tagalog guide kaya madaling basahin ng mga mananahi sa makina."
  },
  {
    respondentType: "Customer",
    respondentName: "Hon. Roberto Santos",
    date: "2026-10-27",
    ratings: {
      functionalSuitability: 4.9,
      performanceEfficiency: 5.0,
      usability: 4.9,
      reliability: 4.8,
      security: 4.9
    },
    comments: "Received the SMS update when my Barong was ready for pickup. Very professional and transparent with the official claim slip."
  }
];

export const GARMENT_METADATA: Record<string, { label: string; tagalog: string; iconName: string; defaultPrice: number; estimatedDays: number }> = {
  barong_tagalog: {
    label: "Barong Tagalog",
    tagalog: "Pormal na Barong",
    iconName: "Shirt",
    defaultPrice: 3800,
    estimatedDays: 10
  },
  polo_shirt: {
    label: "Polo / Short Sleeve",
    tagalog: "Polo Barong o Casual",
    iconName: "Shirt",
    defaultPrice: 1200,
    estimatedDays: 6
  },
  school_uniform: {
    label: "School Uniform",
    tagalog: "Uniporme sa Paaralan",
    iconName: "GraduationCap",
    defaultPrice: 950,
    estimatedDays: 7
  },
  corporate_uniform: {
    label: "Corporate / Office Uniform",
    tagalog: "Pang-opisina o Guro",
    iconName: "Briefcase",
    defaultPrice: 1600,
    estimatedDays: 8
  },
  pants_trousers: {
    label: "Pants & Trousers",
    tagalog: "Slacks / Pantalon",
    iconName: "Scissors",
    defaultPrice: 1100,
    estimatedDays: 5
  },
  dress_gown: {
    label: "Dress & Evening Gown",
    tagalog: "Gown / Filipiniana / Bestida",
    iconName: "Sparkles",
    defaultPrice: 4500,
    estimatedDays: 14
  },
  blazer_suit: {
    label: "Suit & Blazer",
    tagalog: "Amerikana / Terno",
    iconName: "Award",
    defaultPrice: 5000,
    estimatedDays: 14
  },
  alterations: {
    label: "Alteration & Repair",
    tagalog: "Bawas Haba / Tabas / Ayos",
    iconName: "Wrench",
    defaultPrice: 350,
    estimatedDays: 3
  }
};
