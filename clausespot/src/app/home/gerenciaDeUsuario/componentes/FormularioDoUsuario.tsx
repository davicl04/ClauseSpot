import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DadosDoFormulario {
  usuario: string;
  nome: string;
  email: string;
  senha?: string; // Senha é opcional na edição
}

interface PropsFormDeUsuario {
  initialData?: DadosDoFormulario | null;
  onSave: (data: DadosDoFormulario) => void;
  onCancel: () => void;
}

export const FormularioDoUsuario = ({ initialData, onSave, onCancel }: PropsFormDeUsuario) => {
  const [formData, setFormData] = useState<DadosDoFormulario>({
    usuario: '',
    nome: '',
    email: '',
    senha: '',
  });

  // Efeito para preencher o formulário quando estiver em modo de edição
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        senha: '' // Sempre limpa o campo senha por segurança
      });
    } else {
      // Limpa o formulário se não houver dados iniciais (modo de criação)
       setFormData({ usuario: '', nome: '', email: '', senha: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuário</label>
        <Input id="usuario" type="text" placeholder="Ex: ana.silva" className="mt-1" value={formData.usuario} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <Input id="nome" type="text" placeholder="Ex: Ana Silva" className="mt-1" value={formData.nome} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
        <Input id="email" type="email" placeholder="Ex: ana.silva@example.com" className="mt-1" value={formData.email} onChange={handleChange} required />
      </div>
       <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <Input id="senha" type="password" placeholder={initialData ? "Deixe em branco para não alterar" : "********"} className="mt-1" value={formData.senha} onChange={handleChange} required={!initialData} />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" style={{ backgroundColor: '#2c5582' }} className="text-white hover:opacity-90">Salvar Usuário</Button>
      </div>
    </form>
  );
};
