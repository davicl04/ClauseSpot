import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

const readUsers = () => {
  try {
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Erro ao ler o arquivo de usuários:", error);
    return [];
  }
};

// ... (a função writeUsers e a função POST continuam aqui)
const writeUsers = (users: any) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// 👇 ADICIONE ESTA NOVA FUNÇÃO GET 👇
export async function GET() {
  try {
    const users = readUsers();

    // Mapeia os usuários para remover o hash da senha antes de enviar para o frontend
    const usersWithoutPassword = users.map((user: any) => {
      const { senhaHash, ...rest } = user;
      return rest;
    });

    return NextResponse.json(usersWithoutPassword);
  } catch (error) {
    console.error('Erro na API GET /api/users:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  // ... sua função POST continua aqui, sem alterações.
  try {
    const data = await request.json();
    const { email, nome, usuario, status, senha } = data;

    // Validação básica
    if (!email || !senha || !nome || !usuario) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const users = readUsers();

    // Verifica se o e-mail ou usuário já existem
    if (users.some((user: any) => user.email === email)) {
      return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 409 }); // 409 Conflict
    }
    if (users.some((user: any) => user.usuario === usuario)) {
      return NextResponse.json({ message: 'Este nome de usuário já está em uso.' }, { status: 409 });
    }

    // Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10); // O 10 é o "salt rounds"

    // Cria o novo objeto de usuário
    const newUser = {
      id: String(users.length + 1), // ID simples, para um sistema real use UUID
      nome,
      email,
      usuario,
      status,
      criado_em: new Date().toISOString(),
      senhaHash, // Salva a senha criptografada
    };

    // Adiciona o novo usuário à lista e salva no arquivo
    users.push(newUser);
    writeUsers(users);

    // Retorna o novo usuário criado (sem a senha) para o frontend
    const { senhaHash: _, ...userToReturn } = newUser;
    return NextResponse.json(userToReturn, { status: 201 });

  } catch (error) {
    console.error('Erro na API /api/users:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}