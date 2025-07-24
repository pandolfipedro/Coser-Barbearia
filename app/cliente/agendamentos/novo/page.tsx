"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoAgendamento() {
  const [servicos, setServicos] = useState<unknown[]>([]);
  const [barbeiros, setBarbeiros] = useState<unknown[]>([]);
  const [servicoId, setServicoId] = useState('');
  const [barbeiroId, setBarbeiroId] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/servicos', { headers: { Authorization: localStorage.getItem('token') || '' } })
      .then(res => res.json()).then(data => setServicos(data.servicos || []));
    fetch('/api/admin/barbeiros', { headers: { Authorization: localStorage.getItem('token') || '' } })
      .then(res => res.json()).then(data => setBarbeiros(data.barbeiros || []));
  }, []);

  async function agendar(e: unknown) {
    (e as React.FormEvent).preventDefault();
    setErro(''); setSucesso('');
    const res = await fetch('/api/cliente/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') || '' },
      body: JSON.stringify({ servicoId, barbeiroId, dataHora }),
    });
    const data = await res.json();
    if (res.ok) {
      setSucesso('Agendamento realizado!');
      setTimeout(() => router.push('/cliente/agendamentos'), 1200);
    } else {
      setErro(data.error || 'Erro ao agendar.');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Novo Agendamento</h1>
      <form onSubmit={agendar} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm">Serviço</label>
          <select value={servicoId} onChange={e => setServicoId(e.target.value)} className="border p-2 rounded w-full">
            <option value="">Selecione</option>
            {servicos.map((s: unknown) => <option key={(s as any).id} value={(s as any).id}>{(s as any).nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Barbeiro</label>
          <select value={barbeiroId} onChange={e => setBarbeiroId(e.target.value)} className="border p-2 rounded w-full">
            <option value="">Selecione</option>
            {barbeiros.map((b: unknown) => <option key={(b as any).id} value={(b as any).id}>{(b as any).nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Data e Hora</label>
          <input type="datetime-local" value={dataHora} onChange={e => setDataHora(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        {erro && <div className="text-red-500">{erro}</div>}
        {sucesso && <div className="text-green-600">{sucesso}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Agendar</button>
      </form>
    </div>
  );
} 