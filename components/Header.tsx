import React, { useState } from 'react';
import { MenuIcon, UserRoundIcon, UsersIcon, HomeIcon, FileBarChartIcon, BriefcaseIcon, CopyIcon, BeakerIcon, LayersIcon, CloseIcon } from './Icons';
import { UserProfile } from '../types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onPageChange: (page: string) => void;
  userProfile: UserProfile;
  onToggleProfile: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onPageChange, userProfile, onToggleProfile, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const menuItems = [
    { title: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, page: 'dashboard' },
    { title: 'Relatórios', icon: <FileBarChartIcon className="h-5 w-5" />, page: 'relatorios' },
    { 
      title: 'Gestão', 
      icon: <BriefcaseIcon className="h-5 w-5" />, 
      subItems: [
        { title: 'Filas', page: 'queueManagement' },
        { title: 'Controle de Usuários', page: 'controleUsuarios' }
      ]
    },
    {
      title: 'Fracionamento',
      icon: <CopyIcon className="h-5 w-5" />,
      subItems: [
        { title: 'Documentos', page: 'fracionamentoDocumentos' },
        { title: 'Recurso em Lote', page: 'recursoLote' },
        { title: 'Tipos Documentos', page: 'tiposDocumentos' },
        { title: 'Demandas', page: 'demandas' },
        { title: 'Pastas', page: 'pastas' }
      ]
    },
    {
      title: 'Análise',
      icon: <BeakerIcon className="h-5 w-5" />,
      subItems: [
        { title: 'Conferência Rej. de Apontamentos', page: 'rejectionConference' },
        { title: 'Gestão de Filas', page: 'analiseGestaoFilas' },
        { title: 'Documentos de análises', page: 'documentAnalysis' },
        { title: 'Perguntas', page: 'perguntas' },
        { title: 'Análise Exemplificada (Novo)', page: 'exemplifiedAnalysis' }
      ]
    },
    {
      title: 'Camada de Controle',
      icon: <LayersIcon className="h-5 w-5" />,
      subItems: [
        { title: 'Grupos de Usuários', page: 'gruposUsuarios' },
        { title: 'Painel do Analista', page: 'painelAnalista' },
        { title: 'Gestão de Filas', page: 'controleGestaoFilas' }
      ]
    }
  ];

  return (
    <header className="bg-[#005c9e] text-white flex items-center justify-between p-3 shadow-md relative z-50">
      <div className="flex items-center">
        <button className="p-2 relative" onClick={handleMenuClick} aria-label="Open menu">
          <MenuIcon className="h-6 w-6" />
        </button>
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={() => setIsMenuOpen(false)}></div>
            <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-[9999] overflow-y-auto flex flex-col animate-fade-in">
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <span className="font-bold text-[#005c9e] text-lg">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-800">
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="py-4 flex-grow">
                {menuItems.map((item, index) => (
                  <div key={index} className="mb-4">
                    {item.subItems ? (
                      <>
                        <div className="flex items-center px-6 py-2 text-[#6082b6] font-medium">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          {item.subItems.map((subItem, subIndex) => {
                            const isActive = currentPage === subItem.page;
                            return (
                              <button
                                key={subIndex}
                                onClick={() => handleNavigation(subItem.page)}
                                className={`flex items-center justify-between pl-14 pr-6 py-2 text-sm text-left transition-colors ${
                                  isActive 
                                    ? 'bg-[#005c9e] text-white rounded-r-full mr-4' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#005c9e]'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-1.5 h-1.5 rounded-sm border mr-3 ${isActive ? 'border-white bg-transparent' : 'border-gray-400 bg-transparent'}`}></div>
                                  {subItem.title}
                                </div>
                                {subItem.page === 'rejectionConference' && (
                                  <div title="Há dossiês para revisar" className="flex-shrink-0">
                                    <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item.page)}
                        className={`flex items-center justify-between w-full px-6 py-2 text-left font-medium transition-colors ${
                          currentPage === item.page 
                            ? 'bg-[#005c9e] text-white rounded-r-full mr-4' 
                            : 'text-[#6082b6] hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        {item.page === 'rejectionConference' && (
                          <div title="Há dossiês para revisar" className="flex-shrink-0">
                            <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleProfile}
          title="Alternar perfil (demonstração)"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10"
        >
          {userProfile.role === 'analyst' ? <UserRoundIcon className="h-5 w-5"/> : <UsersIcon className="h-5 w-5"/> }
          <span className="text-sm font-medium capitalize">{userProfile.role}</span>
        </button>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xl">
            W
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">mario@sophie.chat</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm">14:30:11</p>
          <p className="text-xs text-gray-200">10/12/2025</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
