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
import MobileInvestmentsView from './views/MobileInvestmentsView';
import MobileRealEstateView from './views/MobileRealEstateView';
import MobileExpenseView from './views/MobileExpenseView';
import MobileCommanderView from './views/MobileCommanderView';
import MobileSimulatorView from './views/MobileSimulatorView';
import MobileTaxView from './views/MobileTaxView';
import MobileVaultView from './views/MobileVaultView';
import MobileGoalsView from './views/MobileGoalsView';

const MobileAppLayout = ({ activeTab, setActiveTab }) => {
  const renderMobileView = () => {
    switch (activeTab) {
      case 'dashboard': return <MobileDashboardView setActiveTab={setActiveTab} />;
      case 'wallet': return <MobileWalletView setActiveTab={setActiveTab} />;
      case 'bank': return <MobileBankView setActiveTab={setActiveTab} />;
      case 'investments': return <MobileInvestmentsView />;
      case 'realestate': return <MobileRealEstateView />;
      case 'business': return <MobileBusinessView />;
      case 'sectors': return <MobileSectorsView />;
      case 'expenses': return <MobileExpenseView />;
      case 'family': return <MobileFamilyView />;
      case 'commander': return <MobileCommanderView />;
      case 'simulator': return <MobileSimulatorView />;
      case 'tax': return <MobileTaxView />;
      case 'vault': return <MobileVaultView />;
      case 'goals': return <MobileGoalsView />;
      case 'transactions': return <MobileLedgerView />;
      case 'settings': return <MobileSettingsView />;
      default: return <MobileDashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-ww-bg text-ww-text flex flex-col justify-between relative selection:bg-ww-green-bg selection:text-ww-accent">
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
