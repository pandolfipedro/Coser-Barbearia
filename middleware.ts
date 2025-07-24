import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Rotas protegidas
  const isAdminRoute = pathname.startsWith('/admin');
  const isClienteRoute = pathname.startsWith('/cliente');

  if (isAdminRoute || isClienteRoute) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.json({ error: 'Acesso restrito a administradores.' }, { status: 403 });
      }
      if (isClienteRoute && payload.role !== 'cliente') {
        return NextResponse.json({ error: 'Acesso restrito a clientes.' }, { status: 403 });
      }
      // Usuário autenticado e autorizado
      return NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 401 });
    }
  }
  // Rotas públicas
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cliente/:path*'],
}; 