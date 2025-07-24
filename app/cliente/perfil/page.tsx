import { useEffect, useState } from 'react';

export default function PerfilCliente() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('/api/cliente/perfil', {
      headers: { Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '' },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setNome(data.user?.nome || '');
        setTelefone(data.user?.telefone || '');
      });
  }, []);

  async function salvar(e: any) {
    e.preventDefault();
    setErro(''); setSucesso('');
    const res = await fetch('/api/cliente/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') || '' },
      body: JSON.stringify({ nome, telefone }),
    });
    const data = await res.json();
    if (res.ok) {
      setSucesso('Perfil atualizado!');
    } else {
      setErro(data.error || 'Erro ao atualizar.');
    }
  }

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm">Nome</label>
          <input value={nome} onChange={e => setNome(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">Telefone</label>
          <input value={telefone} onChange={e => setTelefone(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">CPF</label>
          <input value={user.cpf} disabled className="border p-2 rounded w-full bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm">Nascimento</label>
          <input value={new Date(user.nascimento).toLocaleDateString('pt-BR')} disabled className="border p-2 rounded w-full bg-gray-100" />
        </div>
        {erro && <div className="text-red-500">{erro}</div>}
        {sucesso && <div className="text-green-600">{sucesso}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
      </form>
    </div>
  );
} 