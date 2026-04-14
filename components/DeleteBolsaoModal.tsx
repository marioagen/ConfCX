
import React from 'react';
import { AlertTriangleIcon, TrashIcon, UsersIcon, FileTextIcon } from './Icons';
import { Bolsao } from '../types';

interface DeleteBolsaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bolsao: Bolsao | null;
}

const DeleteBolsaoModal: React.FC<DeleteBolsaoModalProps> = ({ isOpen, onClose, onConfirm, bolsao }) => {
  if (!isOpen || !bolsao) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start space-x-3 mb-4">
          <AlertTriangleIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
          <h2 className="text-xl font-semibold text-gray-800 pt-1">Deseja realmente excluir esta fila?</h2>
        </div>
        
        <div className="bg-gray-50 border-l-4 border-[#005c9e] p-4 mb-4">
            <p className="font-semibold text-gray-800">Fila: <span className="font-bold uppercase">{bolsao.name}</span></p>
            <p className="text-sm text-gray-600">Prioridade: <span className="font-semibold">P{bolsao.id}</span></p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <div className="flex items-center space-x-2">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
                <h3 className="font-bold text-red-800">ATENÇÃO: Esta ação não pode ser desfeita!</h3>
            </div>
            <ul className="mt-3 ml-1 space-y-2 text-red-800 text-sm">
                <li className="flex items-center space-x-3">
                    <TrashIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>A fila será <span className="font-semibold">permanentemente</span> removida.</span>
                </li>
                <li className="flex items-center space-x-3">
                    <UsersIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>Todos os colaboradores serão <span className="font-semibold">desvinculados</span> da fila.</span>
                </li>
                <li className="flex items-center space-x-3">
                    <FileTextIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>Todos os documentos serão <span className="font-semibold">removidos</span> da fila.</span>
                </li>
            </ul>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
            <button
                onClick={onClose}
                className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
                Cancelar
            </button>
            <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
                Excluir
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBolsaoModal;
