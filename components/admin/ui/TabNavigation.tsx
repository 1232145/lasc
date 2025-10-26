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
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8 px-6">
      <button
        onClick={() => onTabChange('events')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'events'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Events ({counts.events})
      </button>
      <button
        onClick={() => onTabChange('rsvps')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'rsvps'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        RSVPs ({counts.rsvps})
      </button>
      <button
        onClick={() => onTabChange('photos')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'photos'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Photos ({counts.photos})
      </button>
      <button
        onClick={() => onTabChange('board')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'board'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Board ({counts.board})
      </button>
      <button
        onClick={() => onTabChange('resources')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'resources'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Resources ({counts.resources})
      </button>
      <button
        onClick={() => onTabChange('sponsors')}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === 'sponsors'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Sponsors ({counts.sponsors})
      </button>
    </nav>
  </div>
);

