import React, { useState } from 'react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, FilterIcon, ResetIcon, DownloadIcon, UploadIcon, SortIcon, UserRoundIcon } from './Icons';
import { ActionButton, TextInput, SelectInput, DateInput } from './SharedDocumentComponents';
import MultiSelect from './MultiSelect';
import { BellAlertIcon, MagnifyingGlassCircleIcon, ArrowUturnLeftIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface RejectionDossier {
  id: string;
  numeroDossie: string;
  tipo: 'S' | 'C';
  dataInicial: string;
  dataFinalizacao: string;
  status: string;
  subStatus?: 'pending' | 'analyzing' | 'rejected' | 'approved';
  diasRestantes: string;
  isAssigned: boolean;
}

interface RejectionConferenceProps {
  onNavigate?: (page: string) => void;
}

const mockManagers = [
  { 
    id: 1, 
    name: 'Guilherme Calabresi', 
    count: 7,
    dossiers: [
      {
        id: '2573',
        numeroDossie: 'xxxxxxxxx_53113_3006300016683_2.zip',
        tipo: 'S',
        dataInicial: '24/02/2026 12:09:04',
        dataFinalizacao: '',
        status: 'Inconforme',
        subStatus: 'pending',
        diasRestantes: '',
        isAssigned: true
      },
      {
        id: '2572',
        numeroDossie: 'xxxxxxxxx_53113_3006300015572_1.zip',
        tipo: 'S',
        dataInicial: '24/02/2026 08:59:23',
        dataFinalizacao: '30/03/2026 17:02:05',
        status: 'Inconforme',
        subStatus: 'analyzing',
        diasRestantes: '',
        isAssigned: true
      },
      {
        id: '2574',
        numeroDossie: 'xxxxxxxxx_53113_3006300016684_1.zip',
        tipo: 'S',
        dataInicial: '25/02/2026 10:00:00',
        dataFinalizacao: '01/04/2026 14:00:00',
        status: 'Inconforme',
        subStatus: 'rejected',
        diasRestantes: '5',
        isAssigned: true
      },
      {
        id: '2575',
        numeroDossie: 'xxxxxxxxx_53113_3006300016685_1.zip',
        tipo: 'C',
        dataInicial: '25/02/2026 11:30:00',
        dataFinalizacao: '02/04/2026 09:15:00',
        status: 'Inconforme',
        subStatus: 'approved',
        diasRestantes: '6',
        isAssigned: false
      },
      {
        id: '2576',
        numeroDossie: 'xxxxxxxxx_53113_3006300016686_1.zip',
        tipo: 'S',
        dataInicial: '26/02/2026 08:45:00',
        dataFinalizacao: '03/04/2026 11:20:00',
        status: 'Inconforme',
        subStatus: 'pending',
        diasRestantes: '7',
        isAssigned: true
      },
      {
        id: '2577',
        numeroDossie: 'xxxxxxxxx_53113_3006300016687_1.zip',
        tipo: 'C',
        dataInicial: '26/02/2026 14:10:00',
        dataFinalizacao: '04/04/2026 16:40:00',
        status: 'Inconforme',
        subStatus: 'analyzing',
        diasRestantes: '8',
        isAssigned: true
      },
      {
        id: '2578',
        numeroDossie: 'xxxxxxxxx_53113_3006300016688_1.zip',
        tipo: 'S',
        dataInicial: '27/02/2026 09:05:00',
        dataFinalizacao: '',
        status: 'Inconforme',
        subStatus: 'rejected',
        diasRestantes: '',
        isAssigned: false
      }
    ] as RejectionDossier[]
  },
  { id: 2, name: 'Tarsila Correa', count: 0, dossiers: [] as RejectionDossier[] },
  { id: 3, name: 'Celeste Mayumi Teraoka Garcia', count: 0, dossiers: [] as RejectionDossier[] },
];

const RejectionConference: React.FC<RejectionConferenceProps> = ({ onNavigate }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [openManagerId, setOpenManagerId] = useState<number | null>(1);
  const activeFilterCount = 0;

  const toggleManager = (id: number) => {
    setOpenManagerId(openManagerId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-fade-in">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Conferência Rej. de Apontamentos</h3>
      
      <div className="relative col-span-full mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400"/>
          </div>
          <input type="text" placeholder="Buscar..." className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-[#005c9e] outline-none transition-colors"/>
      </div>
      
      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
              <button onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} className="flex items-center space-x-2 text-sm font-medium text-[#005c9e] hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                  <FilterIcon className="h-4 w-4" />
                  <span>{isFiltersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
                  {isFiltersExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              </button>
              {!isFiltersExpanded && activeFilterCount > 0 && (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                      <span className="font-semibold">{activeFilterCount}</span> {activeFilterCount === 1 ? 'filtro aplicado' : 'filtros aplicados'}
                  </div>
              )}
          </div>
          <div className="flex items-end space-x-2">
              <ActionButton icon={<SearchIcon className="h-5 w-5" />} color="blue" />
          </div>
      </div>

      {isFiltersExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 text-sm mb-6 pt-4 border-t animate-fade-in">
              <div className="lg:col-span-3"><DateInput label="Data Inicial" /></div>
              <div className="lg:col-span-3"><DateInput label="Data Final" /></div>
          </div>
      )}

      <div className="space-y-2">
          {mockManagers.map((manager) => (
              <div key={manager.id} className="border border-gray-200 rounded-lg">
                  <button
                      onClick={() => toggleManager(manager.id)}
                      className="w-full flex justify-between items-center p-4 bg-[#e6f2fa] rounded-t-lg transition-colors hover:bg-[#d9ebf7]"
                  >
                      <div className="flex items-center space-x-3">
                          {openManagerId === manager.id ? <ChevronUpIcon className="h-5 w-5 text-[#005c9e]" /> : <ChevronDownIcon className="h-5 w-5 text-[#005c9e]" />}
                          <span className="font-semibold text-gray-800">{manager.name}</span>
                          <span className="text-gray-500 text-sm">({manager.count} dossiês)</span>
                      </div>
                  </button>
                  {openManagerId === manager.id && (
                      <div className="bg-white rounded-b-lg p-4 overflow-x-auto">
                          <table className="min-w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>ID</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>Número Dossiê</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>Data Inicial</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>Data Finalização</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>Status</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                                          <div className="flex items-center justify-center space-x-1 cursor-pointer hover:text-gray-900">
                                              <span>Dias Restantes</span>
                                              <SortIcon className="h-3 w-3" />
                                          </div>
                                      </th>
                                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">Ações</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {manager.dossiers.map((dossier) => (
                                      <tr key={dossier.id} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{dossier.id}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                              <div className="flex items-center justify-center space-x-2">
                                                  {dossier.tipo === 'S' && (
                                                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">S</span>
                                                  )}
                                                  <span>{dossier.numeroDossie}</span>
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{dossier.dataInicial}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{dossier.dataFinalizacao}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                              {dossier.status === 'Em Análise Simplificada' && (
                                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                                      {dossier.status}
                                                  </span>
                                              )}
                                              {dossier.status === 'Inconforme' && (
                                                  <div className="flex items-center justify-center space-x-2">
                                                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200">
                                                          {dossier.status}
                                                      </span>
                                                      {dossier.subStatus === 'pending' && (
                                                          <BellAlertIcon className="h-5 w-5 text-gray-500" title="Apontamento pendente" />
                                                      )}
                                                      {dossier.subStatus === 'analyzing' && (
                                                          <MagnifyingGlassCircleIcon className="h-5 w-5 text-blue-500" title="Rejeição em análise pelo supervisor" />
                                                      )}
                                                      {dossier.subStatus === 'rejected' && (
                                                          <ArrowUturnLeftIcon className="h-5 w-5 text-red-500" title="Rejeição não aprovada" />
                                                      )}
                                                      {dossier.subStatus === 'approved' && (
                                                          <CheckBadgeIcon className="h-5 w-5 text-green-500" title="Rejeição aprovada" />
                                                      )}
                                                  </div>
                                              )}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{dossier.diasRestantes}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                              <div className="flex items-center justify-center">
                                                  <button 
                                                      onClick={() => onNavigate && onNavigate('exemplifiedAnalysis')}
                                                      className="px-3 py-1.5 bg-[#48bca2] text-white rounded-md text-xs font-medium hover:bg-[#3a9c85] transition-colors"
                                                  >
                                                      Analisar
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                                  {manager.dossiers.length === 0 && (
                                      <tr>
                                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                              Nenhum dossiê encontrado para este gestor.
                                          </td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>
          ))}
      </div>
    </div>
  );
};

export default RejectionConference;
