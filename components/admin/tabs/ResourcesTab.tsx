import React, { useMemo, useState } from 'react';
import { ResourceForm } from '../forms/ResourceForm';
import { EmptyState } from '../ui/EmptyState';
import type { Resource } from '../types';
import { SortableHeader } from '../ui/SortableHeader';
import { SearchInput } from '../ui/SearchInput';

interface ResourcesTabProps {
  resources: Resource[];
  editingResource: Resource | null;
  showCreateResource: boolean;
  newResource: any;
  handleResourceFormChange: (field: string, value: string) => void;
  handleUpdateResource: (e: React.FormEvent) => void;
  handleCreateResource: (e: React.FormEvent) => void;
  handleEditResource: (resource: Resource) => void;
  handleDeleteResource: (resourceId: string, resourceTitle: string) => void;
  openCreateResource: () => void;
  closeResourceForm: () => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({
  resources,
  editingResource,
  showCreateResource,
  newResource,
  handleResourceFormChange,
  handleUpdateResource,
  handleCreateResource,
  handleEditResource,
  handleDeleteResource,
  openCreateResource,
  closeResourceForm
}) => {
  type SortKey = 'title' | 'description' | 'category' | 'url';
  const [sort, setSort] = useState<{ key: SortKey | null; direction: 'asc' | 'desc' | null }>({ key: null, direction: null });
  const [query, setQuery] = useState('');

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) =>
      (r.title || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.category || '').toLowerCase().includes(q) ||
      (r.url || '').toLowerCase().includes(q)
    );
  }, [resources, query]);

  const sortedResources = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredResources;
    const arr = [...filteredResources];
    const dir = sort.direction === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return dir * (a.title || '').localeCompare(b.title || '');
        case 'description':
          return dir * (a.description || '').localeCompare(b.description || '');
        case 'category':
          return dir * (a.category || '').localeCompare(b.category || '');
        case 'url':
          return dir * (a.url || '').localeCompare(b.url || '');
        default:
          return 0;
      }
    });
    return arr;
  }, [filteredResources, sort]);

  // Extract unique categories from resources (trimmed and sorted)
  const existingCategories = useMemo(() => {
    const categories = new Set<string>();
    resources.forEach((resource) => {
      if (resource.category) {
        const trimmed = resource.category.trim();
        if (trimmed) {
          categories.add(trimmed);
        }
      }
    });
    return Array.from(categories).sort();
  }, [resources]);

  return (
  <div>
    <div className="flex justify-between items-center mb-6 gap-3">
      <h2 className="text-xl font-semibold text-gray-800">Resources</h2>
      <div className="flex-1 hidden md:block" />
      <SearchInput value={query} onChange={setQuery} placeholder="Search resources..." />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer" onClick={openCreateResource}>
        Add New Resource
      </button>
    </div>

    {editingResource && (
      <ResourceForm
        isEditing={true}
        onSubmit={handleUpdateResource}
        onCancel={closeResourceForm}
        title={`Edit Resource: ${editingResource.title}`}
        formData={newResource}
        onFormChange={handleResourceFormChange}
        existingCategories={existingCategories}
      />
    )}

    {showCreateResource && (
      <ResourceForm
        isEditing={false}
        onSubmit={handleCreateResource}
        onCancel={closeResourceForm}
        title="Create New Resource"
        formData={newResource}
        onFormChange={handleResourceFormChange}
        existingCategories={existingCategories}
      />
    )}

    {resources.length === 0 ? (
      <EmptyState message="No resources found." />
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Title" columnKey="title" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableHeader label="Description" columnKey="description" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableHeader label="Category" columnKey="category" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableHeader label="URL" columnKey="url" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResources.map((resource) => (
              <tr key={resource.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs whitespace-normal">{resource.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-lg whitespace-normal max-h-20 overflow-y-auto" style={{ maxHeight: '5rem' }}>
                    {resource.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.category || '-'}</td>
                <td className="px-6 py-4">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 text-sm max-w-xs truncate block">
                    {resource.url}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEditResource(resource)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteResource(resource.id, resource.title)} className="text-red-600 hover:text-red-900 cursor-pointer">Delete</button>
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

