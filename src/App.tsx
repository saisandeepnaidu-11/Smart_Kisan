import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { RoleSelection } from './components/RoleSelection';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { LandownerDashboard } from './components/LandownerDashboard';
import { PestStore } from './components/PestStore';
import { CropYieldPredictor } from './components/CropYieldPredictor';
import { UserRole } from './lib/mongodb';

type AuthView = 'role-selection' | 'login' | 'signup';
type AppPage = 'dashboard' | 'pest-store' | 'crop-predictor';

function App() {
  const { user, profile, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    if (authView === 'role-selection') {
      return (
        <RoleSelection
          onSelectRole={(role) => {
            setSelectedRole(role);
            setAuthView('login');
          }}
        />
      );
    }

    if (authView === 'login') {
      return (
        <LoginPage
          role={selectedRole}
          onBack={() => setAuthView('role-selection')}
          onSwitchToSignup={() => setAuthView('signup')}
        />
      );
    }

    return (
      <SignupPage
        role={selectedRole}
        onBack={() => setAuthView('role-selection')}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as AppPage)} />

      {currentPage === 'dashboard' && (
        <>
          {profile.role === 'farmer' ? <FarmerDashboard /> : <LandownerDashboard />}
        </>
      )}

      {currentPage === 'pest-store' && <PestStore />}

      {currentPage === 'crop-predictor' && <CropYieldPredictor />}
    </div>
  );
}

export default App;
