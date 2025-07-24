import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany();
    return NextResponse.json({ servicos });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar serviços.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nome, preco } = await req.json();
    if (!nome || preco === undefined) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios.' }, { status: 400 });
    }
    const servico = await prisma.servico.create({ data: { nome, preco: parseFloat(preco) } });
    return NextResponse.json({ servico });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar serviço.' }, { status: 500 });
  }
} 