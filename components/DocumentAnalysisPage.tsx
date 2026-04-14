import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, ChevronDownIcon, CalendarIcon, XCircleIcon, UserRoundIcon, AssignIcon, EyeIcon, RefreshCwIcon, ZapIcon } from './Icons';
import { UserProfile } from '../types';

interface AnalysisDocument {
  id: string;
  numeroDossie: string;
  dataInicial: string;
  dataFinalizacao?: string;
  status: 'Aguardando Pré-Análise' | 'Analisado' | 'Conforme' | 'Pré-Análise';
  diasRestantes?: number;
  fh123?: string;
  acaoAtribuido?: boolean;
  acaoVisualizar?: boolean;
  acaoPreAnalise?: boolean;
  acaoReprocessar?: boolean;
  atribuidoPara?: string;
}

const initialDocumentsData: AnalysisDocument[] = [
  { id: '1945', numeroDossie: '9001318222023_29_000008184674_1.pdf', dataInicial: '09/12/2025 11:04', status: 'Aguardando Pré-Análise', acaoAtribuido: true, acaoPreAnalise: true },
  { id: '2170', numeroDossie: '9001318223722_53122_0009040035122_1.pdf', dataInicial: '08/12/2025 16:10', dataFinalizacao: '10/12/2025 15:19', status: 'Analisado', atribuidoPara: 'Analista Teste', acaoAtribuido: true, acaoVisualizar: true, acaoReprocessar: true },
  { id: '1859', numeroDossie: '142309_9001320827137_53131_9095894450341_1', dataInicial: '03/12/2025 17:16', dataFinalizacao: '04/12/2025 15:24', status: 'Conforme', fh123: 'FH1', atribuidoPara: 'Analista Teste', acaoVisualizar: true },
  { id: '1581', numeroDossie: '10106620963_12_0000160035021_1.pdf', dataInicial: '03/12/2025 15:38', dataFinalizacao: '03/12/2025 17:25', status: 'Conforme', fh123: 'FH1', atribuidoPara: 'Daniel Souza', acaoVisualizar: true },
  { id: '1534', numeroDossie: '132736_9001319657709_53145_0000010006290_1', dataInicial: '02/12/2025 20:56', status: 'Aguardando Pré-Análise', fh123: 'FH1', acaoAtribuido: true, acaoPreAnalise: true },
  { id: '1953', numeroDossie: '03100437686_52126_0000332200930_1.pdf', dataInicial: '02/12/2025 20:43', status: 'Aguardando Pré-Análise', acaoAtribuido: true, acaoPreAnalise: true },
  { id: '1955', numeroDossie: '10104828976_53150_0000000534714_1.pdf', dataInicial: '02/12/2025 20:43', status: 'Aguardando Pré-Análise', acaoAtribuido: true, acaoPreAnalise: true },
  { id: '1957', numeroDossie: '9001318222229_29_0070900013_1.pdf', dataInicial: '02/12/2025 20:42', status: 'Pré-Análise', atribuidoPara: 'Analista Teste', acaoAtribuido: true },
  { id: '1963', numeroDossie: '9001318223753_53145_0009040035115_1.pdf', dataInicial: '02/12/2025 20:39', status: 'Pré-Análise', atribuidoPara: 'Elvio Trindade', acaoAtribuido: true },
  { id: '1966', numeroDossie: '10000000_12_0000060071000_1.pdf', dataInicial: '02/12/2025 20:36', status: 'Pré-Análise', atribuidoPara: 'Roberto Dias', acaoAtribuido: true },
];

interface DocumentAnalysisPageProps {
  userProfile: UserProfile;
}

