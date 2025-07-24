"use client";

import { useEffect, useState } from 'react';

export default function AdminBarbeiros() {
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function carregar() {
    fetch('/api/admin/barbeiros', {
      headers: { Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '' },
    })
      .then(res => res.json())
      .then(data => setBarbeiros(data.barbeiros || []));
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(e: any) {
    e.preventDefault();
    setErro(''); setSucesso('');
    const res = await fetch('/api/admin/barbeiros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') || '' },
      body: JSON.stringify({ nome }),
    });
    const data = await res.json();
    if (res.ok) {
      setSucesso('Barbeiro cadastrado!');
      setNome('');
      carregar();
    } else {
      setErro(data.error || 'Erro ao cadastrar.');
    }
  }

  async function remover(id: string) {
    if (!confirm('Remover este barbeiro?')) return;
    await fetch(`/api/admin/barbeiros/${id}`, {
      method: 'DELETE',
      headers: { Authorization: localStorage.getItem('token') || '' },
    });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Barbeiros</h1>
      <form onSubmit={cadastrar} className="flex gap-2 mb-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do barbeiro" className="border p-2 rounded flex-1" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar</button>
      </form>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      {sucesso && <div className="text-green-600 mb-2">{sucesso}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {barbeiros.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.nome}</td>
                <td className="p-2">
                  <button onClick={() => remover(b.id)} className="text-red-600 hover:underline">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 