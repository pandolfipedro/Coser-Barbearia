import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para extrair o id da URL dinâmica
function getIdFromRequest(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

// Atualiza agendamento existente
export async function PATCH(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    const { clienteId, servicoId, barbeiroId, dataHora } = await req.json();

    const agendamento = await prisma.agendamento.findUnique({ where: { id } });

    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
    }

    // Verifica conflito de horário (caso altere barbeiro e horário)
    if (barbeiroId && dataHora) {
      const conflito = await prisma.agendamento.findFirst({
        where: {
          barbeiroId,
          dataHora: new Date(dataHora),
          NOT: { id },
        },
      });

      if (conflito) {
        return NextResponse.json({ error: 'Horário já agendado para este barbeiro.' }, { status: 409 });
      }
    }

    const atualizado = await prisma.agendamento.update({
      where: { id },
      data: {
        clienteId: clienteId ?? agendamento.clienteId,
        servicoId: servicoId ?? agendamento.servicoId,
        barbeiroId: barbeiroId ?? agendamento.barbeiroId,
        dataHora: dataHora ? new Date(dataHora) : agendamento.dataHora,
      },
      include: {
        cliente: true,
        servico: true,
        barbeiro: true,
      },
    });

    return NextResponse.json({ agendamento: atualizado });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao editar agendamento.' }, { status: 500 });
  }
}

// Remove agendamento existente
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);

  const agendamento = await prisma.agendamento.findUnique({ where: { id } });

  if (!agendamento) {
    return NextResponse.json({ error: 'Agendamento não encontrado.' }, { status: 404 });
  }

  await prisma.agendamento.delete({ where: { id } });

  return NextResponse.json(null, { status: 204 });
}
