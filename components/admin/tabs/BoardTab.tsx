import React, { useMemo, useState } from 'react';
import { BoardMemberForm } from '../forms/BoardMemberForm';
import { EmptyState } from '../ui/EmptyState';
import type { BoardMember } from '../types';
import { SortableHeader } from '../ui/SortableHeader';
import { SearchInput } from '../ui/SearchInput';

interface BoardTabProps {
  boardMembers: BoardMember[];
  editingBoardMember: BoardMember | null;
  showCreateBoardMember: boolean;
  newBoardMember: any;
  handleBoardFormChange: (field: string, value: string) => void;
  handleUpdateBoardMember: (e: React.FormEvent) => void;
  handleCreateBoardMember: (e: React.FormEvent) => void;
  handleEditBoardMember: (member: BoardMember) => void;
  handleDeleteBoardMember: (id: string, name: string) => void;
  handleToggleVisibility: (id: string, currentStatus: string) => void;
  openCreateBoardMember: () => void;
  closeBoardMemberForm: () => void;
}

export const BoardTab: React.FC<BoardTabProps> = ({
  boardMembers,
  editingBoardMember,
  showCreateBoardMember,
  newBoardMember,
  handleBoardFormChange,
  handleUpdateBoardMember,
  handleCreateBoardMember,
  handleEditBoardMember,
  handleDeleteBoardMember,
  handleToggleVisibility,
  openCreateBoardMember,
  closeBoardMemberForm
}) => {
  type SortKey = 'name' | 'role' | 'email';
  const [sort, setSort] = useState<{ key: SortKey | null; direction: 'asc' | 'desc' | null }>({ key: null, direction: null });
  const [query, setQuery] = useState('');

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return boardMembers;
    return boardMembers.filter((m) =>
      (m.name || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    );
  }, [boardMembers, query]);

  const groupedMembers = useMemo(() => {
    const visible = filteredMembers.filter((m) => m.status === 'visible');
    const hidden = filteredMembers.filter((m) => m.status !== 'visible');

    const sortFn = (a: BoardMember, b: BoardMember) => {
      if (!sort.key || !sort.direction) return 0;
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.key) {
        case 'name':
          return dir * (a.name || '').localeCompare(b.name || '');
        case 'role':
          return dir * (a.role || '').localeCompare(b.role || '');
        case 'email':
          return dir * (a.email || '').localeCompare(b.email || '');
        default:
          return 0;
      }
    };

    if (sort.key && sort.direction) {
      visible.sort(sortFn);
      hidden.sort(sortFn);
    }

    return { visible, hidden };
  }, [filteredMembers, sort]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Board Members</h2>
        <div className="flex-1 hidden md:block" />
        <SearchInput value={query} onChange={setQuery} placeholder="Search members..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={openCreateBoardMember}>
          Add New Member
        </button>
      </div>

      {(editingBoardMember || showCreateBoardMember) && (
        <BoardMemberForm
          isEditing={!!editingBoardMember}
          formData={newBoardMember}
          onFormChange={handleBoardFormChange}
          onSubmit={editingBoardMember ? handleUpdateBoardMember : handleCreateBoardMember}
          onCancel={closeBoardMemberForm}
        />
      )}

      {boardMembers.length === 0 ? (
        <EmptyState message="No board members found." />
      ) : (
        <div className="space-y-8">
          {/* Visible Members Group */}
          {groupedMembers.visible.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Group</div>
                  <div className="text-base font-medium text-gray-900">Visible Members</div>
                </div>
                <div className="text-sm text-gray-700">
                  {groupedMembers.visible.length} member{groupedMembers.visible.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader label="Name" columnKey="name" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <SortableHeader label="Role" columnKey="role" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <SortableHeader label="Email" columnKey="email" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedMembers.visible.map(member => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button onClick={() => handleEditBoardMember(member)} className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button onClick={() => handleToggleVisibility(member.id, member.status)} className="text-yellow-600 hover:text-yellow-800">Hide</button>
                          <button onClick={() => handleDeleteBoardMember(member.id, member.name)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hidden Members Group */}
          {groupedMembers.hidden.length > 0 && (
            <div className="border rounded-lg overflow-hidden opacity-80">
              <div className="px-4 py-3 bg-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Group</div>
                  <div className="text-base font-medium text-gray-900">Hidden Members</div>
                </div>
                <div className="text-sm text-gray-700">
                  {groupedMembers.hidden.length} hidden member{groupedMembers.hidden.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader label="Name" columnKey="name" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <SortableHeader label="Role" columnKey="role" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <SortableHeader label="Email" columnKey="email" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedMembers.hidden.map(member => (
                      <tr key={member.id} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button onClick={() => handleEditBoardMember(member)} className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button onClick={() => handleToggleVisibility(member.id, member.status)} className="text-green-600 hover:text-green-800">Show</button>
                          <button onClick={() => handleDeleteBoardMember(member.id, member.name)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

