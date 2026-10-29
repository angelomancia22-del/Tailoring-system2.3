import React, { useState, useEffect } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { OrderItem, Customer } from '../types/tailoring';
import { 
  X, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  History, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedOrder?: OrderItem | null;
  preSelectedCustomer?: Customer | null;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({
  isOpen,
  onClose,
  preSelectedOrder,
  preSelectedCustomer
}) => {
  const { orders, customers, shopSettings, sendMessage, messages } = useTailoring();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(preSelectedOrder?.id || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preSelectedCustomer?.id || preSelectedOrder?.customerId || (customers[0]?.id || '')
  );

  const [channel, setChannel] = useState<'SMS' | 'Email' | 'Viber'>('SMS');
  const [templateType, setTemplateType] = useState<string>('Ready for Pickup');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Find active customer and order
  const currentOrder = orders.find(o => o.id === selectedOrderId) || preSelectedOrder;
  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || preSelectedCustomer || (currentOrder ? customers.find(c => c.id === currentOrder.customerId) : null);

  // Template definitions
  const getTemplateText = (tpl: string): string => {
    const custName = currentCustomer?.fullName || 'Valued Customer';
    const orderNum = currentOrder?.orderNumber || 'ORD-Order';
    const garment = currentOrder?.garmentTitle || 'Custom Garment';
    const balance = currentOrder ? `₱${currentOrder.balanceAmount.toLocaleString()}` : '₱0';
    const dueDate = currentOrder?.dueDate || 'upcoming date';
    const fittingDate = currentOrder?.fittingDate || 'scheduled date';
    const shop = shopSettings.shopName;
    const phone = shopSettings.contactNumber;

    switch (tpl) {
      case 'Order Received':
        return `Magandang araw po ${custName}! Natanggap na po ng ${shop} ang inyong order na ${garment} (Order #${orderNum}). Salamat po sa inyong tiwala! Contact: ${phone}.`;

      case 'Measurement Taken':
        return `Magandang araw po ${custName}! Naitala na po ang inyong kumpletong sukat para sa ${garment} (Order #${orderNum}) at nakatakda na para sa pagtabas ng tela. Salamat po! - ${shop}`;

      case 'Fitting Scheduled':
        return `Magandang araw po ${custName}! Ang inyong ${garment} (Order #${orderNum}) ay handa na po para sa unang sukat (basting fitting) sa darating na ${fittingDate}. Mangyaring bisitahin kami sa aming shop. Salamat po! - ${shop}`;

      case 'Stitching in Progress':
        return `Update mula sa ${shop}: Kasalukuyan na pong tinatahi at binubuo ng aming master tailor ang inyong ${garment} (Order #${orderNum}). Inaasahang matatapos sa takdang araw (${dueDate}).`;

      case 'Ready for Pickup':
        return `Magandang balita po ${custName}! Handa na po para i-pickup ang inyong ${garment} (Order #${orderNum}) sa ${shop}. Natitirang balanse: ${balance}. Maraming salamat po!`;

      case 'Payment Receipt':
        return `Opisyal na Abiso mula sa ${shop}: Natanggap po namin ang inyong bayad para sa Order #${orderNum}. Natitirang balanse: ${balance}. Maraming salamat po sa inyong pagtangkilik!`;

      case 'Manual Composition':
      default:
        return '';
    }
  };

  // Re-generate text on selection change
  useEffect(() => {
    if (templateType === 'Manual Composition') {
      if (!customMessage) {
        setCustomMessage(`Magandang araw po ${currentCustomer?.fullName || ''}! `);
      }
    } else {
      setCustomMessage(getTemplateText(templateType));
    }
  }, [templateType, selectedOrderId, selectedCustomerId]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!customMessage.trim() || !currentCustomer) return;

    sendMessage({
      orderId: currentOrder?.id,
      orderNumber: currentOrder?.orderNumber,
      customerId: currentCustomer.id,
      customerName: currentCustomer.fullName,
      customerContact: channel === 'Email' ? (currentCustomer.email || currentCustomer.contactNumber) : currentCustomer.contactNumber,
      channel,
      templateType,
      messageText: customMessage
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customerHistory = messages.filter(
    m => m.customerId === currentCustomer?.id || (currentOrder && m.orderId === currentOrder.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Customer Communication & SMS Dispatch
              </h2>
              <p className="text-xs text-neutral-500">
                Send milestone notices, fitting schedules, and pickup alerts to clients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3 text-xs font-semibold border-b-2 mr-6 transition-colors ${
              activeTab === 'compose'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Message Log ({customerHistory.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'compose' ? (
            <>
              {/* Recipient & Order Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Select Customer
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      // Auto pick customer's latest order
                      const custOrders = orders.filter(o => o.customerId === e.target.value);
                      if (custOrders.length > 0) setSelectedOrderId(custOrders[0].id);
                    }}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.contactNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Associated Order (Optional)
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="">-- No specific order --</option>
                    {orders
                      .filter(o => !selectedCustomerId || o.customerId === selectedCustomerId)
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.orderNumber} - {o.garmentTitle} ({o.status})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Dispatch Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('SMS')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                      channel === 'SMS'
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS (PH Mobile)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('Viber')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                      channel === 'Viber'
                        ? 'border-purple-900 bg-purple-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Viber Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('Email')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                      channel === 'Email'
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Dispatch</span>
                  </button>
                </div>
              </div>

              {/* Pre-defined Status Template Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-neutral-700">
                    Pre-defined Status Update Template
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Bilingual Tagalog / English templates
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    'Order Received',
                    'Measurement Taken',
                    'Fitting Scheduled',
                    'Stitching in Progress',
                    'Ready for Pickup',
                    'Payment Receipt',
                    'Manual Composition'
                  ].map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => setTemplateType(tpl)}
                      className={`text-left px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                        templateType === tpl
                          ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer & Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-700">
                    Message Content (Editable)
                  </label>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {customMessage.length} chars (
                    {Math.ceil(customMessage.length / 160) || 1} SMS segment)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type customer update message..."
                  className="w-full text-xs font-sans border border-neutral-300 rounded-lg p-3 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* Phone Simulator Display */}
              <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-2 mb-2 border-b border-neutral-200">
                  <span className="font-semibold text-neutral-700">
                    Customer Device Preview ({currentCustomer?.contactNumber || '09XX-XXX-XXXX'})
                  </span>
                  <span>Carrier: Smart / Globe PH</span>
                </div>
                <div className="bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-200/70 text-xs leading-relaxed font-sans shadow-2xs">
                  {customMessage || 'Message will appear here...'}
                </div>
              </div>
            </>
          ) : (
            /* History Tab */
            <div className="space-y-3">
              {customerHistory.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No previous messages sent to this customer.
                </div>
              ) : (
                customerHistory.map((m) => (
                  <div key={m.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800">
                        {m.templateType} ({m.channel})
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {m.sentAt} · <span className="text-emerald-700 font-medium">{m.status}</span>
                      </span>
                    </div>
                    {m.orderNumber && (
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Ref: {m.orderNumber}
                      </div>
                    )}
                    <p className="text-neutral-700 text-xs mt-1 leading-normal">
                      "{m.messageText}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Message'}</span>
            </button>

            {/* Quick SMS Direct URL button */}
            {currentCustomer?.contactNumber && (
              <a
                href={`sms:${currentCustomer.contactNumber}?body=${encodeURIComponent(customMessage)}`}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors"
              >
                <span>Open in Phone SMS App</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!customMessage.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {sentSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
