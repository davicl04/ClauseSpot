import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// Define o caminho para o arquivo de usuários
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

const readUsers = () => {
  try {
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Erro ao ler o arquivo de usuários:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const users = readUsers();
    
    // 1. Encontrar o usuário pelo e-mail no arquivo JSON
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ valid: false, message: 'Email ou senha inválidos' });
    }

    // 2. Comparar a senha fornecida com a senha criptografada (hash)
    const isPasswordCorrect = await bcrypt.compare(password, user.senhaHash);

    if (isPasswordCorrect) {
      // 3. Se a senha estiver correta, retorna a resposta que o frontend espera
      const { senhaHash, ...userToReturn } = user;
      return NextResponse.json({ valid: true, user: userToReturn });
    } else {
      // Se a senha estiver incorreta
      return NextResponse.json({ valid: false, message: 'Email ou senha inválidos' });
    }

  } catch (error) {
    console.error('Erro na API /api/login:', error);
    return NextResponse.json(
      { 
        valid: false, 
        message: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}