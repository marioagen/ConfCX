import React from 'react';
import { Document } from '../types';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon } from './Icons';

type SortKey = keyof Document | 'filaOrigem';
type SortDirection = 'asc' | 'desc';

export const tableHeaders: { key: SortKey; label: string; className?: string }[] = [
    { key: 'id', label: 'Id' }, 
    { key: 'nrDoc', label: 'Nr. Doc.', className: 'min-w-[250px]' }, 
    { key: 'filaOrigem', label: 'Localização / Fila', className: 'min-w-[250px]' },
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

interface DocumentTableProps {
    documents: Document[];
    sortConfig: { key: SortKey | null; direction: SortDirection };
    onSort: (key: SortKey) => void;
    selectedIds: string[];
    onToggleOne: (id: string) => void;
    enableSelection?: boolean;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ 
    documents, 
    sortConfig, 
    onSort, 
    selectedIds, 
    onToggleOne,
    enableSelection = true
}) => {
    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return <ChevronDownIcon className="h-3 w-3 text-gray-300" />;
        if (sortConfig.direction === 'asc') return <ChevronUpIcon className="h-3 w-3" />;
        return <ChevronDownIcon className="h-3 w-3" />;
    };
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {enableSelection && (
                            <th scope="col" className="px-4 py-3 text-left w-10">
                            {/* Checkbox column */}
                            </th>
                        )}
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key} scope="col" onClick={() => onSort(key)} className={`px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${className ?? ''}`}>
                                <div className="flex items-center space-x-1">
                                    <span>{label}</span>
                                    {getSortIcon(key)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map(doc => (
                        <tr key={doc.id} className={`hover:bg-blue-50 transition-colors ${selectedIds.includes(doc.id) ? 'bg-blue-50' : ''}`} onClick={() => enableSelection && onToggleOne(doc.id)}>
                            {enableSelection && (
                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(doc.id)}
                                        onChange={() => onToggleOne(doc.id)}
                                        className="h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e] cursor-pointer"
                                    />
                                </td>
                            )}
                            {tableHeaders.map(({key}) => {
                                if (key === 'filaOrigem') {
                                    return <td key={`${doc.id}-${key}`} className="px-4 py-3 whitespace-nowrap text-gray-700">
                                        {doc.bolsao ? (
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#005c9e]">{doc.bolsao}</span>
                                                <span className="text-gray-500 text-[10px]">{doc.gestor}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">-</span>
                                        )}
                                    </td>;
                                }
                                return <td key={`${doc.id}-${key}`} className="px-4 py-3 whitespace-nowrap text-gray-700 cursor-pointer">{doc[key as keyof Document]}</td>
                            })}
                        </tr>
                    ))}
                    {documents.length === 0 && (
                        <tr>
                            <td colSpan={tableHeaders.length + (enableSelection ? 1 : 0)} className="px-4 py-8 text-center text-gray-500 italic">
                                Nenhum documento disponível com os filtros atuais.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export const DocumentItem: React.FC<{doc: Document}> = ({ doc }) => {
    return (
        <div className="border rounded-md p-3 flex items-start space-x-3 text-xs text-gray-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input type="checkbox" className="mt-1 h-4 w-4 text-[#005c9e] border-gray-300 rounded focus:ring-[#005c9e]"/>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-[#005c9e]">Id: {doc.id}</span></p>
                <p><span className="font-semibold text-gray-800">Nr. Doc.:</span> {doc.nrDoc}</p>
                {doc.gestor && doc.bolsao && (
                    <p className="col-span-full"><span className="font-semibold text-gray-800">Localização:</span> {doc.gestor} &gt; {doc.bolsao}</p>
                )}
                <p><span className="font-semibold text-gray-800">Cat.:</span> {doc.cat}</p>
                <p><span className="font-semibold text-gray-800">Stat.:</span> {doc.stat}</p>
                <p><span className="font-semibold text-gray-800">Dt. assin.:</span> {doc.dtAssin}</p>
                <p className="col-span-1 sm:col-span-2"><span className="font-semibold text-gray-800">Mut.:</span> {doc.mut}</p>
                <p><span className="font-semibold text-gray-800">Tipo evt.:</span> {doc.tipoEvt}</p>
                <p><span className="font-semibold text-gray-800">OR:</span> {doc.or}</p>
                <p><span className="font-semibold text-gray-800">Plan. reaj.:</span> {doc.planReaj}</p>
                <p><span className="font-semibold text-gray-800">IM:</span> {doc.im}</p>
                <p><span className="font-semibold text-gray-800">FH2:</span> {doc.fh2}</p>
                <p><span className="font-semibold text-gray-800">FH3:</span> {doc.fh3}</p>
                <p><span className="font-semibold text-gray-800">Cess.:</span> {doc.cess}</p>
                <p><span className="font-semibold text-gray-800">Cef:</span> {doc.cef}</p>
                <p><span className="font-semibold text-gray-800">{doc.codigoFh2}</span></p>
            </div>
        </div>
    )
};

export const TextInput: React.FC<{ label?: string }> = ({ label }) => (
    <div>
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none" />
    </div>
);

export const SelectInput: React.FC<{
    label?: string;
    options?: string[];
    defaultValue?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, options=['Opção 1', 'Opção 2'], defaultValue, value, onChange }) => (
     <div>
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <div className="relative">
            <select
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-gray-50 text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4"/>
            </div>
        </div>
    </div>
);

export const DateInput: React.FC<{label?: string}> = ({label}) => (
     <div className="w-full">
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <div className="relative">
             <input type="text" placeholder="dd/mm/aaaa" className="w-full p-2 border border-gray-300 rounded-md pr-10 bg-gray-50 text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors outline-none" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <CalendarIcon className="h-5 w-5"/>
            </div>
        </div>
     </div>
);

export const ActionButton: React.FC<{ icon: React.ReactNode, color: 'blue' | 'gray' | 'green' }> = ({ icon, color }) => {
    const colorClasses = {
        blue: 'bg-[#005c9e] hover:bg-[#004a7c] text-white active:bg-[#00385e]',
        gray: 'bg-gray-200 hover:bg-gray-300 text-gray-700 active:bg-gray-400',
        green: 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800',
    };
    return (
        <button className={`p-2 rounded-md transition-all active:scale-95 duration-100 ${colorClasses[color]}`}>{icon}</button>
    )
};