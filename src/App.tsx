import React, { useState, useMemo, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  Outlet
} from 'react-router-dom';
import {
  Home,
  Calculator,
  PlusCircle,
  FileText,
  Settings,
} from 'lucide-react';
import { Transaction, Project } from '../types';
import { projectService } from './services/project.service';
import { transactionService } from './services/transaction.service';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useAchievements } from './hooks/useAchievements';

// Constants
import { TRANSLATIONS } from './constants/translations';

// Utils
import { triggerConfetti, triggerSchoolPride } from './utils/confetti';
import { soundManager } from './utils/soundManager';

// Components
import { InitialBalanceModal } from './components/InitialBalanceModal';
import { Loader2 } from 'lucide-react'; // Import loader for Suspense fallback

// Lazy Load Pages for Code Splitting
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const PlansPage = React.lazy(() => import('./pages/PlansPage').then(module => ({ default: module.PlansPage })));
const ChangePasswordPage = React.lazy(() => import('./pages/ChangePasswordPage').then(module => ({ default: module.ChangePasswordPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const ProjectDetailsPage = React.lazy(() => import('./pages/ProjectDetailsPage').then(module => ({ default: module.ProjectDetailsPage })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const EntriesPage = React.lazy(() => import('./pages/EntriesPage').then(module => ({ default: module.EntriesPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const SimulatorsPage = React.lazy(() => import('./pages/SimulatorsPage').then(module => ({ default: module.SimulatorsPage })));
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const TransactionsPage = React.lazy(() => import('./pages/TransactionsPage').then(module => ({ default: module.TransactionsPage })));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="w-10 h-10 animate-spin text-primary" />
  </div>
);

const ProtectedLayout: React.FC<{
  t: any;
  isAuthenticated: boolean;
}> = ({ t, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getActiveTab = () => {
    const p = location.pathname;
    if (p === '/' || p === '/dashboard') return 'home';
    if (p.startsWith('/sim')) return 'sim';
    if (p.startsWith('/entries')) return 'entries';
    if (p.startsWith('/history')) return 'history';
    if (p.startsWith('/admin')) return 'admin';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative shadow-2xl flex flex-col border-x border-border transition-colors duration-300">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <Outlet />
      </div>

      <button
        onClick={() => navigate('/entries')}
        className={`fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-[1.5rem] shadow-xl flex items-center justify-center transition-all active:scale-90 z-20 ${activeTab === 'entries' ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <PlusCircle size={28} />
      </button>

      <nav className="sticky bottom-0 bg-card/90 backdrop-blur-xl border-t border-border p-4 flex justify-between px-8 z-30 safe-area-bottom">
        {[
          { id: 'home', path: '/', icon: Home, label: t.nav.home },
          { id: 'sim', path: '/sim', icon: Calculator, label: t.nav.sim },
          { id: 'history', path: '/history', icon: FileText, label: 'Extrato' },
          { id: 'admin', path: '/admin', icon: Settings, label: t.nav.admin }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeTab === item.id ? 'text-primary' : 'text-muted hover:text-slate-500'}`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'animate-bounce-short' : ''} />
            <span className="text-[9px] font-black uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  console.log('⚛️ App Component Function Called');
  const {
    isAuthenticated,
    currentUser,
    userId,
    isPro,
    pendingGoogleUser,
    login,
    logout,
    setPendingGoogleUser,
    setIsPro,
    avatar,
    setAvatar,
    handleAvatarChange
  } = useAuth();

  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    theme,
    setTheme,
    language,
    setLanguage
  } = useTheme();

  // Route hooks
  const navigate = useNavigate();

  // Logic from old App.tsx
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Gamification
  useAchievements(userId, transactions, projects);

  useEffect(() => {
    if (isAuthenticated) {
      projectService.getAll().then(setProjects);
      transactionService.getAll().then(txs => {
        setTransactions(txs);
        // If no transactions exist, assume new user and trigger onboarding
        if (txs.length === 0) {
          setShowOnboarding(true);
        }
      });
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = async (amount: number) => {
    try {
      const newTx = await transactionService.create({
        description: 'Saldo Inicial',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        category: 'Renda',
        establishment: 'Saldo Anterior',
        type: 'income',
        recurrence: 'none',
        adjustmentRate: 0
      });
      setTransactions(prev => [newTx, ...prev]);
      setShowOnboarding(false);
      triggerConfetti();
    } catch (error) {
      console.error('Failed to save initial balance', error);
      alert('Erro ao salvar saldo inicial.');
    }
  };

  const handleSaveGoal = async (goalData: { amount: number, months: number }) => {
    try {
      const newProject = await projectService.create({
        name: `Nova Meta (${goalData.months}m)`,
        targetAmount: goalData.amount,
        currentAmount: 0,
        icon: '🎯'
      });
      setProjects(prev => [...prev, newProject]);
      navigate('/');
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Erro ao salvar meta.');
    }
  };

  const handleAddToFirstGoal = async (amount: number) => {
    if (projects.length === 0) return;

    try {
      triggerConfetti();
      const targetProject = projects[0];
      const updatedProject = await projectService.update(targetProject.id, {
        currentAmount: targetProject.currentAmount + amount
      });

      setProjects(prev => {
        const newProjects = [...prev];
        newProjects[0] = updatedProject;
        return newProjects;
      });
    } catch (error) {
      console.error('Failed to update project', error);
    }
  };



  const [challenge, setChallenge] = useState(() => {
    // Lazy init from storage
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem('dailyChallenge');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed;
      }
      return {
        date: today,
        text: 'Mano, se liga: se trocar o café da rua por um em casa hoje, você aporta **R$ 15** a mais no seu projeto. Partiu?',
        amount: 15,
        completed: false
      };
    }
    return { text: '', amount: 0, completed: false };
  });

  useEffect(() => {
    // Only generate new challenge if we have transactions and it's a generic one
    const today = new Date().toISOString().split('T')[0];
    if (challenge.date === today && challenge.amount !== 15) return; // Already customized

    const extras = transactions.filter(t => t.category === 'Extra' || t.category === 'Lazer');
    if (extras.length > 0) {
      const randomExtra = extras[Math.floor(Math.random() * extras.length)];
      const newChallenge = {
        date: today,
        text: `Brother, que tal economizar '${randomExtra.description}' hoje? Dá pra salvar **R$ ${randomExtra.amount.toFixed(0)}** pro seu sonho!`,
        amount: Math.ceil(randomExtra.amount),
        completed: false
      };
      setChallenge(newChallenge);
      localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
    }
  }, [transactions]);

  const handleAcceptChallenge = () => {
    handleAddToFirstGoal(challenge.amount);
    const updated = { ...challenge, completed: true };
    setChallenge(updated);
    localStorage.setItem('dailyChallenge', JSON.stringify(updated));
    triggerSchoolPride();
    // alert removed to be less intrusive, visual feedback is better
  };

  const DEFAULT_CATEGORIES = ['Essencial', 'Estilo de Vida', 'Investimento', 'Extra'];
  const [userCategories, setUserCategories] = useState<Record<string, string[]>>({});

  const categories = useMemo(() => {
    if (!currentUser) return DEFAULT_CATEGORIES;
    return [...DEFAULT_CATEGORIES, ...(userCategories[currentUser] || [])];
  }, [currentUser, userCategories]);

  const handleAddCategory = (cat: string) => {
    if (!currentUser) return;
    setUserCategories(prev => ({
      ...prev,
      [currentUser]: [...(prev[currentUser] || []), cat]
    }));
  };

  const t = useMemo(() => TRANSLATIONS[language], [language]);

  // Global Styles component injection is replaced by Tailwind + ThemeContext style injection

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    try {
      const created = await transactionService.create(newTx);
      setTransactions(prev => [created, ...prev]);

      // Check for daily challenge
      if (created.category === 'Extra' || created.category === 'Lazer') {
        const today = new Date().toISOString().split('T')[0];
        if (challenge.date !== today) {
          // Logic for new challenge based on new transaction could go here
        }
      }
    } catch (error) {
      console.error('Failed to create transaction', error);
      alert('Erro ao salvar transação.');
    }
  };

  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={
          <LoginPage
            onLogin={async (email) => {
              await login(email);
              navigate('/');
            }}
            onUpgrade={() => navigate('/plans')}
            onGoogleLogin={() => {
              setPendingGoogleUser({ name: 'Usuário Google', email: 'google@user.com' });
              navigate('/plans');
            }}
            language={language}
          />
        } />

        <Route path="/register" element={
          <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative shadow-2xl flex flex-col border-x border-border transition-colors duration-300">
            <RegisterPage
              onBack={() => navigate('/plans')}
              onComplete={() => {
                alert('Conta Gratuita Criada!');
                setIsPro(false);
                login('novo_free@finanzo.pro'); // Hacky login trigger
                navigate('/');
              }}
              googleUser={pendingGoogleUser}
            />
          </div>
        } />

        <Route path="/plans" element={
          <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative shadow-2xl flex flex-col border-x border-border transition-colors duration-300">
            <PlansPage
              onBack={() => navigate('/login')}
              onSelect={(plan) => {
                if (plan.includes('Pro')) {
                  navigate('/checkout');
                } else {
                  navigate('/register');
                }
              }}
            />
          </div>
        } />

        <Route path="/checkout" element={
          <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative shadow-2xl flex flex-col border-x border-border transition-colors duration-300">
            <CheckoutPage
              onBack={() => navigate('/plans')}
              onSubscribe={() => {
                alert('Assinatura Confirmada! Bem-vindo ao Pro.');
                setIsPro(true);
                login('novo_assinante@finanzo.pro');
                navigate('/');
              }}
              googleUser={pendingGoogleUser}
            />
          </div>
        } />

        {/* Protected Routes */}


        <Route element={<ProtectedLayout t={t} isAuthenticated={isAuthenticated} />}>
          {/* Onboarding Modal */}
          {
            showOnboarding && (
              <div className="fixed inset-0 z-[60]">
                <InitialBalanceModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
              </div>
            )
          }

          <Route path="/" element={
            <Dashboard
              t={t.dash}
              isPro={isPro}
              projects={projects}
              onAcceptChallenge={handleAcceptChallenge}
              onViewAll={() => navigate('/history')}
              onProjectClick={(id) => navigate(`/project/${id}`)}
              onCreateProject={() => {
                // Assuming we want to open a modal or navigate to a create page.
                // For now, let's navigate to Simulators where user can "Save Goal" or create a simple prompt?
                // Or maybe just prompt user for name/amount here?
                // Using existing mechanism of Simulators is cleaner for now or add to SimulatorsPage.
                navigate('/sim');
              }}
              challenge={challenge}
            />
          } />

          <Route path="/sim" element={
            <SimulatorsPage
              t={t.sim}
              isPro={isPro}
              language={language}
              onSaveGoal={handleSaveGoal}
            />
          } />

          <Route path="/history" element={
            <TransactionsPage
              transactions={transactions}
              onAddClick={() => navigate('/entries')}
              onImportTransactions={async (txs) => {
                // Iterate and create
                for (const tx of txs) {
                  // Must ensure types match what create expects
                  // Using cast for simplicity given mock data structure
                  try {
                    const newTx = await transactionService.create(tx as any);
                    setTransactions(prev => [newTx, ...prev]);
                  } catch (e) {
                    console.error('Import error', e);
                  }
                }
                triggerConfetti();
                soundManager.play('coin');
                alert(`${txs.length} transações importadas com sucesso!`);
              }}
            />
          } />

          <Route path="/entries" element={
            <EntriesPage
              t={t.entries}
              isPro={isPro}
              onAddInvestment={handleAddToFirstGoal}
              categories={categories}
              onAddCategory={handleAddCategory}
              language={language}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
            />
          } />


          {/* ... remaining routes ... */}

          <Route path="/profile" element={
            <ProfilePage
              t={t} // Profile translations if needed
              onBack={() => navigate('/')}
            />
          } />

          <Route path="/admin" element={
            <SettingsPage
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              secondaryColor={secondaryColor}
              setSecondaryColor={setSecondaryColor}
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              t={t.admin}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
              onChangePass={() => navigate('/password')}
              avatar={avatar}
              onAvatarChange={handleAvatarChange}
              onViewTerms={() => navigate('/terms')}
              onViewPrivacy={() => navigate('/privacy')}
              onContactSupport={(message) => {
                console.log('CRM Integration: Sending message:', message);
                alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
              }}
              onDeleteAccount={(reason) => {
                console.log('Account Deletion Requested. Reason:', reason);
                alert('Conta excluída com sucesso. Esperamos te ver em breve!');
                logout();
                navigate('/login');
              }}
            />
          } />

          <Route path="/project/:id" element={
            // Finding the project might be tricky here since logic is inside App
            // We can pass the whole projects array and let the page find it, 
            // OR create a wrapper
            <ProjectDetailsPageWrapper projects={projects} setProjects={setProjects} />
          } />
        </Route >

        <Route path="/password" element={<ChangePasswordPage onBack={() => navigate('/admin')} />} />
        <Route path="/terms" element={<TermsPage onBack={() => navigate('/admin')} initialTab="terms" />} />
        <Route path="/privacy" element={<TermsPage onBack={() => navigate('/admin')} initialTab="privacy" />} />

      </Routes >
    </React.Suspense>
  );
};

// Wrapper for ProjectDetails to handle parameter logic since we moved state from page-prop to router-param related
const ProjectDetailsPageWrapper: React.FC<{ projects: Project[], setProjects: React.Dispatch<React.SetStateAction<Project[]>> }> = ({ projects, setProjects }) => {
  const { id } = useParams(); // Hook usage inside component
  const project = projects.find(p => p.id === id);
  const navigate = useNavigate();

  if (!project) return <div>Project not found</div>;

  return (
    <ProjectDetailsPage
      project={project}
      onBack={() => navigate('/')}
      onDelete={async (delId) => {
        try {
          await projectService.delete(delId);
          setProjects(prev => prev.filter(p => p.id !== delId));
          navigate('/');
        } catch (error) {
          console.error('Failed to delete project', error);
          alert('Erro ao excluir projeto.');
        }
      }}
    />
  );
};

export default App;
