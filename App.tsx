import React, { useState } from 'react';
import Header from './components/Header';
import UserManagement from './components/UserManagement';
import DocumentAnalysisPage from './components/DocumentAnalysisPage';
import ExemplifiedAnalysis from './components/ExemplifiedAnalysis';
import RejectionConference from './components/RejectionConference';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('rejectionConference');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Analista Teste', role: 'analyst' });

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const toggleUserProfile = () => {
    setUserProfile(currentProfile => 
      currentProfile.role === 'analyst' 
        ? { name: 'Gestor Teste', role: 'manager' }
        : { name: 'Analista Teste', role: 'analyst' }
    );
  };

  const renderContent = () => {
    if (currentPage === 'queueManagement' || currentPage === 'analiseGestaoFilas' || currentPage === 'controleGestaoFilas') {
      return (
        <main className="p-4 sm:p-6 lg:p-8 flex-grow">
          <Breadcrumbs paths={[{ label: 'Gestão', link: '#' }, { label: 'Filas', link: '#' }]} />
          <UserManagement />
        </main>
      );
    }
    
    if (currentPage === 'rejectionConference') {
      return (
        <main className="p-4 sm:p-6 lg:p-8 flex-grow">
          <Breadcrumbs paths={[{ label: 'Conferência', link: '#' }, { label: 'Rej. de Apontamentos', link: '#' }]} />
          <RejectionConference onNavigate={handlePageChange} />
        </main>
      );
    }

    if (currentPage === 'documentAnalysis') {
      return (
        <main className="p-4 sm:p-6 lg:p-8 flex-grow">
          <Breadcrumbs paths={[{ label: 'Análise', link: '#' }, { label: 'Documentos análise', link: '#' }]} />
          <DocumentAnalysisPage userProfile={userProfile} />
        </main>
      );
    }

    if (currentPage === 'exemplifiedAnalysis') {
      return <ExemplifiedAnalysis />;
    }

    // All other pages show the empty state
    return (
      <main className="p-4 sm:p-6 lg:p-8 flex-grow flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Página Vazia</h2>
          <p className="text-gray-500">Não faz parte do protótipo</p>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col">
      <Header 
        onPageChange={handlePageChange} 
        userProfile={userProfile} 
        onToggleProfile={toggleUserProfile} 
        currentPage={currentPage}
      />
      
      {renderContent()}
    </div>
  );
};

interface BreadcrumbsProps {
  paths: { label: string; link: string; }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <div className="mb-4 text-sm text-gray-600 flex items-center">
      {paths.map((path, index) => (
        <React.Fragment key={path.label}>
          <a href={path.link} className={index === paths.length - 1 ? "font-semibold text-gray-800" : "hover:text-[#005c9e]"}>
            {path.label}
          </a>
          {index < paths.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;
