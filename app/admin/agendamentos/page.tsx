"use client";

import { useEffect, useState } from 'react';

export default function AdminAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('/api/admin/agendamentos', {
      headers: { Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '' },
    })
      .then(res => res.json())
      .then(data => setAgendamentos(data.agendamentos || []))
      .catch(() => setErro('Erro ao carregar agendamentos.'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Cliente</th>
              <th className="p-2">Serviço</th>
              <th className="p-2">Barbeiro</th>
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.cliente?.nome}</td>
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