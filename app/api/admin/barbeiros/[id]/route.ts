import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.barbeiro.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Barbeiro removido com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover barbeiro.' }, { status: 500 });
  }
} 