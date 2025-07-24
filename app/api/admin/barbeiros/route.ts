import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const barbeiros = await prisma.barbeiro.findMany();
    return NextResponse.json({ barbeiros });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar barbeiros.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nome } = await req.json();
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    }
    const barbeiro = await prisma.barbeiro.create({ data: { nome } });
    return NextResponse.json({ barbeiro });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar barbeiro.' }, { status: 500 });
  }
} 