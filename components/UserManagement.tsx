import React, { useState, useMemo } from 'react';
import { Manager, User, AssignedDoc, Bolsao, Document } from '../types';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, AssignIcon, CloseIcon, SlidersIcon, FileTextIcon, ListIcon, LayoutGridIcon, ResetIcon, DownloadIcon, UploadIcon, FilterIcon } from './Icons';
import DocumentAssignment from './DocumentAssignment';
import QueueManagement from './QueueManagement';
import { DocumentTable, DocumentItem, TextInput, SelectInput, DateInput, ActionButton } from './SharedDocumentComponents';
import MultiSelect from './MultiSelect';

const managersData: Manager[] = [
  {
    id: 1,
    name: 'Guilherme Calabresi',
    users: [
      { 
        matricula: 'daniel.f.souza', 
        nomeCompleto: 'Daniel Souza', 
        email: 'daniel.f.souza@caixa.gov.br', 
        local: 'SP', 
        bolsao: 'Bolsão Prioritário',
        docsAtribuidos: [
            { id: '535', name: '02105164179_00024_1304001403211_1.pdf' },
            { id: '536', name: '05114601576_24_2904000702413_1.pdf' },
            { id: '542', name: '97101_9001319718908_00024_1347000904229_1.pdf' },
        ] 
      },
      { 
        matricula: 'eduardo.bexiga', 
        nomeCompleto: 'Eduardo Bexiga', 
        email: 'eduardo.bexiga@caixa.gov.br', 
        local: 'SP', 
        bolsao: 'Bolsão Prioritário',
        docsAtribuidos: [
            { id: '472', name: '9001318223195_85058_9923810062231_1.pdf' },
            { id: '474', name: '9001318223195_85058_9923810062231_1.pdf' },
        ]
      },
      { matricula: 'elvio.trindade', nomeCompleto: 'Elvio Trindade', email: 'elvio.trindade@caixa.gov.br', local: 'SP', bolsao: 'Bolsão Análise Simples', docsAtribuidos: '-' },
      { matricula: 'karina.ramos', nomeCompleto: 'Karina Ramos', email: 'karina.ramos@caixa.gov.br', local: 'SP', bolsao: 'Bolsão Análise Simples', docsAtribuidos: '-' },
      { matricula: 'roberto.dias', nomeCompleto: 'Roberto Dias', email: 'roberto.dias@caixa.gov.br', local: 'SP', bolsao: undefined, docsAtribuidos: '-' }, // Sem bolsão
    ],
  },
  {
    id: 2,
    name: 'Tarsila Correa',
    users: [
       { matricula: 'tarsila.c', nomeCompleto: 'Tarsila Correa', email: 'tarsila.correa@caixa.gov.br', local: 'RJ', bolsao: 'Bolsão RJ Capital', docsAtribuidos: '-' },
    ],
  },
  {
    id: 3,
    name: 'Celeste Mayumi Teraoka Garcia',
    users: [
      { matricula: 'celeste.garcia', nomeCompleto: 'Celeste Garcia', email: 'celeste.garcia@caixa.gov.br', local: 'MG', bolsao: 'Bolsão Minas Gerais', docsAtribuidos: '-' },
      { matricula: 'joao.silva', nomeCompleto: 'João Silva', email: 'joao.silva@caixa.gov.br', local: 'MG', bolsao: 'Bolsão Minas Gerais', docsAtribuidos: '-' },
      { matricula: 'ana.pereira', nomeCompleto: 'Ana Pereira', email: 'ana.pereira@caixa.gov.br', local: 'MG', bolsao: undefined, docsAtribuidos: '-' },
    ],
  },
];

