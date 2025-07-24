import { useEffect, useState } from 'react';

export default function AdminServicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function carregar() {
    fetch('/api/admin/servicos', {
      headers: { Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '' },
    })
      .then(res => res.json())
      .then(data => setServicos(data.servicos || []));
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(e: any) {
    e.preventDefault();
    setErro(''); setSucesso('');
    const res = await fetch('/api/admin/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') || '' },
      body: JSON.stringify({ nome, preco }),
    });
    const data = await res.json();
    if (res.ok) {
      setSucesso('Serviço cadastrado!');
      setNome(''); setPreco('');
      carregar();
    } else {
      setErro(data.error || 'Erro ao cadastrar.');
    }
  }

  async function remover(id: string) {
    if (!confirm('Remover este serviço?')) return;
    await fetch(`/api/admin/servicos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: localStorage.getItem('token') || '' },
    });
    carregar();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Serviços</h1>
      <form onSubmit={cadastrar} className="flex gap-2 mb-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do serviço" className="border p-2 rounded flex-1" />
        <input value={preco} onChange={e => setPreco(e.target.value)} placeholder="Preço" type="number" min="0" step="0.01" className="border p-2 rounded w-32" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar</button>
      </form>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      {sucesso && <div className="text-green-600 mb-2">{sucesso}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Preço</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.nome}</td>
                <td className="p-2">R$ {Number(s.preco).toFixed(2)}</td>
                <td className="p-2">
                  <button onClick={() => remover(s.id)} className="text-red-600 hover:underline">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 