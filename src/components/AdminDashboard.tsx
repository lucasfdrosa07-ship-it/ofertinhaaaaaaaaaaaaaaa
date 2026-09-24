import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, Users, CheckCircle, TrendingDown, Eye, RefreshCw, 
  Trash2, ArrowLeft, BarChart3, ShieldCheck, AlertCircle, LogOut 
} from 'lucide-react';
import { 
  getAnalyticsData, 
  getAdminPassword, 
  setAdminPassword, 
  seedDemoData, 
  clearAnalyticsData, 
  AnalyticsData 
} from '../utils/analytics';
import { quizData } from '../data/quizData';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('admin_logged') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>(getAnalyticsData());
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'sessions' | 'settings'>('overview');
  
  // Settings state
  const [currentPass, setCurrentPass] = useState(getAdminPassword());
  const [newPass, setNewPass] = useState('');
  const [passSuccessMessage, setPassSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setAnalytics(getAnalyticsData());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === getAdminPassword()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_logged', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_logged');
  };

  const handleRefresh = () => {
    setAnalytics(getAnalyticsData());
  };

  const handleSeed = () => {
    if (confirm('Deseja carregar dados de exemplo com simulação de tráfego?')) {
      seedDemoData();
      setAnalytics(getAnalyticsData());
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja apagar todas as estatísticas registradas?')) {
      clearAnalyticsData();
      setAnalytics(getAnalyticsData());
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.trim().length < 4) {
      alert('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    setAdminPassword(newPass.trim());
    setCurrentPass(newPass.trim());
    setNewPass('');
    setPassSuccessMessage('Senha alterada com sucesso!');
    setTimeout(() => setPassSuccessMessage(''), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#7738E2]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7738E2]">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-slate-400 text-sm">Digite a senha de acesso para ver as estatísticas do quiz.</p>
            <p className="text-xs text-slate-500 mt-1">(Senha padrão inicial: <code className="text-purple-400 font-mono">admin21</code>)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Senha de Acesso</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7738E2]"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm flex items-center gap-1.5">
                <AlertCircle size={16} /> Senha incorreta. Tente novamente.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#7738E2] text-white font-semibold rounded-lg hover:bg-[#652cc5] transition-colors cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar para o Quiz
            </a>
          </div>
        </div>
      </div>
    );
  }

  const conversionRate = analytics.totalVisits > 0 
    ? ((analytics.completions / analytics.totalVisits) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7738E2] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-purple-900/30">
            21
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Dashboard do Quiz - Desafio Calistenia</h1>
            <p className="text-xs text-slate-400">Monitoramento de acessos e funil de abandono</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Ver Quiz
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 border border-red-800/50"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-6 flex-1 flex flex-col gap-6">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#7738E2] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('funnel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'funnel' ? 'bg-[#7738E2] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Funil e Abandono por Etapa
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'sessions' ? 'bg-[#7738E2] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sessões Recentes ({analytics.sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#7738E2] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Configurações
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Atualizar dados"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleSeed}
              className="px-3 py-2 bg-indigo-900/60 hover:bg-indigo-800/60 text-indigo-200 text-xs font-semibold rounded-lg border border-indigo-700/50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BarChart3 size={14} /> Simular Tráfego (Demo)
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-lg border border-red-900/40 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Limpar Dados
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-sm font-medium">Total de Acessos</span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Eye size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{analytics.totalVisits}</div>
                <p className="text-xs text-slate-500 mt-1">Visitantes que abriram o quiz</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-sm font-medium">Conclusões do Quiz</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{analytics.completions}</div>
                <p className="text-xs text-slate-500 mt-1">Chegaram até a oferta final</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-sm font-medium">Taxa de Conversão</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Users size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{conversionRate}%</div>
                <p className="text-xs text-slate-500 mt-1">Visitas convertidas em conclusão</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-sm font-medium">Sessões Registradas</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <TrendingDown size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{analytics.sessions.length}</div>
                <p className="text-xs text-slate-500 mt-1">Histórico de navegação ativo</p>
              </div>
            </div>

            {/* Quick Funnel Highlights */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h2 className="text-lg font-bold text-white mb-4">Etapas com Maior Abandono (Onde as pessoas param)</h2>
              <div className="space-y-3">
                {Object.entries(analytics.dropOffs)
                  .sort((a, b) => Number(b[1]) - Number(a[1]))
                  .slice(0, 5)
                  .map(([stepIdStr, count]) => {
                    const stepId = Number(stepIdStr);
                    const stepInfo = quizData.find(s => s.id === stepId);
                    const views = analytics.stepViews[stepId] || 1;
                    const dropRate = Math.round((Number(count) / (views || 1)) * 100);

                    return (
                      <div key={stepId} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-950 text-purple-300 rounded-md border border-purple-800/50">
                            Etapa {stepId}
                          </span>
                          <h3 className="text-sm font-medium text-white mt-1.5">
                            {stepInfo?.title || `Etapa ${stepId}`}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-red-400">{count} saídas</span>
                          <p className="text-xs text-slate-500">~{dropRate}% taxa de abandono nesta etapa</p>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(analytics.dropOffs).length === 0 && (
                  <p className="text-slate-400 text-sm py-4 text-center">Nenhum dado de abandono registrado ainda. Simule tráfego ou aguarde usuários.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Funnel & Drop-off table */}
        {activeTab === 'funnel' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Funil Detalhado por Etapa (1 a {quizData.length})</h2>
              <p className="text-xs text-slate-400 mt-1">Veja exatamente quantos acessos cada etapa recebeu e onde os usuários param de avançar.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4">Etapa</th>
                    <th className="p-4">Título da Etapa</th>
                    <th className="p-4">Visualizações</th>
                    <th className="p-4">Abandonos (Pararam aqui)</th>
                    <th className="p-4">Taxa de Abandono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {quizData.map((step) => {
                    const views = analytics.stepViews[step.id] || 0;
                    const dropOffs = analytics.dropOffs[step.id] || 0;
                    const dropRate = views > 0 ? Math.round((dropOffs / views) * 100) : 0;

                    return (
                      <tr key={step.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono text-purple-400 font-semibold">#{step.id}</td>
                        <td className="p-4 font-medium text-white max-w-xs truncate">{step.title}</td>
                        <td className="p-4 text-slate-300">{views}</td>
                        <td className="p-4 text-red-400 font-semibold">{dropOffs}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-red-500 h-full rounded-full" 
                                style={{ width: `${Math.min(dropRate, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{dropRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Recent Sessions */}
        {activeTab === 'sessions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Histórico de Sessões de Usuários</h2>
              <p className="text-xs text-slate-400 mt-1">Lista de acessos recentes, última etapa alcançada e status de conclusão.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4">ID da Sessão</th>
                    <th className="p-4">Horário de Início</th>
                    <th className="p-4">Última Etapa Alcançada</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {analytics.sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-400">{session.id}</td>
                      <td className="p-4 text-slate-300">{new Date(session.startedAt).toLocaleString('pt-BR')}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-800 text-purple-300 rounded-md text-xs font-semibold border border-slate-700">
                          Etapa {session.maxStep} / {quizData.length}
                        </span>
                      </td>
                      <td className="p-4">
                        {session.completed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs font-medium border border-emerald-800/50">
                            <CheckCircle size={12} /> Concluído
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950 text-amber-400 rounded-full text-xs font-medium border border-amber-800/50">
                            <TrendingDown size={12} /> Parou na Etapa {session.maxStep}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {analytics.sessions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        Nenhuma sessão registrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-xl">
            <h2 className="text-lg font-bold text-white mb-2">Configurações do Painel</h2>
            <p className="text-xs text-slate-400 mb-6">Altere a senha de segurança para acessar a rota <code className="text-purple-400">/admin</code>.</p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nova Senha de Admin</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Key size={18} />
                  </span>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Digite a nova senha..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#7738E2]"
                  />
                </div>
              </div>

              {passSuccessMessage && (
                <p className="text-emerald-400 text-sm flex items-center gap-1.5">
                  <ShieldCheck size={16} /> {passSuccessMessage}
                </p>
              )}

              <button
                type="submit"
                className="py-3 px-6 bg-[#7738E2] text-white font-semibold rounded-lg hover:bg-[#652cc5] transition-colors cursor-pointer"
              >
                Atualizar Senha
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
