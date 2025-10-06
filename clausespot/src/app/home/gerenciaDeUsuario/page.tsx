// Em: src/app/home/gerenciaDeUsuario/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormularioDoUsuario, type DadosDoFormulario } from './componentes/FormularioDoUsuario';
import { CardDeUsuario } from './componentes/CardDeUsuario';

// 1. Interface principal para o estado do usuário
export interface User {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  criado_em: Date | string;
}

// Dados mockados iniciais
const initialUsers: User[] = [ ];

export default function ManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // O estado de edição continua usando o tipo User, que é o objeto completo
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Hooks useEffect para localStorage permanecem os mesmos...
  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem('managedUsers');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Erro ao ler usuários do localStorage", error);
    }
  }, []);

  useEffect(() => {
    // Evita salvar no LS na primeira renderização se os dados forem os mockados
    if (users.length > 0 && JSON.stringify(users) !== JSON.stringify(initialUsers)) {
      try {
        window.localStorage.setItem('managedUsers', JSON.stringify(users));
      } catch (error) {
        console.error("Erro ao salvar usuários no localStorage", error);
      }
    }
  }, [users]);


  const handleOpenModal = (user: User | null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // 2. Função de salvar ajustada para receber 'DadosDoFormulario'
  const handleSaveUser = (data: DadosDoFormulario) => {
    // A 'senha' vem do formulário, mas não é armazenada no nosso estado 'users'.
    // Usamos a desestruturação para separar a senha do resto dos dados.
    const { senha, ...userData } = data;

    if (editingUser) {
      // MODO EDIÇÃO
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...userData } // Atualiza o usuário existente com os novos dados do formulário
          : user
      ));
    } else {
      // MODO CRIAÇÃO
      const newUser: User = {
        ...userData, // usa os dados do formulário (sem a senha)
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        criado_em: new Date().toISOString(),
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    handleCloseModal();
  };

  // 3. A função de deletar não precisa de alterações
  const handleDeleteUser = (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">Gerenciamento de Usuários</h1>
            <p className="mt-1 text-gray-600">Adicione, edite ou visualize os usuários do sistema.</p>
          </div>
          <Button
            style={{ backgroundColor: '#2c5582' }}
            className="text-white hover:opacity-90 flex items-center gap-2"
            onClick={() => handleOpenModal(null)}
          >
            <UserPlus className="h-5 w-5" />
            Cadastrar Usuário
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <CardDeUsuario
              key={user.id}
              user={user}
              onEdit={() => handleOpenModal(user)}
              onDelete={() => handleDeleteUser(user.id)}
            />
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</DialogTitle>
          </DialogHeader>
          {/* 4. Passando os dados corretamente. `editingUser` é compatível com `initialData` */}
          <FormularioDoUsuario
            onSave={handleSaveUser}
            onCancel={handleCloseModal}
            initialData={editingUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}