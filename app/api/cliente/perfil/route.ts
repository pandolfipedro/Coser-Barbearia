import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar perfil.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const { nome, telefone } = await req.json();
    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios.' }, { status: 400 });
    }
    await prisma.user.update({ where: { id: payload.id }, data: { nome, telefone } });
    return NextResponse.json({ message: 'Perfil atualizado!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil.' }, { status: 500 });
  }
} 