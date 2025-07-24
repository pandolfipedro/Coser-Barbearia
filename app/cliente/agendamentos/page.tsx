"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClienteAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [erro, setErro] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/cliente/agendamentos', {
      headers: { Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '' },
    })
      .then(res => res.json())
      .then(data => setAgendamentos(data.agendamentos || []))
      .catch(() => setErro('Erro ao carregar agendamentos.'));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        <button onClick={() => router.push('/cliente/agendamentos/novo')} className="bg-blue-600 text-white px-4 py-2 rounded">Novo Agendamento</button>
      </div>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Serviço</th>
              <th className="p-2">Barbeiro</th>
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.servico?.nome}</td>
                <td className="p-2">{a.barbeiro?.nome}</td>
                <td className="p-2">{new Date(a.dataHora).toLocaleString('pt-BR')}</td>
                <td className="p-2">
                  {/* Botões de editar/cancelar podem ser implementados */}
                  <button className="text-blue-600 hover:underline mr-2">Editar</button>
                  <button className="text-red-600 hover:underline">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 