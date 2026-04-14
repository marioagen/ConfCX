
import React from 'react';
import { AlertTriangleIcon, UserRoundIcon, FileTextIcon } from './Icons';
import { User } from '../types';

interface RemoveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  bolsaoName?: string;
}

const RemoveUserModal: React.FC<RemoveUserModalProps> = ({ isOpen, onClose, onConfirm, user, bolsaoName }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start space-x-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
             <AlertTriangleIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 pt-1">Remover analista do bolsão?</h2>
            <p className="text-sm text-gray-500 mt-1">
              Você está prestes a remover o analista da fila <span className="font-semibold text-gray-700">{bolsaoName}</span>.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-5 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                {user.nomeCompleto.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user.nomeCompleto}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
        </div>

        <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
                <UserRoundIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                    O analista ficará <span className="font-semibold text-green-600">disponível</span> para ser alocado em outros bolsões.
                </p>
            </div>
            <div className="flex items-start space-x-3">
                 <FileTextIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                    Os documentos já atribuídos <span className="font-semibold text-gray-800">permanecem com o analista</span> e não sofrerão alterações.
                </p>
            </div>
        </div>

        <div className="flex justify-end space-x-3 border-t pt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
                Cancelar
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Confirmar remoção
            </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveUserModal;
