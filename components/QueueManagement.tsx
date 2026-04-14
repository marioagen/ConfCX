
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Manager, User, Document, Bolsao } from '../types';
import { CloseIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon, CalendarIcon, ResetIcon, PlusIcon, TrashIcon, UsersIcon, FileTextIcon, AssignIcon } from './Icons';
import DeleteBolsaoModal from './DeleteBolsaoModal';
import RemoveUserModal from './RemoveUserModal';

// Mock data, same as in DocumentAssignment for consistency
const availableDocsData: Document[] = [
    { id: '472', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise (Simplificada)', dtAssin: '18/06/1986 00:00:00', mut: 'DORIA VANIA NUNES BARBOSA LIMA', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2' },
    { id: '474', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Completa', stat: 'Em Análise (Completa)', dtAssin: '13/09/1984 00:00:00', mut: 'MARICELIA MORAIS FREITAS', tipoEvt: 'L13', or: '32', planReaj: 'PES A 4 A 07 SMH', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2' },
    { id: '543', nrDoc: '71657_9001319854844_22001_0008020420670_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '01/09/1988 00:00:00', mut: 'ROSANGELA FERREIRA DE LIMA', tipoEvt: 'L10', or: '32', planReaj: 'EQ1 1 P 06 CTP', im: '07', fh2: 'Não', fh3: 'Não', cess: 'Não', cef: '0910', codigoFh2: 'Código FH2' },
    { id: '546', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983 00:00:00', mut: 'AROLDO GUEDES DA CUNHA', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2' },
    { id: '547', nrDoc: '41801_9001108341627_43521_7001078400003_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '31/03/1981 00:00:00', mut: 'HUMBERTO CARDOZO DE SOUZA', tipoEvt: 'TPZ', or: '11', planReaj: 'PES 1 A 01 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '0000', codigoFh2: 'Código FH2' },
];

const tableHeaders = [
    { key: 'id', label: 'Id' }, 
    { key: 'nrDoc', label: 'Nr. Doc.', className: 'min-w-[250px]' }, 
    { key: 'cat', label: 'Cat.' }, 
    { key: 'stat', label: 'Status' }, 
    { key: 'dtAssin', label: 'Dt. Assinatura', className: 'min-w-[140px]' }, 
    { key: 'mut', label: 'Mutuário', className: 'min-w-[200px]' }, 
    { key: 'tipoEvt', label: 'Tipo Evt.' }, 
    { key: 'or', label: 'OR' }, 
    { key: 'planReaj', label: 'Plano Reaj.', className: 'min-w-[120px]' }, 
    { key: 'im', label: 'IM' }, 
    { key: 'fh2', label: 'FH2' }, 
    { key: 'fh3', label: 'FH3' }, 
    { key: 'cess', label: 'Cess.' }, 
    { key: 'cef', label: '%CEF' }
];

interface QueueManagementProps {
  manager: Manager;
  onBack: () => void;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ manager, onBack }) => {
    const [bolsoes, setBolsoes] = useState<Bolsao[]>([
        { id: 1, name: 'Bolsão Prioritário', userIds: manager.users.filter(u => u.bolsao === 'Bolsão Prioritário').map(u => u.matricula) },
        { id: 2, name: 'Bolsão Análise Simples', userIds: manager.users.filter(u => u.bolsao === 'Bolsão Análise Simples').map(u => u.matricula) }
    ]);
    const [selectedBolsaoId, setSelectedBolsaoId] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<'users' | 'filters'>('users');
    const [selectedAnalystIds, setSelectedAnalystIds] = useState<string[]>([]);
    const [analystSelectorOpen, setAnalystSelectorOpen] = useState(false);
    const [analystSearchTerm, setAnalystSearchTerm] = useState('');
    const analystSelectorRef = useRef<HTMLDivElement>(null);
    
    const [editingBolsaoId, setEditingBolsaoId] = useState<number | null>(null);
    const [editingBolsaoName, setEditingBolsaoName] = useState('');
    const bolsaoInputRef = useRef<HTMLInputElement>(null);

    // Drag and Drop state
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // State for Dossie distribution tab
    const [searchedDossies, setSearchedDossies] = useState<Document[]>([]);
    const [assignedDossies, setAssignedDossies] = useState<Document[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });
    const [selectedDossierIds, setSelectedDossierIds] = useState<string[]>([]);

    // Notification state
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

    // State for delete confirmation modal
    const [bolsaoToDelete, setBolsaoToDelete] = useState<Bolsao | null>(null);
    
    // State for user removal confirmation modal
    const [userToRemove, setUserToRemove] = useState<User | null>(null);

    const selectedBolsao = bolsoes.find(b => b.id === selectedBolsaoId);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (analystSelectorRef.current && !analystSelectorRef.current.contains(event.target as Node)) {
                setAnalystSelectorOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [analystSelectorRef]);

    useEffect(() => {
        if (editingBolsaoId !== null && bolsaoInputRef.current) {
            bolsaoInputRef.current.focus();
            bolsaoInputRef.current.select();
        }
    }, [editingBolsaoId]);

    useEffect(() => {
        setSelectedAnalystIds([]);
        setSearchedDossies([]); // Clear search results when changing bolsao
        setAssignedDossies([]); // Clear assigned list when changing bolsao (or fetch from API in real app)
        setSelectedDossierIds([]);
    }, [selectedBolsaoId]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleRenameBolsao = () => {
        if (editingBolsaoId === null || !editingBolsaoName.trim()) {
            setEditingBolsaoId(null);
            return;
        }
        setBolsoes(bolsoes.map(b => 
            b.id === editingBolsaoId ? { ...b, name: editingBolsaoName.trim() } : b
        ));
        setEditingBolsaoId(null);
    };

    const handleCreateBolsao = () => {
        const newId = Math.max(...bolsoes.map(b => b.id), 0) + 1;
        const newName = `Novo Bolsão ${newId}`;
        const newBolsao: Bolsao = { id: newId, name: newName, userIds: [] };
        setBolsoes([...bolsoes, newBolsao]);
        setSelectedBolsaoId(newId);
        setActiveTab('users');
        setEditingBolsaoId(newId);
        setEditingBolsaoName(newName);
    };

    const handleDeleteBolsao = (id: number) => {
        if (bolsoes.length === 1) return;
        const newBolsoes = bolsoes.filter(b => b.id !== id);
        setBolsoes(newBolsoes);
        if (selectedBolsaoId === id) {
            setSelectedBolsaoId(newBolsoes[0].id);
        }
    };

    const handleConfirmDelete = () => {
        if (bolsaoToDelete) {
            handleDeleteBolsao(bolsaoToDelete.id);
        }
        setBolsaoToDelete(null);
    };

    const handleAddSelectedUsers = () => {
        if (!selectedBolsao || selectedAnalystIds.length === 0) return;
        const updatedBolsoes = bolsoes.map(b => {
            const remainingUserIds = b.userIds.filter(id => !selectedAnalystIds.includes(id));
            if (b.id === selectedBolsaoId) {
                return { ...b, userIds: [...remainingUserIds, ...selectedAnalystIds] };
            }
            return { ...b, userIds: remainingUserIds };
        });
        setBolsoes(updatedBolsoes);
        setSelectedAnalystIds([]);
        setAnalystSelectorOpen(false);
    };

    const handleRemoveUserClick = (user: User) => {
        setUserToRemove(user);
    };

    const handleConfirmRemoveUser = () => {
        if (userToRemove && selectedBolsaoId) {
             setBolsoes(bolsoes.map(b => b.id === selectedBolsaoId ? { ...b, userIds: b.userIds.filter(id => id !== userToRemove.matricula) } : b));
             setUserToRemove(null);
        }
    };

    const availableUsersForSelection = useMemo(() => {
        const allUserIdsInSomeBolsao = new Set(bolsoes.flatMap(b => b.userIds));
        return manager.users.filter(u => !allUserIdsInSomeBolsao.has(u.matricula));
    }, [manager.users, bolsoes]);

    const filteredAvailableUsers = useMemo(() => {
        return availableUsersForSelection.filter(user =>
            user.nomeCompleto.toLowerCase().includes(analystSearchTerm.toLowerCase()) ||
            user.matricula.toLowerCase().includes(analystSearchTerm.toLowerCase())
        );
    }, [availableUsersForSelection, analystSearchTerm]);

    const handleToggleAnalystSelection = (matricula: string) => {
        setSelectedAnalystIds(prev =>
            prev.includes(matricula)
                ? prev.filter(id => id !== matricula)
                : [...prev, matricula]
        );
    };
    
    const handleSaveRules = () => {
        // In a real app, this would save filters and then fetch matching documents.
        // Here, we just load mock data to display the result.
        // We exclude documents that are already assigned
        const newDocs = availableDocsData.filter(d => !assignedDossies.some(ad => ad.id === d.id));
        setSearchedDossies(newDocs);
        setSelectedDossierIds([]); // Reset selection when fetching new rules
    };

    const handleToggleSelectAll = () => {
        if (selectedDossierIds.length === searchedDossies.length) {
            setSelectedDossierIds([]);
        } else {
            setSelectedDossierIds(searchedDossies.map(d => d.id));
        }
    };

    const handleToggleSelectOne = (id: string) => {
        if (selectedDossierIds.includes(id)) {
            setSelectedDossierIds(prev => prev.filter(item => item !== id));
        } else {
            setSelectedDossierIds(prev => [...prev, id]);
        }
    };

    const handleAssignSelectedDossiers = () => {
        if (selectedDossierIds.length === 0) return;
        
        // Find selected docs
        const docsToAssign = searchedDossies.filter(d => selectedDossierIds.includes(d.id));
        
        // Update assigned list
        setAssignedDossies(prev => [...prev, ...docsToAssign]);

        // Remove from searched list (simulate they moved buckets)
        setSearchedDossies(prev => prev.filter(d => !selectedDossierIds.includes(d.id)));

        // Simulate API call and success action
        const count = selectedDossierIds.length;
        setNotification({
            message: `${count} dossiê(s) atribuído(s) com sucesso ao ${selectedBolsao?.name || 'bolsão'}.`,
            type: 'success'
        });
        
        // Clear selection to reflect action taken
        setSelectedDossierIds([]);
    };

    const handleUnassignDossier = (id: string) => {
        // Remove from assigned list
        const docToRemove = assignedDossies.find(d => d.id === id);
        setAssignedDossies(prev => prev.filter(d => d.id !== id));
        
        // Optionally add back to searched list if it matches filters? 
        // For simplicity, we just remove from assigned. If the user hits "Salvar Regras" again, it would appear.
        // Or we can manually push it back if we want to be fancy, but let's keep it simple.
        if (docToRemove) {
             setSearchedDossies(prev => [...prev, docToRemove]);
        }
    };

    const handleUnassignAll = () => {
         // Move all back to search results if possible, or just clear
         const allAssigned = [...assignedDossies];
         setAssignedDossies([]);
         setSearchedDossies(prev => [...prev, ...allAssigned]);
    };

    // Sorting Logic
    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSearchedDossies = useMemo(() => {
        let sortableItems = [...searchedDossies];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                // @ts-ignore
                const aValue = a[sortConfig.key];
                // @ts-ignore
                const bValue = b[sortConfig.key];
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [searchedDossies, sortConfig]);

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <ChevronDownIcon className="h-3 w-3 text-gray-300" />;
        if (sortConfig.direction === 'asc') return <ChevronUpIcon className="h-3 w-3" />;
        return <ChevronDownIcon className="h-3 w-3" />;
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragOverItem.current = index;
    };

    const handleDrop = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            return;
        }
        const newBolsoes = [...bolsoes];
        const dragItemContent = newBolsoes[dragItem.current];
        newBolsoes.splice(dragItem.current, 1);
        newBolsoes.splice(dragOverItem.current, 0, dragItemContent);
        setBolsoes(newBolsoes);
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
        setDraggedIndex(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full h-[85vh] flex flex-col overflow-hidden relative">
            {notification && (
                <div className={`absolute top-4 right-4 z-50 p-3 rounded-md shadow-lg text-white font-medium transition-all duration-500 ease-in-out transform translate-y-0 ${notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <div className="flex items-center space-x-2">
                         {notification.type === 'success' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                         <span>{notification.message}</span>
                    </div>
                </div>
            )}
            <header className="flex justify-between items-center p-4 border-b bg-gray-50 flex-shrink-0">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800">Gestão de Filas e Bolsões</h2>
                    <span className="text-sm text-gray-500">Gestor: {manager.name}</span>
                </div>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800 transition-colors">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </header>

            <div className="flex flex-grow overflow-hidden">
                <aside className="w-1/4 min-w-[250px] border-r bg-gray-50 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-white">
                        <span className="font-semibold text-gray-700">Meus Bolsões</span>
                        <button 
                            onClick={handleCreateBolsao}
                            className="bg-[#005c9e] text-white p-1.5 rounded-md hover:bg-[#004a7c] active:scale-95 transition-transform"
                            title="Criar novo bolsão"
                        >
                            <PlusIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-2" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                        {bolsoes.map((bolsao, index) => (
                            <div 
                                key={bolsao.id}
                                draggable={bolsoes.length > 1}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onClick={() => { if(editingBolsaoId !== bolsao.id) setSelectedBolsaoId(bolsao.id) }}
                                className={`p-3 rounded-md flex justify-between items-center transition-all 
                                    ${selectedBolsaoId === bolsao.id ? 'bg-white border-l-4 border-[#005c9e] shadow-sm' : 'hover:bg-gray-100 text-gray-600'}
                                    ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}
                                    ${bolsoes.length > 1 ? 'cursor-move' : 'cursor-pointer'}
                                `}
                            >
                                <div className="truncate pr-2 w-full">
                                    {editingBolsaoId === bolsao.id ? (
                                        <input
                                            ref={bolsaoInputRef}
                                            type="text"
                                            value={editingBolsaoName}
                                            onChange={(e) => setEditingBolsaoName(e.target.value)}
                                            onBlur={handleRenameBolsao}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRenameBolsao();
                                                if (e.key === 'Escape') setEditingBolsaoId(null);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="font-medium text-[#005c9e] bg-white border border-[#005c9e] rounded px-1 w-full text-sm"
                                        />
                                    ) : (
                                        <div
                                            className={`font-medium ${selectedBolsaoId === bolsao.id ? 'text-[#005c9e]' : ''}`}
                                            onDoubleClick={() => {
                                                if (bolsoes.length > 1) {
                                                    setEditingBolsaoId(bolsao.id);
                                                    setEditingBolsaoName(bolsao.name);
                                                }
                                            }}
                                            title={bolsoes.length > 1 ? "Duplo clique para renomear" : ""}
                                        >
                                            {bolsao.name}
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-400">{bolsao.userIds.length} analista(s)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="flex-grow flex flex-col bg-white">
                    {selectedBolsao ? (
                        <>
                            <div className="border-b px-6 pt-6 pb-0 bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nome do Bolsão</label>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedBolsao.name}</h2>
                                    </div>
                                    <button 
                                        onClick={() => setBolsaoToDelete(selectedBolsao)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-red-50 active:bg-red-100 transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span>Excluir Bolsão</span>
                                    </button>
                                </div>

                                <div className="flex space-x-6">
                                    <button 
                                        onClick={() => setActiveTab('users')}
                                        className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#005c9e] text-[#005c9e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <UsersIcon className="h-5 w-5" />
                                        <span className="font-medium">Equipe ({selectedBolsao.userIds.length})</span>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('filters')}
                                        className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'filters' ? 'border-[#005c9e] text-[#005c9e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FileTextIcon className="h-5 w-5" />
                                        <span className="font-medium">Regras de Distribuição (Dossiês)</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto bg-gray-50 p-6">
                                {activeTab === 'users' && (
                                    <div className="max-w-4xl mx-auto space-y-6">
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Adicionar Analista ao Bolsão</h3>
                                            <div className="flex space-x-2 items-start">
                                                <div className="relative flex-grow" ref={analystSelectorRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAnalystSelectorOpen(!analystSelectorOpen)}
                                                        className="w-full p-2.5 border border-gray-300 rounded-md bg-white flex justify-between items-center text-left focus:ring-2 focus:ring-[#005c9e] focus:border-transparent outline-none transition-shadow"
                                                    >
                                                        <span className={selectedAnalystIds.length > 0 ? "text-gray-800" : "text-gray-500"}>
                                                            {selectedAnalystIds.length > 0 ? `${selectedAnalystIds.length} analista(s) selecionado(s)` : 'Selecione um ou mais analistas...'}
                                                        </span>
                                                        <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform ${analystSelectorOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {analystSelectorOpen && (
                                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                                                            <div className="p-2 border-b">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Buscar por nome ou matrícula..."
                                                                    value={analystSearchTerm}
                                                                    onChange={e => setAnalystSearchTerm(e.target.value)}
                                                                    className="w-full px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <ul className="overflow-y-auto flex-grow text-gray-800">
                                                                {filteredAvailableUsers.length > 0 ? filteredAvailableUsers.map(user => (
                                                                    <li key={user.matricula} className="p-2 hover:bg-blue-50 cursor-pointer flex items-center" onClick={() => handleToggleAnalystSelection(user.matricula)}>
                                                                        <input
                                                                            type="checkbox"
                                                                            readOnly
                                                                            checked={selectedAnalystIds.includes(user.matricula)}
                                                                            className="h-4 w-4 rounded border-gray-300 text-[#005c9e] focus:ring-[#005c9e] mr-3 pointer-events-none"
                                                                        />
                                                                        <div className="w-full cursor-pointer select-none">
                                                                            <p className="font-medium text-gray-900">{user.nomeCompleto}</p>
                                                                            <p className="text-xs text-gray-500">(Sem bolsão)</p>
                                                                        </div>
                                                                    </li>
                                                                )) : (
                                                                    <li className="p-3 text-sm text-center text-gray-500">Nenhum analista disponível.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleAddSelectedUsers}
                                                    disabled={selectedAnalystIds.length === 0}
                                                    className="px-4 py-2.5 bg-[#005c9e] text-white rounded-md hover:bg-[#004a7c] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0 transition-all"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedBolsao.userIds.length > 0 ? (
                                                        selectedBolsao.userIds.map(userId => {
                                                            const user = manager.users.find(u => u.matricula === userId);
                                                            if (!user) return null;
                                                            return (
                                                                <tr key={userId} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nomeCompleto}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.matricula}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <button 
                                                                            onClick={() => handleRemoveUserClick(user)}
                                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 active:scale-95 p-1.5 rounded-md transition-all"
                                                                            title="Remover do bolsão"
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                                                Nenhum analista atribuído a este bolsão ainda.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'filters' && (
                                    <div className="space-y-6">
                                        {/* Documentos Atribuídos Section */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Documentos Atribuídos ({assignedDossies.length})</h3>
                                                {assignedDossies.length > 0 && (
                                                    <button 
                                                        onClick={handleUnassignAll}
                                                        className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md flex items-center space-x-2 hover:bg-red-700 active:scale-95 transition-all"
                                                    >
                                                        <TrashIcon className="h-3 w-3" />
                                                        <span>Desatribuir todos</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center border rounded-md mb-4 bg-gray-50">
                                                 <input 
                                                    type="text" 
                                                    placeholder="Buscar documentos atribuídos..." 
                                                    className="w-full p-2 pl-3 focus:outline-none bg-transparent text-sm text-gray-800 placeholder-gray-500"
                                                />
                                                 <button className="p-2 text-gray-500 hover:text-[#005c9e] transition-colors"><SearchIcon className="h-4 w-4" /></button>
                                            </div>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {assignedDossies.length > 0 ? (
                                                    assignedDossies.map(doc => (
                                                        <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md text-sm text-gray-800 hover:bg-gray-200 transition-colors group">
                                                            <div className="truncate pr-4">
                                                                <span className="font-bold text-[#005c9e] mr-2">{doc.id}</span>
                                                                <span className="text-gray-600">{doc.nrDoc}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleUnassignDossier(doc.id)}
                                                                className="text-gray-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                                                title="Remover documento"
                                                            >
                                                                <CloseIcon className="h-4 w-4"/>
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6 text-gray-500 text-sm italic bg-gray-50 rounded-md border border-dashed border-gray-300">
                                                        Nenhum documento atribuído manualmente a este bolsão.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase border-b pb-2">Critérios de Elegibilidade (Filtros)</h3>
                                            <p className="text-sm text-gray-600 mb-6">
                                                Os documentos que corresponderem aos filtros abaixo serão automaticamente direcionados para a fila deste bolsão.
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 text-sm mb-4">
                                                <div className="lg:col-span-3"><SelectInput label="Grupo Credor" /></div>
                                                <div className="lg:col-span-3"><SelectInput label="Agente Financeiro" /></div>
                                                <div className="lg:col-span-3"><SelectInput label="Hipoteca" /></div>
                                                <div className="lg:col-span-3"><SelectInput label="FH 1/2/3" /></div>
                                                <div className="lg:col-span-2"><SelectInput label="Categoria" /></div>
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
                                                <div className="col-span-full flex justify-end items-end space-x-2 pt-4 border-t mt-2">
                                                    <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors active:scale-95">
                                                        <ResetIcon className="h-4 w-4 mr-2" />
                                                        Limpar Filtros
                                                    </button>
                                                    <button 
                                                        onClick={handleSaveRules}
                                                        className="flex items-center px-6 py-2 text-white bg-[#005c9e] hover:bg-[#004a7c] rounded-md shadow-sm transition-all active:scale-95"
                                                    >
                                                        Salvar Regras
                                                    </button>
                                                </div>
                                            </div>

                                            {searchedDossies.length > 0 && (
                                                <div className="border-t pt-4 mt-6">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h3 className="text-base font-medium text-gray-800">Dossiês correspondentes a esta regra ({searchedDossies.length})</h3>
                                                    </div>
                                                    <div className="overflow-x-auto border border-gray-200 rounded-md bg-white shadow-sm">
                                                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left">
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={searchedDossies.length > 0 && selectedDossierIds.length === searchedDossies.length}
                                                                            onChange={handleToggleSelectAll}
                                                                            className="h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e] cursor-pointer"
                                                                        />
                                                                    </th>
                                                                    {tableHeaders.map((col) => (
                                                                        <th key={col.key} onClick={() => handleSort(col.key)} className={`px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${col.className || ''}`}>
                                                                            <div className="flex items-center space-x-1">
                                                                                <span>{col.label}</span>
                                                                                {getSortIcon(col.key)}
                                                                            </div>
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {sortedSearchedDossies.map((doc) => (
                                                                    <tr key={doc.id} className={`hover:bg-blue-50 transition-colors ${selectedDossierIds.includes(doc.id) ? 'bg-blue-50' : ''}`} onClick={() => handleToggleSelectOne(doc.id)}>
                                                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                                            <input 
                                                                                type="checkbox" 
                                                                                checked={selectedDossierIds.includes(doc.id)}
                                                                                onChange={() => handleToggleSelectOne(doc.id)}
                                                                                className="h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e] cursor-pointer"
                                                                            />
                                                                        </td>
                                                                        {tableHeaders.map((col) => (
                                                                            <td key={`${doc.id}-${col.key}`} className="px-4 py-3 whitespace-nowrap text-gray-700 cursor-pointer">
                                                                                {/* @ts-ignore */}
                                                                                {doc[col.key]}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <button 
                                                            onClick={handleAssignSelectedDossiers}
                                                            disabled={selectedDossierIds.length === 0}
                                                            className={`px-6 py-2 rounded-md text-white font-medium transition-all shadow-sm flex items-center space-x-2 transform active:scale-95
                                                                ${selectedDossierIds.length > 0 ? 'bg-[#005c9e] hover:bg-[#004a7c] cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                                                        >
                                                            <AssignIcon className="h-4 w-4" />
                                                            <span>Atribuir Dossiês Selecionados ({selectedDossierIds.length})</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>Selecione ou crie um bolsão para começar.</p>
                        </div>
                    )}
                </main>
            </div>
            <DeleteBolsaoModal
                isOpen={!!bolsaoToDelete}
                onClose={() => setBolsaoToDelete(null)}
                onConfirm={handleConfirmDelete}
                bolsao={bolsaoToDelete}
            />
            <RemoveUserModal 
                isOpen={!!userToRemove}
                onClose={() => setUserToRemove(null)}
                onConfirm={handleConfirmRemoveUser}
                user={userToRemove}
                bolsaoName={selectedBolsao?.name}
            />
        </div>
    );
};

const TextInput: React.FC<{ label?: string }> = ({ label }) => (
    <div>
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none" />
    </div>
);

const SelectInput: React.FC<{ label?: string, options?: string[], defaultValue?: string }> = ({ label, options=['Todos', 'Opção 1', 'Opção 2'], defaultValue }) => (
     <div>
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <div className="relative">
            <select defaultValue={defaultValue} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4"/>
            </div>
        </div>
    </div>
);

const DateInput: React.FC<{label?: string}> = ({label}) => (
     <div className="w-full">
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <div className="relative">
             <input type="text" placeholder="dd/mm/aaaa" className="w-full p-2 border border-gray-300 rounded-md pr-10 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <CalendarIcon className="h-5 w-5"/>
            </div>
        </div>
     </div>
);

export default QueueManagement;
