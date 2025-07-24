import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  try {
    const { cpf, nascimento } = await req.json();
    if (!cpf || !nascimento) {
      return NextResponse.json({ error: 'CPF e data de nascimento são obrigatórios.' }, { status: 400 });
    }
    // Validação simples de CPF
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      return NextResponse.json({ error: 'CPF inválido. Use o formato 000.000.000-00.' }, { status: 400 });
    }
    // Busca usuário
    const user = await prisma.user.findUnique({ where: { cpf } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    // Confere data de nascimento
    const nascimentoDate = new Date(nascimento);
    if (user.nascimento.getTime() !== nascimentoDate.getTime()) {
      return NextResponse.json({ error: 'Dados de login inválidos.' }, { status: 401 });
    }
    // Gera JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: user.id, nome: user.nome, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao realizar login. Tente novamente.' }, { status: 500 });
  }
} 