import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const { servicoId, barbeiroId, dataHora } = await req.json();
    const agendamento = await prisma.agendamento.findUnique({ where: { id: params.id } });
    if (!agendamento || agendamento.clienteId !== payload.id) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }
    // Verifica conflito de horário
    if (barbeiroId && dataHora) {
      const conflito = await prisma.agendamento.findFirst({
        where: { barbeiroId, dataHora: new Date(dataHora), NOT: { id: params.id } },
      });
      if (conflito) {
        return NextResponse.json({ error: 'Horário já agendado para este barbeiro.' }, { status: 409 });
      }
    }
    const atualizado = await prisma.agendamento.update({
      where: { id: params.id },
      data: {
        servicoId: servicoId || agendamento.servicoId,
        barbeiroId: barbeiroId || agendamento.barbeiroId,
        dataHora: dataHora ? new Date(dataHora) : agendamento.dataHora,
      },
      include: { servico: true, barbeiro: true },
    });
    return NextResponse.json({ agendamento: atualizado });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao editar agendamento.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const agendamento = await prisma.agendamento.findUnique({ where: { id: params.id } });
    if (!agendamento || agendamento.clienteId !== payload.id) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }
    await prisma.agendamento.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Agendamento cancelado com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar agendamento.' }, { status: 500 });
  }
} 