const allDocumentsMock: Document[] = [
    { id: '472', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise', dtAssin: '18/06/1986', mut: 'DORIA VANIA NUNES', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Cód FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '474', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Completa', stat: 'Em Análise', dtAssin: '13/09/1984', mut: 'MARICELIA MORAIS', tipoEvt: 'L13', or: '32', planReaj: 'PES A 4 A 07 SMH', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Cód FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Análise Simples' },
    { id: '543', nrDoc: '71657_9001319854844_22001_0008020420670_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '01/09/1988', mut: 'ROSANGELA FERREIRA', tipoEvt: 'L10', or: '32', planReaj: 'EQ1 1 P 06 CTP', im: '07', fh2: 'Não', fh3: 'Não', cess: 'Não', cef: '0910', codigoFh2: 'Cód FH2', gestor: 'Celeste Mayumi', bolsao: 'Bolsão Minas Gerais' },
    { id: '546', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983', mut: 'AROLDO GUEDES', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Cód FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '999', nrDoc: '11111_000000000000_1.pdf', cat: 'Completa', stat: 'Pendente', dtAssin: '10/01/2023', mut: 'JOAO DA SILVA', tipoEvt: 'L99', or: '01', planReaj: 'N/A', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Não', cef: '0000', codigoFh2: 'Cód FH2', gestor: '', bolsao: '' },
    { id: '1001', nrDoc: '11111_000000000001_1.pdf', cat: 'Simplificada', stat: 'Pendente', dtAssin: '11/01/2023', mut: 'MARIA OLIVEIRA', tipoEvt: 'L99', or: '02', planReaj: 'N/A', im: '01', fh2: 'Sim', fh3: 'Não', cess: 'Não', cef: '1000', codigoFh2: 'Cód FH2', gestor: '', bolsao: '' },
    { id: '1002', nrDoc: '11111_000000000002_1.pdf', cat: 'Completa', stat: 'Em Análise', dtAssin: '12/01/2023', mut: 'JOSE PEREIRA', tipoEvt: 'L10', or: '03', planReaj: 'EQ1', im: '02', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '2000', codigoFh2: 'Cód FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Análise Simples' },
    { id: '1003', nrDoc: '11111_000000000003_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '13/01/2023', mut: 'ANA COSTA', tipoEvt: 'L13', or: '04', planReaj: 'PES', im: '03', fh2: 'Sim', fh3: 'Sim', cess: 'Não', cef: '3000', codigoFh2: 'Cód FH2', gestor: 'Celeste Mayumi', bolsao: 'Bolsão Minas Gerais' },
    { id: '1004', nrDoc: '11111_000000000004_1.pdf', cat: 'Completa', stat: 'Pedido Reanálise', dtAssin: '14/01/2023', mut: 'CARLOS SOUZA', tipoEvt: 'L13', or: '05', planReaj: 'EQ1', im: '04', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '4000', codigoFh2: 'Cód FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '1005', nrDoc: '11111_000000000005_1.pdf', cat: 'Simplificada', stat: 'Pendente', dtAssin: '15/01/2023', mut: 'PAULO SANTOS', tipoEvt: 'L99', or: '06', planReaj: 'N/A', im: '05', fh2: 'Sim', fh3: 'Não', cess: 'Não', cef: '5000', codigoFh2: 'Cód FH2', gestor: '', bolsao: '' },
    { id: '1006', nrDoc: '11111_000000000006_1.pdf', cat: 'Completa', stat: 'Em Análise', dtAssin: '16/01/2023', mut: 'LUCIA GOMES', tipoEvt: 'L10', or: '07', planReaj: 'PES', im: '06', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '6000', codigoFh2: 'Cód FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '1007', nrDoc: '11111_000000000007_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '17/01/2023', mut: 'MARCOS DIAS', tipoEvt: 'L13', or: '08', planReaj: 'EQ1', im: '07', fh2: 'Sim', fh3: 'Sim', cess: 'Não', cef: '7000', codigoFh2: 'Cód FH2', gestor: 'Celeste Mayumi', bolsao: 'Bolsão Minas Gerais' },
    { id: '1008', nrDoc: '11111_000000000008_1.pdf', cat: 'Completa', stat: 'Pedido Reanálise', dtAssin: '18/01/2023', mut: 'RITA LIMA', tipoEvt: 'L13', or: '09', planReaj: 'PES', im: '08', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '8000', codigoFh2: 'Cód FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '1009', nrDoc: '11111_000000000009_1.pdf', cat: 'Simplificada', stat: 'Pendente', dtAssin: '19/01/2023', mut: 'BRUNO ALVES', tipoEvt: 'L99', or: '10', planReaj: 'N/A', im: '09', fh2: 'Sim', fh3: 'Não', cess: 'Não', cef: '9000', codigoFh2: 'Cód FH2', gestor: '', bolsao: '' },
    { id: '1010', nrDoc: '11111_000000000010_1.pdf', cat: 'Completa', stat: 'Em Análise', dtAssin: '20/01/2023', mut: 'SONIA ROCHA', tipoEvt: 'L10', or: '11', planReaj: 'EQ1', im: '10', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1010', codigoFh2: 'Cód FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
];

const bolsaoQueueStats: Record<string, number> = {
    'Bolsão Prioritário': 142,
    'Bolsão Análise Simples': 58,
    'Bolsão RJ Capital': 12,
    'Bolsão Minas Gerais': 89
};

type ViewMode = 'manager' | 'general';
type SortKey = keyof Document | 'filaOrigem';
type UserSortKey = 'bolsao' | 'docsAtribuidos';
type SortDirection = 'asc' | 'desc';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Análise');
  const [openManagerId, setOpenManagerId] = useState<number | null>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [managingQueueFor, setManagingQueueFor] = useState<Manager | null>(null);
  const [managedBolsoes, setManagedBolsoes] = useState<Bolsao[] | undefined>(undefined);
  
  const [viewMode, setViewMode] = useState<ViewMode>('general');
  
  // General Queue State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({ key: 'id', direction: 'asc' });
  const [selectedDossierIds, setSelectedDossierIds] = useState<string[]>([]);
  const [selectedBolsaoFilter, setSelectedBolsaoFilter] = useState('Todos');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // FIX: Explicitly typing activeFilterCount as number to avoid literal type inference.
  const activeFilterCount: number = 3; // Mock value for demonstration

  const allBolsoes = useMemo(() => Array.from(new Set(allDocumentsMock.map(doc => doc.bolsao).filter(Boolean))), []);
  const managerOptions = useMemo(() => managersData.map(m => m.name), []);

  const toggleManager = (id: number) => {
    setOpenManagerId(openManagerId === id ? null : id);
  };

  const handleAssignClick = (user: User, bolsoes?: Bolsao[]) => {
    setSelectedUser(user);
    setManagedBolsoes(bolsoes);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setManagedBolsoes(undefined);
  };

  const handleManageQueueClick = (manager: Manager) => {
    setManagingQueueFor(manager);
  };
  
  const handleBackFromQueue = () => {
    setManagingQueueFor(null);
  };

  // General Queue Handlers
  const handleSort = (key: SortKey) => {
      let direction: SortDirection = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
      setCurrentPage(1); // Reset to first page on sort
  };

  const sortedDocs = useMemo(() => {
      let sortableItems = [...allDocumentsMock];
      
      if (selectedBolsaoFilter !== 'Todos') {
        sortableItems = sortableItems.filter(doc => {
          if (selectedBolsaoFilter === 'Sem Bolsão') {
            return !doc.bolsao || doc.bolsao === '';
          }
          return doc.bolsao === selectedBolsaoFilter;
        });
      }

      if (sortConfig.key) {
          sortableItems.sort((a, b) => {
              let aValue: string | number | undefined;
              let bValue: string | number | undefined;

              if (sortConfig.key === 'filaOrigem') {
                  aValue = a.gestor && a.bolsao ? `${a.gestor} > ${a.bolsao}` : '';
                  bValue = b.gestor && b.bolsao ? `${b.gestor} > ${b.bolsao}` : '';
              } else {
                  const key = sortConfig.key as keyof Document;
                  aValue = a[key];
                  bValue = b[key];
              }

              if (aValue === undefined || bValue === undefined) return 0;
              if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          });
      }
      return sortableItems;
  }, [sortConfig, selectedBolsaoFilter]);
  
  const paginatedDocs = useMemo(() => {
    return sortedDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [sortedDocs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);

  const handleToggleSelectAll = () => {
    if (selectedDossierIds.length === paginatedDocs.length && paginatedDocs.length > 0) {
        setSelectedDossierIds([]);
    } else {
        setSelectedDossierIds(paginatedDocs.map(d => d.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedDossierIds.includes(id)) {
        setSelectedDossierIds(prev => prev.filter(item => item !== id));
    } else {
        setSelectedDossierIds(prev => [...prev, id]);
    }
  };

  if (managingQueueFor) {
    return <QueueManagement manager={managingQueueFor} onBack={handleBackFromQueue} />;
  }

  if (selectedUser) {
    return <DocumentAssignment user={selectedUser} onBack={handleBack} managedBolsoes={managedBolsoes} />;
  }

  const grupoCredorOptions = [ 'Bancos Privados', 'COHAB', 'CAIXA', 'Entes Públicos', 'Liquidandas', 'Outros' ];
  const agenteFinanceiroOptions = [ '22000 - BANCO UBS PACTUAL / PREVISUL', '22001 - BANCO ITAÚ / BANESTADO', '50013 - BANCO DE CRÉITO NACIONAL S/A - BCN S/A', '50048 - BANCO SANTANDER BRASIL S/A', '50137 - BANCO REAL S/A' ];
  const categoriaOptions = [ 'AJ - Cumprimento', 'AJ - Subsídio', 'Pedidos GECVS', 'Ofício Vencido', 'Pedido AF', 'Reanálise (Inadequado AUDIR)' ];
  const imOptions = [
    { isGroupLabel: true, label: 'Normais' },
    '00', '01', '02', '03', '08', '10', '11', '12', '20', '21', '22', '28', '23', '25', '26',
    { isGroupLabel: true, label: 'Especial' },
    '07', '13', '14', '35', '15', '16', '17', '18', '24', '29', '30', '31', '46', '34', '32'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('Gestão Documental')}
            className={`py-2 px-1 text-sm font-medium ${activeTab === 'Gestão Documental' ? 'border-b-2 border-[#005c9e] text-[#005c9e]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Gestão Documental
          </button>
          <button
            onClick={() => setActiveTab('Análise')}
            className={`py-2 px-1 text-sm font-medium ${activeTab === 'Análise' ? 'border-b-2 border-[#005c9e] text-[#005c9e]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Análise
          </button>
        </nav>
      </div>

      {activeTab === 'Análise' && (
        <div className="mt-6 mb-4">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full max-w-md mb-6 mx-auto sm:mx-0">
                <button 
                    onClick={() => setViewMode('manager')}
                    className={`flex-1 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${viewMode === 'manager' ? 'bg-white text-[#005c9e] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Visão por Gestor
                </button>
                <button 
                    onClick={() => setViewMode('general')}
                    className={`flex-1 py-1.5 px-4 text-sm font-medium rounded-md transition-all ${viewMode === 'general' ? 'bg-white text-[#005c9e] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Fila Geral
                </button>
            </div>

            {viewMode === 'manager' ? (
                <>
                    <div className="flex items-center max-w-sm rounded-md focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-[#005c9e] mb-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                            type="text"
                            placeholder="Pesquisar gestor ou analista"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none bg-gray-100 placeholder-gray-500"
                            />
                        </div>
                        <button className="bg-[#005c9e] text-white p-[9px] rounded-r-md hover:bg-[#004a7c] border border-[#005c9e]">
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {managersData.map((manager) => (
                        <AccordionItem
                            key={manager.id}
                            manager={manager}
                            isOpen={openManagerId === manager.id}
                            onToggle={() => toggleManager(manager.id)}
                            onAssignClick={handleAssignClick}
                            onManageQueueClick={handleManageQueueClick}
                        />
                        ))}
                    </div>
                </>
            ) : (
                <div className="animate-fade-in">
                    <div className="sticky top-0 bg-white z-10 -mx-6 -mt-6 px-6 pt-4 pb-4 border-b border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Fila Geral de Documentos</h3>
                        
                        <div className="relative col-span-full mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input type="text" placeholder="Buscar documentos na fila geral por ID, Nr. Doc. ou Mutuário..." className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-[#005c9e] outline-none transition-colors"/>
                        </div>
                        
                        <div className="flex justify-between items-center">
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
                                <ActionButton icon={<ResetIcon className="h-5 w-5" />} color="gray" />
                                <ActionButton icon={<DownloadIcon className="h-5 w-5" />} color="green" />
                                <ActionButton icon={<UploadIcon className="h-5 w-5" />} color="green" />
                            </div>
                        </div>

                        {isFiltersExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 text-sm mt-4 pt-4 border-t animate-fade-in">
                                <div className="lg:col-span-3"><MultiSelect label="Grupo Credor" options={grupoCredorOptions} /></div>
                                <div className="lg:col-span-3"><MultiSelect label="Agente Financeiro" options={agenteFinanceiroOptions} /></div>
                                <div className="lg:col-span-3"><SelectInput label="Hipoteca" /></div>
                                <div className="lg:col-span-3"><SelectInput label="FH 1/2/3" /></div>
                                <div className="lg:col-span-2"><MultiSelect label="Categoria" options={categoriaOptions} /></div>
                                <div className="lg:col-span-2"><SelectInput label="Status" /></div>
                                <div className="lg:col-span-2"><TextInput label="Nome do Mutuário" /></div>
                                <div className="lg:col-span-2"><TextInput label="Tipo de Evento" /></div>
                                <div className="lg:col-span-2"><TextInput label="OR" /></div>
                                <div className="lg:col-span-2"><TextInput label="Plano de Reajustamento" /></div>
                                <div className="lg:col-span-3"><TextInput label="%CEF" /></div>
                                <div className="lg:col-span-3"><MultiSelect label="IM" options={imOptions} /></div>
                                <div className="lg:col-span-3"><SelectInput label="Indicador de Cessão" /></div>
                                <div className="lg:col-span-3"><TextInput label="Código FH2" /></div>
                                <div className="lg:col-span-2"><DateInput label="Data assinatura" /></div>
                                <div className="lg:col-span-2"><DateInput label="até" /></div>
                                <div className="lg:col-span-2"><DateInput label="Liberação da GD" /></div>
                                <div className="lg:col-span-3"><MultiSelect label="Gestores" options={managerOptions} /></div>
                                <div className="lg:col-span-3"><MultiSelect label="Bolsões" options={allBolsoes} /></div>
                            </div>
                        )}
                        
                         <div className="flex justify-between items-center text-sm pt-4 mt-4 border-t">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="select-all-general" 
                                        checked={paginatedDocs.length > 0 && selectedDossierIds.length === paginatedDocs.length}
                                        onChange={handleToggleSelectAll}
                                        className="h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e] cursor-pointer"
                                    />
                                    <label htmlFor="select-all-general" className="ml-2 font-medium text-gray-700 select-none cursor-pointer">Selecionar todos</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="text-gray-700 font-medium">Bolsão:</label>
                                    <div className="w-56">
                                        <SelectInput 
                                            options={['Todos', 'Sem Bolsão', ...allBolsoes]}
                                            value={selectedBolsaoFilter}
                                            onChange={(e) => { setSelectedBolsaoFilter(e.target.value); setCurrentPage(1); }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                                <span>Mostrar:</span>
                                <SelectInput 
                                    options={['10', '25', '50']} 
                                    value={String(itemsPerPage)} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                />
                                <span>itens</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <DocumentTable 
                            documents={paginatedDocs} 
                            sortConfig={sortConfig} 
                            onSort={handleSort} 
                            selectedIds={selectedDossierIds}
                            onToggleOne={handleToggleSelectOne}
                        />
                        
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                            <div>
                                Exibindo <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedDocs.length)}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, sortedDocs.length)}</span> de <span className="font-semibold">{sortedDocs.length}</span> resultados
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5"/></button>
                                <span className="px-2">Página {currentPage} de {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon className="h-5 w-5"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

interface AccordionItemProps {
    manager: Manager;
    isOpen: boolean;
    onToggle: () => void;
    onAssignClick: (user: User, bolsoes?: Bolsao[]) => void;
    onManageQueueClick: (manager: Manager) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ manager, isOpen, onToggle, onAssignClick, onManageQueueClick }) => {
    // ... logic remains same ...
    const [activeBolsaoTab, setActiveBolsaoTab] = useState<string>('Todos');
    const [sortConfig, setSortConfig] = useState<{ key: UserSortKey | null; direction: SortDirection }>({ key: null, direction: 'asc' });

    // Extract unique bolsoes from users
    const uniqueBolsoes = Array.from(new Set(manager.users.map(u => u.bolsao).filter(Boolean))) as string[];
    const hasUnassignedUsers = manager.users.some(u => !u.bolsao);

    // Filter users based on active tab
    const filteredUsers = manager.users.filter(user => {
        if (activeBolsaoTab === 'Todos') return true;
        if (activeBolsaoTab === 'Sem Bolsão') return !user.bolsao;
        return user.bolsao === activeBolsaoTab;
    });
    
    const handleSort = (key: UserSortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = useMemo(() => {
        let sortableUsers = [...filteredUsers];
        if (sortConfig.key !== null) {
            sortableUsers.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;

                if (sortConfig.key === 'bolsao') {
                    // Treat 'Não atribuído' as coming last alphabetically
                    aValue = a.bolsao || 'Z_Last'; 
                    bValue = b.bolsao || 'Z_Last';
                } else { // docsAtribuidos
                    aValue = Array.isArray(a.docsAtribuidos) ? a.docsAtribuidos.length : 0;
                    bValue = Array.isArray(b.docsAtribuidos) ? b.docsAtribuidos.length : 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [filteredUsers, sortConfig]);

    const getSortIcon = (key: UserSortKey) => {
        if (sortConfig.key !== key) {
            return <ChevronDownIcon className="h-3 w-3 text-gray-300" />;
        }
        if (sortConfig.direction === 'asc') {
            return <ChevronUpIcon className="h-3 w-3" />;
        }
        return <ChevronDownIcon className="h-3 w-3" />;
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 bg-[#e6f2fa] rounded-t-lg transition-colors hover:bg-[#d9ebf7]"
            >
                <div className="flex items-center space-x-3">
                    {isOpen ? <ChevronUpIcon className="h-5 w-5 text-[#005c9e]" /> : <ChevronDownIcon className="h-5 w-5 text-[#005c9e]" />}
                    <span className="font-semibold text-gray-800">{manager.name}</span>
                    <span className="text-gray-500 text-sm">({manager.users.length} analistas)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                      className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-700 active:scale-95 transition-all"
                      onClick={(e) => { e.stopPropagation(); onManageQueueClick(manager); }}
                    >
                        <SlidersIcon className="h-4 w-4" />
                        <span>Gerenciar Fila & Bolsões</span>
                    </button>
                    <button 
                      className="bg-[#005c9e] text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#004a7c] active:scale-95 transition-all"
                      onClick={(e) => { 
                          e.stopPropagation(); 
                          const managerAsUser: User = {
                              matricula: `GEST-${manager.id}`,
                              nomeCompleto: manager.name,
                              email: 'gestor@caixa.gov.br',
                              local: 'Matriz',
                              docsAtribuidos: [],
                              bolsao: 'Gestão'
                          };
                          const bolsoes: Bolsao[] = uniqueBolsoes.map((name, idx) => ({
                              id: idx + 1,
                              name: name,
                              userIds: [] 
                          }));
                          onAssignClick(managerAsUser, bolsoes); 
                      }}
                    >
                        <AssignIcon className="h-4 w-4" />
                        <span>Atribuir bolsão</span>
                    </button>
                </div>
            </button>
            {isOpen && (
                <div className="bg-white rounded-b-lg">
                    {/* Bolsões Tabs */}
                    <div className="px-4 pt-2 border-b border-gray-200 overflow-x-auto">
                        <div className="flex space-x-6">
                            <button
                                onClick={() => setActiveBolsaoTab('Todos')}
                                className={`pb-3 pt-2 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                    activeBolsaoTab === 'Todos' 
                                    ? 'border-[#005c9e] text-[#005c9e]' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>Todos</span>
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{manager.users.length}</span>
                            </button>

                            {uniqueBolsoes.map(bolsao => {
                                const userCount = manager.users.filter(u => u.bolsao === bolsao).length;
                                const queueCount = bolsaoQueueStats[bolsao] || 0;
                                return (
                                    <button
                                        key={bolsao}
                                        onClick={() => setActiveBolsaoTab(bolsao)}
                                        className={`pb-3 pt-2 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                            activeBolsaoTab === bolsao 
                                            ? 'border-[#005c9e] text-[#005c9e]' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <span>{bolsao}</span>
                                        <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs" title="Analistas no time">{userCount}</span>
                                        {/* Queue Badge */}
                                        <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 py-0.5 px-2 rounded-full text-xs ml-1" title="Documentos na fila do bolsão">
                                            <FileTextIcon className="h-3 w-3" />
                                            <span>{queueCount}</span>
                                        </span>
                                    </button>
                                );
                            })}

                            {hasUnassignedUsers && (
                                <button
                                    onClick={() => setActiveBolsaoTab('Sem Bolsão')}
                                    className={`pb-3 pt-2 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                        activeBolsaoTab === 'Sem Bolsão' 
                                        ? 'border-[#005c9e] text-[#005c9e]' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span>Sem Bolsão</span>
                                    <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                        {manager.users.filter(u => !u.bolsao).length}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Matrícula', 'Nome completo', 'E-mail', 'Local'].map((header) => (
                                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                    {/* Sortable headers */}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('bolsao')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Bolsão</span>
                                            {getSortIcon('bolsao')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[400px]" onClick={() => handleSort('docsAtribuidos')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Docs. atribuídos</span>
                                            {getSortIcon('docsAtribuidos')}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedUsers.map((user) => (
                                    <tr key={user.matricula} className="hover:bg-gray-50 align-top transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.matricula}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{user.nomeCompleto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.local}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.bolsao ? (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.bolsao}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Não atribuído</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {Array.isArray(user.docsAtribuidos) ? (
                                                <div className="flex flex-col space-y-1">
                                                    {user.docsAtribuidos.slice(0, 2).map((doc) => (
                                                        <div key={doc.id} className="text-xs truncate" title={`${doc.id} - ${doc.name}`}>
                                                            {`${doc.id} - ${doc.name}`}
                                                        </div>
                                                    ))}
                                                    {user.docsAtribuidos.length > 2 && (
                                                        <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5 w-fit font-medium" title="Mais documentos atribuídos">
                                                            {`(+${user.docsAtribuidos.length - 2}...)`}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Não atribuído</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button 
                                              className="bg-white border border-[#005c9e] text-[#005c9e] hover:bg-[#e6f2fa] active:scale-95 px-3 py-1.5 rounded-md flex items-center space-x-1.5 text-xs transition-all"
                                              onClick={(e) => { e.stopPropagation(); onAssignClick(user); }}
                                            >
                                                <AssignIcon className="h-3.5 w-3.5" />
                                                <span>Atribuir</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sortedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                            Nenhum analista encontrado neste grupo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 border-t border-gray-100">
                         <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <span>Mostrar</span>
                            <select className="border border-gray-300 rounded-md px-2 py-1 text-center bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#005c9e] transition-shadow">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span>usuários por página</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button className="p-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="px-3 py-1 bg-[#005c9e] text-white rounded-md text-xs font-bold">1</span>
                             <button className="p-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;