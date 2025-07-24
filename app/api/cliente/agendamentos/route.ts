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
    const agendamentos = await prisma.agendamento.findMany({
      where: { clienteId: payload.id },
      include: { servico: true, barbeiro: true },
      orderBy: { dataHora: 'asc' },
    });
    return NextResponse.json({ agendamentos });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar agendamentos.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const { servicoId, barbeiroId, dataHora } = await req.json();
    if (!servicoId || !barbeiroId || !dataHora) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }
    // Verifica conflito de horário para o barbeiro
    const conflito = await prisma.agendamento.findFirst({
      where: { barbeiroId, dataHora: new Date(dataHora) },
    });
    if (conflito) {
      return NextResponse.json({ error: 'Horário já agendado para este barbeiro.' }, { status: 409 });
    }
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: payload.id,
        servicoId,
        barbeiroId,
        dataHora: new Date(dataHora),
      },
      include: { servico: true, barbeiro: true },
    });
    return NextResponse.json({ agendamento });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar agendamento.' }, { status: 500 });
  }
} 