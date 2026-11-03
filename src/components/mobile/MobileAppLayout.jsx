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
      case 'bank': return <MobileBankView setActiveTab={setActiveTab} />;
      case 'business': return <MobileBusinessView />;
      case 'sectors': return <MobileSectorsView />;
      case 'transactions': return <MobileLedgerView />;
      case 'family': return <MobileFamilyView />;
      case 'settings': return <MobileSettingsView />;
      default: return <MobileDashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#22251F] flex flex-col justify-between relative selection:bg-[#EDF2E9] selection:text-[#526B56]">
      {/* Native Cream Mobile Header */}
      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area with Safe Area Bottom Padding */}
      <main className="flex-1 p-4 pb-28 overflow-y-auto max-w-lg mx-auto w-full">
        {renderMobileView()}
      </main>

      {/* Sticky Native Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default React.memo(MobileAppLayout);
