export interface PatchNote {
  version: string;
  date: string;
  title: string;
  description: string;
  items: string[];
  isNew?: boolean;
}

export const PATCH_NOTES: PatchNote[] = [
  {
    version: 'v1.0.6',
    date: '17 de Março, 2026',
    title: 'Relatórios Inteligentes',
    description: 'Agora você pode analisar seu desempenho com gráficos e insights avançados.',
    isNew: true,
    items: [
      'Nova página de relatórios',
      'Gráficos de ganhos, gastos e lucro',
      'Insights automáticos baseados no seu desempenho',
      'Filtros por período (hoje, semana, mês)'
    ]
  },
  {
    version: 'v1.0.5',
    date: '17 de Março, 2026',
    title: 'Resumo Inteligente do Dia',
    description: 'Agora você pode acompanhar seu desempenho diário de forma clara e rápida.',
    items: [
      'Novo card "Resumo de Hoje" no dashboard',
      'Exibição de ganhos, gastos e lucro líquido em tempo real',
      'Atualização automática ao adicionar ou editar registros',
      'Melhor visualização da sua performance diária'
    ]
  },
  {
    version: 'v1.0.4',
    date: '10 de Março, 2026',
    title: 'Melhorias de Estabilidade',
    description: 'Ajustes finos no sistema de sincronização com o Firebase.',
    items: [
      'Correção de bugs na edição de registros',
      'Melhoria no carregamento inicial dos dados',
      'Otimização de performance em dispositivos mobile'
    ]
  }
];
