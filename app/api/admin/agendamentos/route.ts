import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: { cliente: true, servico: true, barbeiro: true },
      orderBy: { dataHora: 'asc' },
    });
    return NextResponse.json({ agendamentos });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar agendamentos.' }, { status: 500 });
  }
} 