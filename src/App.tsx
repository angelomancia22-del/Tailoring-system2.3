import React, { useState } from 'react';
import { TailoringProvider, useTailoring } from './context/TailoringContext';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { MeasurementsView } from './components/MeasurementsView';
import { ReportsView } from './components/ReportsView';
import { EvaluationStudyView } from './components/EvaluationStudyView';
import { CommunicationModal } from './components/CommunicationModal';
import { OrderFormModal } from './components/OrderFormModal';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { JobTicketPrintModal } from './components/JobTicketPrintModal';
import { PaymentModal } from './components/PaymentModal';
import { CustomerModal } from './components/CustomerModal';
import { PublicClaimTrackerModal } from './components/PublicClaimTrackerModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { OrderItem, Customer, GarmentCategory, GarmentMeasurements } from './types/tailoring';

function MainApp() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'customers' | 'measurements' | 'communications' | 'reports' | 'evaluation'
  >('dashboard');

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState<boolean>(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState<boolean>(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState<boolean>(false);
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState<boolean>(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isPublicTrackerOpen, setIsPublicTrackerOpen] = useState<boolean>(false);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);

  // Selected entities for modals
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [prefilledGarment, setPrefilledGarment] = useState<GarmentCategory | undefined>(undefined);
  const [prefilledMeasurements, setPrefilledMeasurements] = useState<GarmentMeasurements | undefined>(undefined);

  // Handlers
  const handleOpenOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleOpenPrintSlip = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsPrintSlipOpen(true);
  };

  const handleOpenCommModal = (order?: OrderItem, customer?: Customer) => {
    setSelectedOrder(order || null);
    setSelectedCustomer(customer || null);
    setIsCommModalOpen(true);
  };

  const handleOpenPaymentModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handleStartOrderWithMeasurements = (
    customer: Customer,
    garmentType: GarmentCategory,
    measurements: GarmentMeasurements
  ) => {
    setSelectedCustomer(customer);
    setPrefilledGarment(garmentType);
    setPrefilledMeasurements(measurements);
    setIsNewOrderOpen(true);
  };

  const handleOpenNewOrderForCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPrefilledGarment(undefined);
    setPrefilledMeasurements(undefined);
    setIsNewOrderOpen(true);
  };

  const handleOpenGenericNewOrder = () => {
    setSelectedCustomer(null);
    setPrefilledGarment(undefined);
    setPrefilledMeasurements(undefined);
    setIsNewOrderOpen(true);
  };

  const handleOrderCreated = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsPrintSlipOpen(true); // Offer immediate printing of official job ticket
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 font-sans text-neutral-900 antialiased flex flex-col">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={handleOpenGenericNewOrder}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenCustomerTracker={() => setIsPublicTrackerOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenNewOrder={handleOpenGenericNewOrder}
            onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
            onOpenOrderDetails={handleOpenOrderDetails}
            onOpenPrintSlip={handleOpenPrintSlip}
            onOpenCommModal={handleOpenCommModal}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            onOpenNewOrder={handleOpenGenericNewOrder}
            onOpenOrderDetails={handleOpenOrderDetails}
            onOpenPrintSlip={handleOpenPrintSlip}
            onOpenCommModal={handleOpenCommModal}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
            onOpenNewOrderForCustomer={handleOpenNewOrderForCustomer}
            onOpenCommModal={handleOpenCommModal}
            onOpenOrderDetails={handleOpenOrderDetails}
          />
        )}

        {activeTab === 'measurements' && (
          <MeasurementsView
            onStartOrderWithMeasurements={handleStartOrderWithMeasurements}
          />
        )}

        {activeTab === 'communications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Customer SMS & Notifications Dispatch
                </h1>
                <p className="text-xs text-neutral-500">
                  Pre-defined bilingual milestone updates (Order Received, Measurement Taken, Stitching, Ready for Pickup)
                </p>
              </div>
              <button
                onClick={() => handleOpenCommModal()}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
              >
                + Compose New SMS Dispatch
              </button>
            </div>
            
            {/* Embedded Communication view */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
              <p className="text-xs text-neutral-600 mb-4">
                Click below to compose a targeted SMS milestone notice or view past dispatch logs.
              </p>
              <button
                onClick={() => handleOpenCommModal()}
                className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors"
              >
                Open SMS Notification Center
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'evaluation' && <EvaluationStudyView />}
      </main>

      {/* Global Interactive Modals */}
      <OrderFormModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        preSelectedCustomer={selectedCustomer}
        preSelectedGarment={prefilledGarment}
        preSelectedMeasurements={prefilledMeasurements}
        onOrderCreated={handleOrderCreated}
      />

      <CustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onCustomerCreated={() => setActiveTab('customers')}
      />

      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
        order={selectedOrder}
        onOpenPrintSlip={handleOpenPrintSlip}
        onOpenCommModal={handleOpenCommModal}
        onOpenPaymentModal={handleOpenPaymentModal}
      />

      <JobTicketPrintModal
        isOpen={isPrintSlipOpen}
        onClose={() => setIsPrintSlipOpen(false)}
        order={selectedOrder}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={selectedOrder}
      />

      <CommunicationModal
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        preSelectedOrder={selectedOrder}
        preSelectedCustomer={selectedCustomer}
      />

      <PublicClaimTrackerModal
        isOpen={isPublicTrackerOpen}
        onClose={() => setIsPublicTrackerOpen(false)}
      />

      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <TailoringProvider>
      <MainApp />
    </TailoringProvider>
  );
}
