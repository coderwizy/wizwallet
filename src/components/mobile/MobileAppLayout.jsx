import React from 'react';
import MobileHeader from '../layout/MobileHeader';
import MobileBottomNav from '../layout/MobileBottomNav';

import MobileDashboardView from './views/MobileDashboardView';
import MobileWalletView from './views/MobileWalletView';
import MobileBankView from './views/MobileBankView';
import MobileBusinessView from './views/MobileBusinessView';
import MobileSectorsView from './views/MobileSectorsView';
import MobileLedgerView from './views/MobileLedgerView';
import MobileFamilyView from './views/MobileFamilyView';
import MobileSettingsView from './views/MobileSettingsView';

const MobileAppLayout = ({ activeTab, setActiveTab }) => {
  const renderMobileView = () => {
    switch (activeTab) {
      case 'dashboard': return <MobileDashboardView setActiveTab={setActiveTab} />;
      case 'wallet': return <MobileWalletView setActiveTab={setActiveTab} />;
      case 'bank': return <MobileBankView />;
      case 'business': return <MobileBusinessView />;
      case 'sectors': return <MobileSectorsView />;
      case 'transactions': return <MobileLedgerView />;
      case 'family': return <MobileFamilyView />;
      case 'settings': return <MobileSettingsView />;
      default: return <MobileDashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#1C1917] flex flex-col justify-between relative selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      {/* Native Deep Cream Mobile Header */}
      <MobileHeader activeTab={activeTab} />

      {/* Main View Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto max-w-md mx-auto w-full">
        {renderMobileView()}
      </main>

      {/* Sticky Native Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default React.memo(MobileAppLayout);
