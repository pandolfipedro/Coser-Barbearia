import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { clienteId, servicoId, barbeiroId, dataHora } = await req.json();

    const agendamento = await prisma.agendamento.findUnique({ where: { id: params.id } });
    if (!agendamento) {
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
        clienteId: clienteId ?? agendamento.clienteId,
        servicoId: servicoId ?? agendamento.servicoId,
        barbeiroId: barbeiroId ?? agendamento.barbeiroId,
        dataHora: dataHora ? new Date(dataHora) : agendamento.dataHora,
      },
      include: { cliente: true, servico: true, barbeiro: true },
    });

    return NextResponse.json({ agendamento: atualizado });
  } catch {
    return NextResponse.json({ error: 'Erro ao editar agendamento.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const agendamento = await prisma.agendamento.findUnique({ where: { id } });
  if (!agendamento) {
    return new Response(
      JSON.stringify({ error: 'Agendamento não encontrado.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await prisma.agendamento.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
