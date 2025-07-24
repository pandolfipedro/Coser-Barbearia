import Link from 'next/link';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow flex items-center justify-between px-4 py-3">
        <div className="font-bold text-lg">Área do Cliente</div>
        <nav className="flex gap-4">
          <Link href="/cliente/agendamentos" className="py-1 px-3 rounded hover:bg-gray-200">Meus Agendamentos</Link>
          <Link href="/cliente/perfil" className="py-1 px-3 rounded hover:bg-gray-200">Perfil</Link>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
} 