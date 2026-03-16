'use client';

import React from 'react';

interface ModerationActionFormProps {
  reportId: string;
  initialStatus?: string;
}

export function ModerationActionForm({ reportId, initialStatus = 'pending' }: ModerationActionFormProps) {
  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
      <h3 className="text-xl font-bold text-neutral-900 mb-6">Ação de Moderação</h3>
      <p className="text-sm text-neutral-500 mb-4">ID do Relatório: {reportId}</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Status do Relatório</label>
          <div className="px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-100 text-sm font-bold capitalize">
            {initialStatus}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="py-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
            Banir Usuário
          </button>
          <button className="py-4 bg-neutral-100 text-neutral-600 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
            Ignorar Denúncia
          </button>
        </div>
      </div>
    </div>
  );
}
