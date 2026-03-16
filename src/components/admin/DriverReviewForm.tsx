'use client';

import React from 'react';

interface DriverReviewFormProps {
  driverId: string;
  initialStatus: string;
  initialNotes: string;
}

export function DriverReviewForm({ driverId, initialStatus, initialNotes }: DriverReviewFormProps) {
  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
      <h3 className="text-xl font-bold text-neutral-900 mb-6">Revisão do Perfil</h3>
      <p className="text-sm text-neutral-500 mb-4">ID do Motorista: {driverId}</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Status Atual</label>
          <div className="px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-sm font-bold capitalize">
            {initialStatus}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Notas Administrativas</label>
          <textarea 
            className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-sm min-h-[100px]"
            defaultValue={initialNotes}
            placeholder="Adicione observações sobre este motorista..."
          />
        </div>
        <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
