import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.servico.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Serviço removido com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover serviço.' }, { status: 500 });
  }
} 