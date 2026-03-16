import { getDriverDetail } from '@/actions/admin';
import { DriverReviewForm } from '@/components/admin/DriverReviewForm';
import { 
  ArrowLeft, 
  FileText, 
  ExternalLink, 
  User, 
  Mail, 
  Calendar,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await getDriverDetail(id);

  if (!driver) notFound();

  // Assuming driver_documents is a JSON object with URLs
  const documents = driver.driver_documents || {};

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900">{driver.full_name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <Mail className="w-4 h-4" /> {driver.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <Calendar className="w-4 h-4" /> Inscrito em {new Date(driver.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Documents Section */}
          <section className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Documentação Enviada
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(documents).length > 0 ? (
                Object.entries(documents).map(([key, url]) => (
                  <a 
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 group-hover:text-indigo-600 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-neutral-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-indigo-600" />
                  </a>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <ShieldAlert className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Nenhum documento anexado a este perfil.</p>
                </div>
              )}
            </div>
          </section>

          {/* Review Form */}
          <DriverReviewForm 
            driverId={driver.id} 
            initialStatus={driver.driver_status}
            initialNotes={driver.admin_notes || ''}
          />
        </div>
      </div>
    </main>
  );
}
