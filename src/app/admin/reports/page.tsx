import { getReports } from '@/actions/moderation';
import { REPORT_STATUS, REPORT_REASONS } from '@/constants';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ShieldAlert,
  Search
} from 'lucide-react';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const currentStatus = params.status || REPORT_STATUS.PENDING;
  const reports = await getReports(currentStatus);

  const stats = {
    pending: (await getReports(REPORT_STATUS.PENDING)).length,
    resolved: (await getReports(REPORT_STATUS.RESOLVED)).length,
    dismissed: (await getReports(REPORT_STATUS.DISMISSED)).length,
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      [REPORT_REASONS.INAPPROPRIATE_BEHAVIOR]: 'Comportamento Inadequado',
      [REPORT_REASONS.HARASSMENT]: 'Assédio',
      [REPORT_REASONS.SCAM]: 'Fraude / Golpe',
      [REPORT_REASONS.SAFETY_CONCERN]: 'Segurança',
      [REPORT_REASONS.NO_SHOW]: 'Não comparecimento',
      [REPORT_REASONS.OTHER]: 'Outro',
    };
    return labels[reason] || reason;
  };

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Moderação</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900">Denúncias e Segurança</h1>

          <nav className="flex items-center gap-6 mt-8 border-b border-neutral-200">
            <Link 
              href="/admin/dashboard" 
              className="pb-4 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-all"
            >
              Aprovações
            </Link>
            <Link 
              href="/admin/reports" 
              className="pb-4 text-sm font-bold text-rose-600 border-b-2 border-rose-600 transition-all"
            >
              Denúncias
            </Link>
          </nav>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            href="?status=pending"
            className={`p-6 rounded-[32px] border transition-all ${
              currentStatus === REPORT_STATUS.PENDING 
                ? 'bg-white border-rose-200 shadow-lg shadow-rose-50 ring-2 ring-rose-500/10' 
                : 'bg-white border-neutral-100 hover:border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Pendentes</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.pending}</p>
              </div>
            </div>
          </Link>

          <Link 
            href="?status=resolved"
            className={`p-6 rounded-[32px] border transition-all ${
              currentStatus === REPORT_STATUS.RESOLVED 
                ? 'bg-white border-emerald-200 shadow-lg shadow-emerald-50 ring-2 ring-emerald-500/10' 
                : 'bg-white border-neutral-100 hover:border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Resolvidas</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.resolved}</p>
              </div>
            </div>
          </Link>

          <Link 
            href="?status=dismissed"
            className={`p-6 rounded-[32px] border transition-all ${
              currentStatus === REPORT_STATUS.DISMISSED 
                ? 'bg-white border-neutral-200 shadow-lg shadow-neutral-50 ring-2 ring-neutral-500/10' 
                : 'bg-white border-neutral-100 hover:border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Arquivadas</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.dismissed}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-neutral-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              {currentStatus === REPORT_STATUS.PENDING ? 'Denúncias em Aberto' : 
               currentStatus === REPORT_STATUS.RESOLVED ? 'Histórico de Resoluções' : 'Denúncias Arquivadas'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Denunciado</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Motivo</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Denunciante</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Data</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-900">{report.reported?.full_name}</span>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">{report.reported?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                          {getReasonLabel(report.reason)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-neutral-500">
                        {report.reporter?.full_name}
                      </td>
                      <td className="px-8 py-6 text-sm text-neutral-500">
                        {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/admin/reports/${report.id}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          Analisar <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-neutral-400 font-medium">Nenhuma denúncia encontrada nesta categoria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
