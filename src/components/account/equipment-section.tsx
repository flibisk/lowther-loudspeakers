'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Speaker, Loader2 } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  addedAt: string;
  fromOrder: boolean;
}

interface EquipmentSectionProps {
  userId: string;
  refreshTrigger?: number;
}

export function EquipmentSection({ userId, refreshTrigger = 0 }: EquipmentSectionProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, [userId, refreshTrigger]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/account/equipment');
      if (response.ok) {
        const data = await response.json();
        setEquipment(data.equipment || []);
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newEquipmentName.trim()) return;
    
    setAdding(true);
    try {
      const response = await fetch('/api/account/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEquipmentName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setEquipment(prev => [...prev, data.equipment]);
        setNewEquipmentName('');
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add equipment:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/account/equipment?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEquipment(prev => prev.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete equipment:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-sarabun text-xs uppercase tracking-wider text-neutral-400 mb-3">
        My Hi-Fi Equipment
      </h3>
      <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <>
            {/* Equipment Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                >
                  <Speaker className="h-4 w-4 text-neutral-400" />
                  <span className="font-sarabun text-sm text-neutral-700">{item.name}</span>
                  {!item.fromOrder && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="ml-1 rounded p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              ))}

              {equipment.length === 0 && !showAddForm && (
                <p className="font-sarabun text-sm text-neutral-500">
                  No equipment added yet
                </p>
              )}
            </div>

            {/* Add Equipment Form */}
            {showAddForm ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g. TP1 Loudspeaker Pair"
                  autoFocus
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-sarabun text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none"
                />
                <button
                  onClick={handleAdd}
                  disabled={adding || !newEquipmentName.trim()}
                  className="rounded-lg bg-neutral-900 px-4 py-2 font-sarabun text-sm text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewEquipmentName('');
                  }}
                  className="rounded-lg border border-neutral-200 px-4 py-2 font-sarabun text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-2 font-sarabun text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Equipment
              </button>
            )}

            {/* Info text */}
            <p className="mt-4 flex items-center gap-2 font-sarabun text-xs text-neutral-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Show off your setup! Lowther orders are added automatically.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
