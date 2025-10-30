import React, { useMemo, useState } from 'react';
import { SponsorForm } from '../forms/SponsorForm';
import { EmptyState } from '../ui/EmptyState';
import type { Sponsor } from '../types';
import { SortableHeader } from '../ui/SortableHeader';
import { SearchInput } from '../ui/SearchInput';

interface SponsorsTabProps {
  sponsors: Sponsor[];
  editingSponsor: Sponsor | null;
  showCreateSponsor: boolean;
  newSponsor: any;
  handleSponsorFormChange: (field: string, value: string) => void;
  handleUpdateSponsor: (e: React.FormEvent) => void;
  handleCreateSponsor: (e: React.FormEvent) => void;
  handleEditSponsor: (sponsor: Sponsor) => void;
  handleDeleteSponsor: (sponsorId: string, sponsorName: string) => void;
  openCreateSponsor: () => void;
  closeSponsorForm: () => void;
}

export const SponsorsTab: React.FC<SponsorsTabProps> = ({
  sponsors,
  editingSponsor,
  showCreateSponsor,
  newSponsor,
  handleSponsorFormChange,
  handleUpdateSponsor,
  handleCreateSponsor,
  handleEditSponsor,
  handleDeleteSponsor,
  openCreateSponsor,
  closeSponsorForm
}) => {
  type SortKey = 'name' | 'description' | 'website';
  const [sort, setSort] = useState<{ key: SortKey | null; direction: 'asc' | 'desc' | null }>({ key: null, direction: null });
  const [query, setQuery] = useState('');

  const filteredSponsors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sponsors;
    return sponsors.filter((s) =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.website || '').toLowerCase().includes(q)
    );
  }, [sponsors, query]);

  const sortedSponsors = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredSponsors;
    const arr = [...filteredSponsors];
    const dir = sort.direction === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return dir * (a.name || '').localeCompare(b.name || '');
        case 'description':
          return dir * (a.description || '').localeCompare(b.description || '');
        case 'website':
          return dir * (a.website || '').localeCompare(b.website || '');
        default:
          return 0;
      }
    });
    return arr;
  }, [filteredSponsors, sort]);

  return (
  <div>
    <div className="flex justify-between items-center mb-6 gap-3">
      <h2 className="text-xl font-semibold text-gray-800">Sponsors</h2>
      <div className="flex-1 hidden md:block" />
      <SearchInput value={query} onChange={setQuery} placeholder="Search sponsors..." />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" onClick={openCreateSponsor}>
        Add New Sponsor
      </button>
    </div>

    {editingSponsor && (
      <SponsorForm
        isEditing={true}
        onSubmit={handleUpdateSponsor}
        onCancel={closeSponsorForm}
        title={`Edit Sponsor: ${editingSponsor.name}`}
        formData={newSponsor}
        onFormChange={handleSponsorFormChange}
      />
    )}

    {showCreateSponsor && (
      <SponsorForm
        isEditing={false}
        onSubmit={handleCreateSponsor}
        onCancel={closeSponsorForm}
        title="Create New Sponsor"
        formData={newSponsor}
        onFormChange={handleSponsorFormChange}
      />
    )}

    {sponsors.length === 0 ? (
      <EmptyState message="No sponsors found." />
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <SortableHeader label="Name" columnKey="name" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableHeader label="Description" columnKey="description" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableHeader label="Website" columnKey="website" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSponsors.map((sponsor) => (
              <tr key={sponsor.id}>
                <td className="px-6 py-4">
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.name} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No Logo</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{sponsor.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-lg whitespace-normal max-h-20 overflow-y-auto" style={{ maxHeight: '5rem' }}>
                    {sponsor.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {sponsor.website ? (
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 text-sm max-w-xs truncate block">
                      {sponsor.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEditSponsor(sponsor)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteSponsor(sponsor.id, sponsor.name)} className="text-red-600 hover:text-red-900 cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

