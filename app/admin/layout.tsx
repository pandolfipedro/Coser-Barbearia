import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 font-bold text-xl border-b">Painel Admin</div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/admin/agendamentos" className="py-2 px-4 rounded hover:bg-gray-200">Agendamentos</Link>
          <Link href="/admin/barbeiros" className="py-2 px-4 rounded hover:bg-gray-200">Barbeiros</Link>
          <Link href="/admin/servicos" className="py-2 px-4 rounded hover:bg-gray-200">Serviços</Link>
          <Link href="/admin/administradores" className="py-2 px-4 rounded hover:bg-gray-200">Administradores</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:ml-64">{children}</main>
    </div>
  );
} 