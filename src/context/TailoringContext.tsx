import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, OrderItem, ShopSettings, SystemEvaluationReport, OrderStatus, PaymentStatus, GarmentCategory, UserRole } from '../types/tailoring';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_SHOP_SETTINGS, INITIAL_EVALUATIONS } from '../data/initialData';

export interface CommunicationMessage {
  id: string;
  orderId?: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  customerContact: string;
  channel: 'SMS' | 'Email' | 'Viber';
  templateType: string;
  messageText: string;
  sentAt: string;
  status: 'Delivered' | 'Sent';
}

export interface OrderFilterCriteria {
  searchQuery: string;
  garmentType: 'all' | GarmentCategory;
  orderStatus: 'all' | OrderStatus;
  paymentStatus: 'all' | PaymentStatus;
  priority: 'all' | 'regular' | 'rush' | 'urgent';
  startDate: string;
  endDate: string;
  assignedTailor: string;
}

interface TailoringContextType {
  customers: Customer[];
  orders: OrderItem[];
  shopSettings: ShopSettings;
  evaluations: SystemEvaluationReport[];
  messages: CommunicationMessage[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Customer methods
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  
  // Order methods
  addOrder: (orderData: Omit<OrderItem, 'id' | 'orderNumber' | 'statusHistory'>) => OrderItem;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  updateOrderPayment: (orderId: string, additionalAmount: number, paymentMethod: string, reference?: string) => void;
  updateOrderDetails: (orderId: string, updates: Partial<OrderItem>) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => OrderItem | undefined;
  
  // Filter & Search
  filterCriteria: OrderFilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<OrderFilterCriteria>>;
  filteredOrders: OrderItem[];
  resetFilters: () => void;
  
  // Communication
  sendMessage: (msg: Omit<CommunicationMessage, 'id' | 'sentAt' | 'status'>) => void;
  
  // Evaluation
  addEvaluation: (evalData: SystemEvaluationReport) => void;
  
  // Settings & Data Preservation
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  lastSavedTimestamp: string;
}

const STORAGE_KEY = 'tailoring_mgmt_system_v1';

const defaultFilters: OrderFilterCriteria = {
  searchQuery: '',
  garmentType: 'all',
  orderStatus: 'all',
  paymentStatus: 'all',
  priority: 'all',
  startDate: '',
  endDate: '',
  assignedTailor: 'all'
};

const TailoringContext = createContext<TailoringContextType | null>(null);

export const TailoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_settings');
      return saved ? JSON.parse(saved) : INITIAL_SHOP_SETTINGS;
    } catch {
      return INITIAL_SHOP_SETTINGS;
    }
  });

  const [evaluations, setEvaluations] = useState<SystemEvaluationReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_evaluations');
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_messages');
      return saved ? JSON.parse(saved) : [
        {
          id: 'msg-01',
          orderId: 'ord-101',
          orderNumber: 'ORD-2026-001',
          customerId: 'cust-001',
          customerName: "Hon. Roberto 'Berting' Santos",
          customerContact: '09175551234',
          channel: 'SMS',
          templateType: 'Ready for Pickup',
          messageText: "Magandang araw po Hon. Roberto! Handa na po para i-pickup ang inyong Piña-Organza Barong sa Tailoring Atelier. Remaining balance: ₱1,800. Maraming salamat po!",
          sentAt: '2026-10-27 15:46',
          status: 'Delivered'
        }
      ];
    } catch {
      return [];
    }
  });

  const [filterCriteria, setFilterCriteria] = useState<OrderFilterCriteria>(defaultFilters);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>(new Date().toLocaleTimeString());

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_customers', JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEY + '_orders', JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEY + '_settings', JSON.stringify(shopSettings));
      localStorage.setItem(STORAGE_KEY + '_evaluations', JSON.stringify(evaluations));
      localStorage.setItem(STORAGE_KEY + '_messages', JSON.stringify(messages));
      setLastSavedTimestamp(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [customers, orders, shopSettings, evaluations, messages]);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `cust-${Date.now().toString(36)}`;
    const now = new Date().toISOString().split('T')[0];
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const now = new Date().toISOString().split('T')[0];
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...customerData, updatedAt: now } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const addOrder = (orderData: Omit<OrderItem, 'id' | 'orderNumber' | 'statusHistory'>) => {
    const count = orders.length + 1;
    const orderNumber = `ORD-2026-${String(count).padStart(3, '0')}`;
    const id = `ord-${Date.now().toString(36)}`;
    const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: OrderItem = {
      ...orderData,
      id,
      orderNumber,
      statusHistory: [
        {
          status: orderData.status,
          timestamp: nowFormatted,
          updatedBy: currentRole === 'owner' ? 'Mang Ruben (Owner)' : currentRole === 'tailor' ? 'Tailor' : 'Staff Cashier',
          note: `Order booked with deposit of ₱${orderData.depositAmount.toLocaleString()}`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Also update customer measurements if applicable
    const cust = customers.find(c => c.id === orderData.customerId);
    if (cust && orderData.measurements) {
      const updatedMeasurements = {
        ...cust.measurements,
        [orderData.garmentCategory]: orderData.measurements
      };
      updateCustomer(cust.id, { measurements: updatedMeasurements });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedBy = currentRole === 'owner' ? 'Mang Ruben (Master)' : currentRole === 'tailor' ? 'Head Tailor' : 'Staff Cashier';

    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const newHistory = [
          ...order.statusHistory,
          {
            status: newStatus,
            timestamp: nowFormatted,
            updatedBy,
            note: note || `Status updated to ${newStatus}`
          }
        ];
        return {
          ...order,
          status: newStatus,
          claimedDate: newStatus === 'claimed' ? new Date().toISOString().split('T')[0] : order.claimedDate,
          statusHistory: newHistory
        };
      })
    );
  };

  const updateOrderPayment = (orderId: string, additionalAmount: number, paymentMethod: string, reference?: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const newDeposit = order.depositAmount + additionalAmount;
        const newBalance = Math.max(0, order.totalAmount - newDeposit);
        const paymentStatus: PaymentStatus = newBalance === 0 ? 'paid' : newDeposit > 0 ? 'partial' : 'unpaid';

        return {
          ...order,
          depositAmount: newDeposit,
          balanceAmount: newBalance,
          paymentStatus,
          paymentMethod: paymentMethod as any,
          paymentReference: reference || order.paymentReference
        };
      })
    );
  };

  const updateOrderDetails = (orderId: string, updates: Partial<OrderItem>) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, ...updates } : order))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase());
  };

  const resetFilters = () => {
    setFilterCriteria(defaultFilters);
  };

  // Filtered orders with multi-criteria search
  const filteredOrders = orders.filter(order => {
    // Search query
    if (filterCriteria.searchQuery.trim()) {
      const q = filterCriteria.searchQuery.toLowerCase().trim();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchGarment = order.garmentTitle.toLowerCase().includes(q);
      if (!matchOrderNum && !matchCustomer && !matchPhone && !matchGarment) {
        return false;
      }
    }

    // Garment Type filter
    if (filterCriteria.garmentType !== 'all' && order.garmentCategory !== filterCriteria.garmentType) {
      return false;
    }

    // Order status / tailoring progress filter
    if (filterCriteria.orderStatus !== 'all' && order.status !== filterCriteria.orderStatus) {
      return false;
    }

    // Payment status filter
    if (filterCriteria.paymentStatus !== 'all' && order.paymentStatus !== filterCriteria.paymentStatus) {
      return false;
    }

    // Priority filter
    if (filterCriteria.priority !== 'all' && order.priority !== filterCriteria.priority) {
      return false;
    }

    // Tailor assigned filter
    if (filterCriteria.assignedTailor !== 'all' && order.assignedTailor !== filterCriteria.assignedTailor) {
      return false;
    }

    // Date range filter
    if (filterCriteria.startDate && order.orderDate < filterCriteria.startDate) {
      return false;
    }
    if (filterCriteria.endDate && order.orderDate > filterCriteria.endDate) {
      return false;
    }

    return true;
  });

  const sendMessage = (msg: Omit<CommunicationMessage, 'id' | 'sentAt' | 'status'>) => {
    const newMessage: CommunicationMessage = {
      ...msg,
      id: `msg-${Date.now().toString(36)}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Delivered'
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const addEvaluation = (evalData: SystemEvaluationReport) => {
    setEvaluations(prev => [evalData, ...prev]);
  };

  const updateShopSettings = (settings: Partial<ShopSettings>) => {
    setShopSettings(prev => ({ ...prev, ...settings }));
  };

  const exportDatabaseJSON = () => {
    const backupData = {
      appName: "Customer Order and Measurements Management System",
      exportDate: new Date().toISOString(),
      shopSettings,
      customers,
      orders,
      evaluations,
      messages
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tailoring_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.customers && Array.isArray(data.customers) && data.orders && Array.isArray(data.orders)) {
        setCustomers(data.customers);
        setOrders(data.orders);
        if (data.shopSettings) setShopSettings(data.shopSettings);
        if (data.evaluations) setEvaluations(data.evaluations);
        if (data.messages) setMessages(data.messages);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setShopSettings(INITIAL_SHOP_SETTINGS);
    setEvaluations(INITIAL_EVALUATIONS);
    setMessages([]);
  };

  return (
    <TailoringContext.Provider
      value={{
        customers,
        orders,
        shopSettings,
        evaluations,
        messages,
        currentRole,
        setCurrentRole,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        addOrder,
        updateOrderStatus,
        updateOrderPayment,
        updateOrderDetails,
        deleteOrder,
        getOrderById,
        filterCriteria,
        setFilterCriteria,
        filteredOrders,
        resetFilters,
        sendMessage,
        addEvaluation,
        updateShopSettings,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
        lastSavedTimestamp
      }}
    >
      {children}
    </TailoringContext.Provider>
  );
};

export const useTailoring = () => {
  const context = useContext(TailoringContext);
  if (!context) {
    throw new Error('useTailoring must be used within a TailoringProvider');
  }
  return context;
};
