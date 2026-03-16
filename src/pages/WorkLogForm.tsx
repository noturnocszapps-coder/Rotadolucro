import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PlatformType, ShopeeVehicleType } from '../types';
import { PLATFORM_NAMES, calculateShopeeEarnings } from '../constants';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  DollarSign, 
  Clock, 
  Navigation, 
  Package, 
  Truck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

export const WorkLogForm = () => {
  const { workProfiles, addWorkLog } = useAppStore();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<PlatformType | ''>('');
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [kmDriven, setKmDriven] = useState<number>(0);
  const [deliveriesCount, setDeliveriesCount] = useState<number>(0);
  const [packagesCount, setPackagesCount] = useState<number>(0);
  const [routesCount, setRoutesCount] = useState<number>(1);
  const [vehicleType, setVehicleType] = useState<ShopeeVehicleType>('Passeio');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (workProfiles.length === 1) {
      setPlatform(workProfiles[0].platform_type);
    }
  }, [workProfiles]);

  // Shopee auto-calc
  useEffect(() => {
    if (platform === 'shopee' && kmDriven > 0) {
      const earnings = calculateShopeeEarnings(kmDriven, vehicleType);
      setGrossAmount(earnings);
    }
  }, [platform, kmDriven, vehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) return;
    
    setLoading(true);
    try {
      await addWorkLog({
        platform_type: platform as PlatformType,
        date,
        gross_amount: Number(grossAmount),
        bonus_amount: Number(bonusAmount),
        hours_worked: Number(hoursWorked),
        km_driven: Number(kmDriven),
        deliveries_count: Number(deliveriesCount),
        packages_count: Number(packagesCount),
        routes_count: Number(routesCount),
        vehicle_type: platform === 'shopee' ? vehicleType : undefined,
        notes
      });
      navigate('/work-logs');
    } catch (error) {
      console.error('Error saving work log:', error);
    } finally {
      setLoading(false);
    }
  };

  if (workProfiles.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-amber-500" />
        <h2 className="text-xl font-bold">Nenhuma plataforma configurada</h2>
        <p className="text-zinc-400">Vá em Ajustes para selecionar as plataformas que você trabalha.</p>
        <button onClick={() => navigate('/settings')} className="bg-emerald-500 text-zinc-950 px-6 py-2 rounded-xl font-bold">Configurar Agora</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Novo Registro de Trabalho</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Plataforma</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {workProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.platform_type)}
                className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                  platform === p.platform_type 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {PLATFORM_NAMES[p.platform_type]}
              </button>
            ))}
          </div>
        </div>

        {platform && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Calendar size={16} /> Data
                </label>
                <input 
                  type="date" 
                  required 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Hours */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Clock size={16} /> Horas Trabalhadas
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  required 
                  value={hoursWorked || ''}
                  onChange={(e) => setHoursWorked(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Ex: 8.5"
                />
              </div>

              {/* KM */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Navigation size={16} /> KM Rodados
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  required 
                  value={kmDriven || ''}
                  onChange={(e) => setKmDriven(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Ex: 120"
                />
              </div>

              {/* Platform Specific Fields */}
              {platform === 'frete' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <DollarSign size={16} /> Ganhos Brutos
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      value={grossAmount || ''}
                      onChange={(e) => setGrossAmount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Package size={16} /> Pacotes (Opcional)
                    </label>
                    <input 
                      type="number" 
                      value={packagesCount || ''}
                      onChange={(e) => setPackagesCount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Ex: 10"
                    />
                  </div>
                </>
              )}

              {platform === 'shopee' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Truck size={16} /> Tipo de Veículo
                    </label>
                    <select 
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as ShopeeVehicleType)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="Passeio">Passeio</option>
                      <option value="Fiorino">Fiorino</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <DollarSign size={16} /> Ganhos (Auto)
                    </label>
                    <input 
                      type="number" 
                      readOnly
                      value={grossAmount || ''}
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-emerald-500 font-bold focus:outline-none"
                    />
                    <p className="text-[10px] text-zinc-500">Valor calculado automaticamente pela tabela Shopee.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Package size={16} /> Pacotes Entregues
                    </label>
                    <input 
                      type="number" 
                      required 
                      value={packagesCount || ''}
                      onChange={(e) => setPackagesCount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Ex: 40"
                    />
                  </div>
                </>
              )}

              {platform === 'mercadolivre' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <DollarSign size={16} /> Ganhos Brutos
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      value={grossAmount || ''}
                      onChange={(e) => setGrossAmount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Navigation size={16} /> Rotas Concluídas
                    </label>
                    <input 
                      type="number" 
                      required 
                      value={routesCount || ''}
                      onChange={(e) => setRoutesCount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Ex: 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Package size={16} /> Pacotes Entregues
                    </label>
                    <input 
                      type="number" 
                      required 
                      value={packagesCount || ''}
                      onChange={(e) => setPackagesCount(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="Ex: 35"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Observações</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 h-24 resize-none"
                placeholder="Algum detalhe sobre o dia de hoje?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} /> Salvar Registro
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
