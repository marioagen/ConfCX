
export interface AssignedDoc {
  id: string;
  name: string;
}

export interface User {
  matricula: string;
  nomeCompleto: string;
  email: string;
  local: string;
  docsAtribuidos: AssignedDoc[] | '-';
  bolsao?: string; // New optional property to identify the group/pool
}

export interface Manager {
  id: number;
  name: string;
  users: User[];
}

export interface Document {
    id: string;
    nrDoc: string;
    cat: string;
    stat: string;
    dtAssin: string;
    mut: string;
    tipoEvt: string;
    or: string;
    planReaj: string;
    im: string;
    fh2: string;
    fh3: string;
    cess: string;
    cef: string;
    codigoFh2: string;
    gestor?: string;
    bolsao?: string;
}

export interface UserProfile {
    name: string;
    role: 'analyst' | 'manager';
}

export interface Bolsao {
    id: number;
    name: string;
    userIds: string[];
}
