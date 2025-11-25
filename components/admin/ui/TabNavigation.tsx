import React from 'react';

type TabType = 'events' | 'rsvps' | 'photos' | 'board' | 'sponsors' | 'resources';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    events: number;
    rsvps: number;
    photos: number;
    board: number;
    resources: number;
    sponsors: number;
  };
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, counts }) => (
  <div className="border-b border-orange-200">
    <nav className="flex space-x-8 px-6 overflow-x-auto">
      <button
        onClick={() => onTabChange('events')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'events'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        Events ({counts.events})
      </button>
      <button
        onClick={() => onTabChange('rsvps')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'rsvps'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        RSVPs ({counts.rsvps})
      </button>
      <button
        onClick={() => onTabChange('photos')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'photos'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        Photos ({counts.photos})
      </button>
      <button
        onClick={() => onTabChange('board')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'board'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        Board ({counts.board})
      </button>
      <button
        onClick={() => onTabChange('resources')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'resources'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        Resources ({counts.resources})
      </button>
      <button
        onClick={() => onTabChange('sponsors')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors ${
          activeTab === 'sponsors'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-stone-500 hover:text-orange-600'
        }`}
      >
        Sponsors ({counts.sponsors})
      </button>
    </nav>
  </div>
);

