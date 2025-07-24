// Types for the main entities used in the app

export interface Barbeiro {
  id: string;
  nome: string;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
}

export interface Cliente {
  nome: string;
}

export interface Agendamento {
  id: string;
  cliente?: Cliente;
  servico?: Servico;
  barbeiro?: Barbeiro;
  dataHora: string;
}

export interface User {
  nome: string;
  telefone: string;
  cpf: string;
  nascimento: string;
} 