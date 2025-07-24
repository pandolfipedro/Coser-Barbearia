import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, nascimento, telefone } = await req.json();
    if (!nome || !cpf || !nascimento || !telefone) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }
    // Validação simples de CPF (formato 000.000.000-00)
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      return NextResponse.json({ error: 'CPF inválido. Use o formato 000.000.000-00.' }, { status: 400 });
    }
    // Validação de data
    if (isNaN(Date.parse(nascimento))) {
      return NextResponse.json({ error: 'Data de nascimento inválida.' }, { status: 400 });
    }
    // Verifica duplicidade de CPF
    const exists = await prisma.user.findUnique({ where: { cpf } });
    if (exists) {
      return NextResponse.json({ error: 'Já existe um usuário com este CPF.' }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        nome,
        cpf,
        nascimento: new Date(nascimento),
        telefone,
        role: 'cliente',
      },
    });
    return NextResponse.json({ message: 'Cadastro realizado com sucesso!', user: { id: user.id, nome: user.nome, cpf: user.cpf } });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar. Tente novamente.' }, { status: 500 });
  }
} 