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

// Estado inicial vazio para os usuários.
// const initialUsers: User[] = [];

export default function ManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Armazena o usuário completo que está sendo editado, ou null se for um novo cadastro.
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>( [] );

  // Efeito para carregar os usuários do localStorage ao iniciar o componente.
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

  // Efeito para salvar os usuários no localStorage sempre que a lista for alterada.
  useEffect(() => {
    // Função para buscar os usuários da nossa API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Falha ao buscar usuários');
        }
        const data = await response.json();
        setUsers(data); // Atualiza o estado com os usuários do arquivo JSON
      } catch (error) {
        console.error(error);
        toast.error('Não foi possível carregar a lista de usuários.');
      }
    };

    fetchUsers(); // Chama a função ao carregar o componente
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // ... (o restante do seu código, como handleSaveUser, handleOpenModal, etc., permanece o mesmo)
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
      // LÓGICA DE EDIÇÃO (ainda pode ser local ou chamar uma API PUT/PATCH)
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
      toast.success("Usuário atualizado com sucesso!");

    } else {
      // LÓGICA DE CRIAÇÃO (chama a nossa nova API)
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), // Envia os dados completos do formulário
        });

        const result = await response.json();

        if (!response.ok) {
          // Se a API retornar um erro (ex: e-mail duplicado), mostra a mensagem
          throw new Error(result.message || 'Falha ao criar usuário.');
        }

        // Adiciona o novo usuário retornado pela API ao estado da página
        setUsers(prevUsers => [...prevUsers, result]);
        toast.success("Usuário cadastrado com sucesso!");
        
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        toast.error(errorMessage); // Usa o toast para mostrar o erro
        return; // Impede o fechamento do modal em caso de erro
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
      // ... seu JSX continua aqui
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