const DocumentAnalysisPage: React.FC<DocumentAnalysisPageProps> = ({ userProfile }) => {
  const [allAnalysisDocuments, setAllAnalysisDocuments] = useState<AnalysisDocument[]>(initialDocumentsData);
  const [isAssigning, setIsAssigning] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showOnlyMyDossiers, setShowOnlyMyDossiers] = useState(true);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const displayedDocuments = useMemo(() => {
    if (showOnlyMyDossiers) {
      return allAnalysisDocuments.filter(doc => doc.atribuidoPara === userProfile.name);
    }
    return allAnalysisDocuments;
  }, [showOnlyMyDossiers, allAnalysisDocuments, userProfile.name]);

  const handleGetNextDossier = () => {
    setIsAssigning(true);
    setNotification(null);

    setTimeout(() => {
      const nextDocIndex = allAnalysisDocuments.findIndex(doc => doc.status === 'Aguardando Pré-Análise');
      
      if (nextDocIndex !== -1) {
        const docToAssign = allAnalysisDocuments[nextDocIndex];
        const updatedDocuments = [...allAnalysisDocuments];
        updatedDocuments[nextDocIndex] = {
          ...docToAssign,
          status: 'Pré-Análise',
          atribuidoPara: userProfile.name,
          acaoPreAnalise: false, // Now assigned, so can't pre-analyze again
          acaoVisualizar: true, // Can now view it
        };
        setAllAnalysisDocuments(updatedDocuments);
        setNotification({ message: `Dossiê ID ${docToAssign.id} atribuído a você.`, type: 'success' });
      } else {
        setNotification({ message: 'Não há dossiês disponíveis na sua fila no momento.', type: 'info' });
      }
      setIsAssigning(false);
    }, 1000); // Simulate network delay
  };

  const getStatusClasses = (status: AnalysisDocument['status']) => {
    switch (status) {
      case 'Analisado': return 'bg-green-100 text-green-700';
      case 'Conforme': return 'bg-blue-100 text-blue-700';
      case 'Aguardando Pré-Análise': return 'bg-yellow-100 text-yellow-700';
      case 'Pré-Análise': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 relative">
      {notification && (
          <div className={`absolute top-4 right-4 z-20 p-3 rounded-md shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>
              {notification.message}
          </div>
      )}
      {/* Filters Section */}
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 mb-6">
        {userProfile.role === 'analyst' && (
          <div className="flex-shrink-0">
             <button 
              onClick={handleGetNextDossier}
              disabled={isAssigning}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#005c9e] text-white font-bold py-2.5 px-6 rounded-md hover:bg-[#004a7c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                <ZapIcon className={`h-5 w-5 ${isAssigning ? 'animate-pulse' : ''}`} />
                <span>{isAssigning ? 'Buscando...' : 'Pegar Próximo Dossiê'}</span>
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3 flex-grow">
            <div className="flex-grow max-w-xs min-w-[200px]">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                    type="text"
                    placeholder="Buscar por: ID do documento, Número Dossiê"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 placeholder-gray-500 text-sm"
                    />
                </div>
            </div>

            <SelectInput placeholder="Selecione o status" options={['Todos', 'Aguardando Pré-Análise', 'Analisado', 'Conforme', 'Pré-Análise']} />
            <SelectInput placeholder="Selecione o Tipo da Análise" options={['Todos', 'Tipo 1', 'Tipo 2']} />
            <SelectInput placeholder="Selecione a Integração" options={['Todos', 'Int. A', 'Int. B']} />

            <DateInput placeholder="dd/mm/aaaa" />
            <DateInput placeholder="dd/mm/aaaa" />

            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => setShowOnlyMyDossiers(!showOnlyMyDossiers)}
                    className={`p-2.5 rounded-md transition-colors ${
                        showOnlyMyDossiers 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title={showOnlyMyDossiers ? "Mostrar todos os dossiês" : "Mostrar apenas meus dossiês"}
                >
                    <UserRoundIcon className="h-5 w-5"/>
                </button>
                <button className="bg-[#005c9e] text-white p-2.5 rounded-md hover:bg-[#004a7c]">
                    <SearchIcon className="h-5 w-5" />
                </button>
                <button className="bg-gray-200 text-gray-700 p-2.5 rounded-md hover:bg-gray-300">
                    <XCircleIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Número Dossiê', 'Data Inicial', 'Data Finalização', 'Status', 'Dias Restantes', 'Ações'].map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{doc.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{doc.numeroDossie}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{doc.dataInicial}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{doc.dataFinalizacao || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{doc.diasRestantes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2 justify-end">
                    {doc.acaoVisualizar && (
                      <button className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 hover:bg-green-200 transition-colors">
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>Visualizar</span>
                      </button>
                    )}
                    {doc.acaoPreAnalise && (
                      <button className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 hover:bg-orange-200 transition-colors">
                        <span>Pré-Análise</span>
                      </button>
                    )}
                    {doc.acaoReprocessar && (
                      <button className="bg-red-100 text-red-800 px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 hover:bg-red-200 transition-colors">
                        <RefreshCwIcon className="h-3.5 w-3.5" />
                        <span>Reprocessar</span>
                      </button>
                    )}
                     {(!doc.atribuidoPara && !doc.acaoVisualizar) && (
                        <button className="bg-[#005c9e] text-white px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 hover:bg-[#004a7c] transition-colors">
                            <AssignIcon className="h-3.5 w-3.5" />
                            <span>Atribuir</span>
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
             {displayedDocuments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  {showOnlyMyDossiers ? 'Você não tem dossiês atribuídos no momento.' : 'Nenhum dossiê encontrado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-2 sm:mb-0">
          Exibindo {displayedDocuments.length > 0 ? '1' : '0'} a {displayedDocuments.length < 10 ? displayedDocuments.length : 10} do total de {displayedDocuments.length} itens
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <ChevronDownIcon className="h-5 w-5 rotate-90"/> {/* Use chevron for left/right */}
          </button>
          <button className="px-4 py-2 text-sm rounded-md bg-[#005c9e] text-white">1</button>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">2</button>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">3</button>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">4</button>
          <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">5</button>
          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <ChevronDownIcon className="h-5 w-5 -rotate-90"/> {/* Use chevron for left/right */}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Select Input for filters
const SelectInput: React.FC<{ placeholder: string, options: string[] }> = ({ placeholder, options }) => (
    <div className="relative min-w-[150px] flex-grow max-w-[200px]">
        <select defaultValue="" className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] text-sm text-gray-700">
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon className="h-4 w-4"/>
        </div>
    </div>
);

// Reusable Date Input for filters
const DateInput: React.FC<{ placeholder: string }> = ({ placeholder }) => (
    <div className="relative min-w-[150px] flex-grow max-w-[180px]">
        <input type="text" placeholder={placeholder} className="w-full p-2.5 border border-gray-300 rounded-md pr-10 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] text-sm placeholder-gray-500" />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <CalendarIcon className="h-5 w-5"/>
        </div>
    </div>
);

export default DocumentAnalysisPage;
