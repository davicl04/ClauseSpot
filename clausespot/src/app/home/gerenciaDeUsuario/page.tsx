"use client";
import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormularioDoUsuario, type DadosDoFormulario } from './componentes/FormularioDoUsuario';
import { CardDeUsuario } from './componentes/CardDeUsuario';
import { set } from 'zod';


// Interface que define a estrutura de dados de um usuário na aplicação.
export interface User {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  criado_em: Date | string;
}

// const initialUsers: User[] = [];

export default function ManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

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
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Falha ao buscar usuários');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        toast.error('Não foi possível carregar a lista de usuários.');
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = (user: User | null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (data: any) => {
    if (editingUser) {
      // LÓGICA DE EDIÇÃO
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
      toast.success("Usuário atualizado com sucesso!");

    } else {
      // LÓGICA DE CRIAÇÃO
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Falha ao criar usuário.');
        }

        setUsers(prevUsers => [...prevUsers, result]);
        toast.success("Usuário cadastrado com sucesso!");

      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        toast.error(errorMessage);
        return;
      }
    }
    handleCloseModal();
  };

  const handleDeleteUser = (userId: any) => {
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