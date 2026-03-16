import { getReportDetail } from '@/actions/moderation';
import { ModerationActionForm } from '@/components/admin/ModerationActionForm';
import { 
  ArrowLeft, 
  User, 
  MessageSquare, 
  History, 
  AlertTriangle,
  Info,
  ShieldAlert,
  Calendar,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { report, contextData } = await getReportDetail(id);

  if (!report) notFound();

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/admin/reports"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Denúncias
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">Análise de Denúncia</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900">Caso #{report.id.slice(0, 8)}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Report Content */}
            <section className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Conteúdo da Denúncia</h3>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                  {report.reason.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-6">
                {report.details || "Nenhum detalhe adicional fornecido."}
              </p>
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Enviada em {new Date(report.created_at).toLocaleString('pt-BR')}
              </div>
            </section>

            {/* Context Data */}
            <section className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Contexto da Ocorrência
              </h3>

              {report.context_type === 'chat' || report.context_type === 'connection' ? (
                <div className="space-y-6">
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                      <MapPin className="w-3 h-3" /> Solicitação Relacionada
                    </div>
                    <p className="font-bold text-neutral-900">{contextData?.request?.event_name}</p>
                    <p className="text-xs text-neutral-500">{contextData?.request?.event_location}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" /> Histórico de Chat
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      {contextData?.messages?.length > 0 ? (
                        contextData.messages.map((msg: any) => (
                          <div key={msg.id} className={`flex flex-col ${msg.sender_id === report.reporter_id ? 'items-start' : 'items-end'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                              msg.sender_id === report.reporter_id 
                                ? 'bg-white text-neutral-700 rounded-tl-none' 
                                : 'bg-indigo-600 text-white rounded-tr-none'
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-[9px] text-neutral-400 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR')}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-8 text-xs text-neutral-400 italic">Nenhuma mensagem trocada.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <p className="text-sm text-neutral-500">Contexto de solicitação direta.</p>
                </div>
              )}
            </section>

            {/* Action Form */}
            {report.status === 'pending' && (
              <ModerationActionForm reportId={report.id} />
            )}
          </div>

          <div className="space-y-8">
            {/* Involved Parties */}
            <section className="bg-white rounded-[32px] border border-neutral-100 p-6 shadow-sm">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Partes Envolvidas</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Denunciado</p>
                    <p className="font-bold text-neutral-900">{report.reported?.full_name}</p>
                    <p className="text-xs text-neutral-500">{report.reported?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Denunciante</p>
                    <p className="font-bold text-neutral-900">{report.reporter?.full_name}</p>
                    <p className="text-xs text-neutral-500">{report.reporter?.email}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Moderation History */}
            <section className="bg-white rounded-[32px] border border-neutral-100 p-6 shadow-sm">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <History className="w-4 h-4" /> Histórico de Ações
              </h4>
              
              <div className="space-y-4">
                {report.moderation_logs?.length > 0 ? (
                  report.moderation_logs.map((log: any) => (
                    <div key={log.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{log.action}</span>
                        <span className="text-[9px] text-neutral-400">{new Date(log.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-xs text-neutral-600 italic">"{log.notes}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 italic text-center py-4">Nenhuma ação tomada ainda.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
