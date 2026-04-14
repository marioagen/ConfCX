
import React, { useState, useMemo, useEffect } from 'react';
import { User, Document, Bolsao, AssignedDoc } from '../types';
import { CloseIcon, SearchIcon, TrashIcon, ResetIcon, DownloadIcon, UploadIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, LayoutGridIcon } from './Icons';
import MultiSelect from './MultiSelect';
import { DocumentTable, DocumentItem, TextInput, SelectInput, DateInput, ActionButton } from './SharedDocumentComponents';

interface DocumentAssignmentProps {
  user: User;
  onBack: () => void;
  managedBolsoes?: Bolsao[];
}

interface AssignedDocWithBolsao extends AssignedDoc {
    bolsaoId?: number;
}

const initialAssignedDocs: AssignedDocWithBolsao[] = [
    { id: '535', name: '02105164179_00024_1304001403211_1.pdf' },
    { id: '536', name: '05114601576_24_2904000702413_1.pdf' },
    { id: '542', name: '97101_9001319718908_00024_1347000904229_1.pdf' },
];

const initialAvailableDocs: Document[] = [
    { id: '472', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise (Simplificada)', dtAssin: '18/06/1986 00:00:00', mut: 'DORIA VANIA NUNES BARBOSA LIMA', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '472-2', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise (Simplificada)', dtAssin: '18/06/1986 00:00:00', mut: 'DORIA VANIA NUNES BARBOSA LIMA', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '474', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Completa', stat: 'Em Análise (Completa)', dtAssin: '13/09/1984 00:00:00', mut: 'MARICELIA MORAIS FREITAS', tipoEvt: 'L13', or: '32', planReaj: 'PES A 4 A 07 SMH', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Análise Simples' },
    { id: '543', nrDoc: '71657_9001319854844_22001_0008020420670_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '01/09/1988 00:00:00', mut: 'ROSANGELA FERREIRA DE LIMA', tipoEvt: 'L10', or: '32', planReaj: 'EQ1 1 P 06 CTP', im: '07', fh2: 'Não', fh3: 'Não', cess: 'Não', cef: '0910', codigoFh2: 'Código FH2', gestor: 'Celeste Mayumi Teraoka Garcia', bolsao: 'Bolsão Minas Gerais' },
    { id: '546', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983 00:00:00', mut: 'AROLDO GUEDES DA CUNHA', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '546-2', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983 00:00:00', mut: 'AROLDO GUEDES DA CUNHA', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '547', nrDoc: '41801_9001108341627_43521_7001078400003_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '31/03/1981 00:00:00', mut: 'HUMBERTO CARDOZO DE SOUZA', tipoEvt: 'TPZ', or: '11', planReaj: 'PES 1 A 01 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '0000', codigoFh2: 'Código FH2', gestor: 'Celeste Mayumi Teraoka Garcia', bolsao: 'Bolsão Minas Gerais' },
];

type SortKey = keyof Document | 'filaOrigem';
type SortDirection = 'asc' | 'desc';

const DocumentAssignment: React.FC<DocumentAssignmentProps> = ({ user, onBack, managedBolsoes }) => {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({ key: 'id', direction: 'asc' });
    
    // State for data management
    const [assignedDocs, setAssignedDocs] = useState<AssignedDocWithBolsao[]>(initialAssignedDocs);
    const [availableDocs, setAvailableDocs] = useState<Document[]>(initialAvailableDocs);
    const [selectedDossierIds, setSelectedDossierIds] = useState<string[]>([]);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    
    // Modal State
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [targetBolsaoId, setTargetBolsaoId] = useState<number | null>(null);

    const grupoCredorOptions = [ 'Bancos Privados', 'COHAB', 'CAIXA', 'Entes Públicos', 'Liquidandas', 'Outros' ];
    const agenteFinanceiroOptions = [ '22000 - BANCO UBS PACTUAL / PREVISUL', '22001 - BANCO ITAÚ / BANESTADO', '50013 - BANCO DE CRÉITO NACIONAL S/A - BCN S/A', '50048 - BANCO SANTANDER BRASIL S/A', '50137 - BANCO REAL S/A' ];
    const categoriaOptions = [ 'AJ - Cumprimento', 'AJ - Subsídio', 'Pedidos GECVS', 'Ofício Vencido', 'Pedido AF', 'Reanálise (Inadequado AUDIR)' ];

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Distribute mock assigned docs to bolsões for demo purposes if not already set
    useEffect(() => {
        if (managedBolsoes && managedBolsoes.length > 0) {
            setAssignedDocs(prev => prev.map((doc, idx) => ({
                ...doc,
                bolsaoId: doc.bolsaoId || managedBolsoes[idx % managedBolsoes.length].id
            })));
        }
    }, [managedBolsoes]);

    const sortedDocs = useMemo(() => {
        let sortableItems = [...availableDocs];
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
    }, [sortConfig, availableDocs]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleToggleSelectAll = () => {
        if (selectedDossierIds.length === availableDocs.length && availableDocs.length > 0) {
            setSelectedDossierIds([]);
        } else {
            setSelectedDossierIds(availableDocs.map(d => d.id));
        }
    };

    const handleToggleSelectOne = (id: string) => {
        if (selectedDossierIds.includes(id)) {
            setSelectedDossierIds(prev => prev.filter(item => item !== id));
        } else {
            setSelectedDossierIds(prev => [...prev, id]);
        }
    };

    const handleAssignClick = () => {
        if (selectedDossierIds.length === 0) return;

        if (managedBolsoes && managedBolsoes.length > 0) {
            setTargetBolsaoId(managedBolsoes[0].id); // Default to first
            setAssignModalOpen(true);
        } else {
            performAssign();
        }
    };

    const performAssign = (bolsaoId?: number) => {
        const docsToAssign = availableDocs.filter(d => selectedDossierIds.includes(d.id));
        const formattedAssigned = docsToAssign.map(d => ({ 
            id: d.id, 
            name: d.nrDoc,
            bolsaoId: bolsaoId 
        }));
        
        setAssignedDocs(prev => [...prev, ...formattedAssigned]);
        setAvailableDocs(prev => prev.filter(d => !selectedDossierIds.includes(d.id)));
        
        const bolsaoName = managedBolsoes?.find(b => b.id === bolsaoId)?.name;
        const msg = bolsaoName 
            ? `${docsToAssign.length} documento(s) atribuído(s) ao ${bolsaoName}.`
            : `${docsToAssign.length} documento(s) atribuído(s) com sucesso.`;

        setNotification({
            message: msg,
            type: 'success'
        });
        setSelectedDossierIds([]);
        setAssignModalOpen(false);
    };

    const handleUnassign = (id: string) => {
        const docToRemove = assignedDocs.find(d => d.id === id);
        if (!docToRemove) return;

        setAssignedDocs(prev => prev.filter(d => d.id !== id));
        
        const originalDetails = initialAvailableDocs.find(d => d.id === id);
        if (originalDetails) {
            setAvailableDocs(prev => [...prev, originalDetails]);
        } else {
             setAvailableDocs(prev => [...prev, {
                 id: docToRemove.id,
                 nrDoc: docToRemove.name,
                 cat: 'Restaurado',
                 stat: 'Pendente',
                 dtAssin: '-',
                 mut: 'Mutuário',
                 tipoEvt: '-',
                 or: '-',
                 planReaj: '-',
                 im: '-',
                 fh2: 'Não',
                 fh3: 'Não',
                 cess: 'Não',
                 cef: '0',
                 codigoFh2: '-',
                 gestor: 'Sistema',
                 bolsao: 'Recuperado'
             }]);
        }
    };

    const handleUnassignAll = (bolsaoId?: number) => {
        const docsToRestore = bolsaoId 
            ? assignedDocs.filter(d => d.bolsaoId === bolsaoId)
            : assignedDocs;
            
        const idsToRestore = docsToRestore.map(d => d.id);
        
        setAssignedDocs(prev => prev.filter(d => !idsToRestore.includes(d.id)));
        
        const restoredDocs: Document[] = [];
        idsToRestore.forEach(id => {
             const originalDetails = initialAvailableDocs.find(d => d.id === id);
             if (originalDetails) restoredDocs.push(originalDetails);
        });

        setAvailableDocs(prev => [...prev, ...restoredDocs]);
         setNotification({
            message: `Documentos desatribuídos com sucesso.`,
            type: 'info'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full flex flex-col relative h-[85vh]">
             {notification && (
                <div className={`absolute top-4 right-4 z-50 p-3 rounded-md shadow-lg text-white font-medium transition-all duration-500 ease-in-out transform translate-y-0 ${notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <div className="flex items-center space-x-2">
                         {notification.type === 'success' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                         <span>{notification.message}</span>
                    </div>
                </div>
            )}
            <header className="flex justify-between items-center p-4 border-b flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-800">Documentos para {user.nomeCompleto}</h2>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition-colors">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </header>

            <main className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50">
                {/* Documentos Atribuidos */}
                <div className="bg-white p-4 rounded-md border shadow-sm">
                    {managedBolsoes && managedBolsoes.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-700">Documentos Atribuídos por Bolsão</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {managedBolsoes.map(bolsao => {
                                    const docsInBolsao = assignedDocs.filter(d => d.bolsaoId === bolsao.id);
                                    return (
                                        <div key={bolsao.id} className="border rounded-md bg-gray-50 overflow-hidden">
                                            <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-gray-700">{bolsao.name}</span>
                                                    <span className="bg-[#005c9e] text-white text-xs px-2 py-0.5 rounded-full">{docsInBolsao.length}</span>
                                                </div>
                                                {docsInBolsao.length > 0 && (
                                                     <button 
                                                        onClick={() => handleUnassignAll(bolsao.id)}
                                                        className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center space-x-1"
                                                    >
                                                        <TrashIcon className="h-3 w-3" />
                                                        <span>Limpar fila</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-2 space-y-2 max-h-40 overflow-y-auto">
                                                {docsInBolsao.length > 0 ? docsInBolsao.map(doc => (
                                                    <div key={doc.id} className="flex justify-between items-center p-2 bg-white border rounded-md text-sm text-gray-800 hover:shadow-sm transition-shadow group">
                                                         <span className="truncate pr-2"><span className="font-bold text-[#005c9e]">{doc.id}</span> - {doc.name}</span>
                                                         <button 
                                                            onClick={() => handleUnassign(doc.id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                                            title="Remover documento"
                                                        >
                                                            <CloseIcon className="h-4 w-4"/>
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <p className="text-center text-xs text-gray-400 py-2 italic">Nenhum documento nesta fila.</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-700">Documentos Atribuídos ({assignedDocs.length})</h3>
                                {assignedDocs.length > 0 && (
                                    <button 
                                        onClick={() => handleUnassignAll()}
                                        className="bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span>Desatribuir todos</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center border rounded-md mb-4 bg-gray-50">
                                <input type="text" placeholder="Buscar documentos atribuídos..." className="w-full p-2 pl-3 focus:outline-none bg-transparent rounded-l-md text-gray-800 placeholder-gray-500"/>
                                <button className="text-gray-500 p-2.5 hover:text-[#005c9e] transition-colors"><SearchIcon className="h-5 w-5" /></button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {assignedDocs.length > 0 ? assignedDocs.map(doc => (
                                    <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md text-sm text-gray-800 hover:bg-gray-200 transition-colors group">
                                        <span className="truncate pr-2"><span className="font-bold text-[#005c9e]">{doc.id}</span> - {doc.name}</span>
                                        <button 
                                            onClick={() => handleUnassign(doc.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                            title="Remover documento"
                                        >
                                            <CloseIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-gray-500 text-sm italic bg-gray-50 rounded-md border border-dashed border-gray-300">
                                        Nenhum documento atribuído.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Lista de Documentos */}
                <div className="bg-white p-4 rounded-md border shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Lista de documentos disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 text-sm mb-4">
                        <div className="col-span-full">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input type="text" placeholder="Buscar documentos disponíveis..." className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-[#005c9e] outline-none transition-colors"/>
                             </div>
                        </div>
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
                        <div className="lg:col-span-3"><TextInput label="IM" /></div>
                        <div className="lg:col-span-3"><SelectInput label="Indicador de Cessão" /></div>
                        <div className="lg:col-span-3"><TextInput label="Código FH2" /></div>

                        <div className="lg:col-span-4"><DateInput label="Data assinatura" /></div>
                        <div className="lg:col-span-4"><DateInput label="até" /></div>
                        <div className="lg:col-span-4"><DateInput label="Liberação da GD" /></div>
                        
                        <div className="col-span-full flex justify-end items-end space-x-2 border-t pt-4">
                            <ActionButton icon={<SearchIcon className="h-5 w-5" />} color="blue" />
                            <ActionButton icon={<ResetIcon className="h-5 w-5" />} color="gray" />
                            <ActionButton icon={<DownloadIcon className="h-5 w-5" />} color="green" />
                            <ActionButton icon={<UploadIcon className="h-5 w-5" />} color="green" />
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="select-all" 
                                    checked={selectedDossierIds.length === availableDocs.length && availableDocs.length > 0}
                                    onChange={handleToggleSelectAll}
                                    className="h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e] cursor-pointer"
                                />
                                <label htmlFor="select-all" className="ml-2 font-medium text-gray-700 select-none cursor-pointer">Selecionar todos</label>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <span>Mostrar:</span>
                                    <SelectInput options={['Todos', '10', '25', '50']} defaultValue="Todos" />
                                    <span>itens</span>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'table' ? (
                            <DocumentTable 
                                documents={sortedDocs} 
                                sortConfig={sortConfig} 
                                onSort={handleSort} 
                                selectedIds={selectedDossierIds}
                                onToggleOne={handleToggleSelectOne}
                            />
                        ) : (
                            <div className="space-y-3">
                                {sortedDocs.map(doc => <DocumentItem key={doc.id} doc={doc} />)}
                            </div>
                        )}

                         <div className="mt-4 flex justify-center items-center space-x-1">
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"><ChevronLeftIcon className="h-5 w-5"/></button>
                            <button className="px-4 py-2 text-sm rounded-md bg-[#005c9e] text-white">1</button>
                            <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors">2</button>
                            <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors">3</button>
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50"><ChevronRightIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="flex justify-end items-center p-4 border-t bg-white flex-shrink-0">
                <button onClick={onBack} className="bg-gray-100 text-gray-700 border border-gray-300 px-6 py-2 rounded-md mr-4 hover:bg-gray-200 transition-colors">Cancelar</button>
                <button 
                    onClick={handleAssignClick}
                    disabled={selectedDossierIds.length === 0}
                    className={`px-6 py-2 rounded-md text-white font-medium shadow-sm transition-all transform active:scale-95 duration-100
                        ${selectedDossierIds.length > 0 ? 'bg-[#005c9e] hover:bg-[#004a7c] cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Atribuir ({selectedDossierIds.length})
                </button>
            </footer>

            {/* Assignment Modal */}
            {assignModalOpen && managedBolsoes && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setAssignModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Selecione o Bolsão de Destino</h3>
                            <button onClick={() => setAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4 text-sm">
                                Você selecionou <span className="font-bold">{selectedDossierIds.length}</span> documentos. Escolha para qual bolsão eles devem ser direcionados:
                            </p>
                            <div className="space-y-3">
                                {managedBolsoes.map(bolsao => (
                                    <div 
                                        key={bolsao.id} 
                                        onClick={() => setTargetBolsaoId(bolsao.id)}
                                        className={`p-3 rounded-md border-2 cursor-pointer flex items-center transition-all ${
                                            targetBolsaoId === bolsao.id 
                                            ? 'border-[#005c9e] bg-blue-50' 
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-3 ${targetBolsaoId === bolsao.id ? 'border-[#005c9e]' : 'border-gray-400'}`}>
                                            {targetBolsaoId === bolsao.id && <div className="h-2 w-2 rounded-full bg-[#005c9e]"></div>}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{bolsao.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 border-t flex justify-end space-x-3">
                            <button 
                                onClick={() => setAssignModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => performAssign(targetBolsaoId!)}
                                className="px-4 py-2 bg-[#005c9e] text-white rounded-md hover:bg-[#004a7c] transition-colors font-medium shadow-sm"
                            >
                                Confirmar Atribuição
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentAssignment;
