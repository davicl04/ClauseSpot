import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create } from 'domain';

// 1. Schema base (campos comuns)
const baseSchema = z.object({
  usuario: z.string().min(3, { message: "Usuário deve ter no mínimo 3 caracteres." }),
  nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  status: z.enum(['Ativo', 'Inativo']),
});

// 2. Schema para CRIAR usuário (senha obrigatória)
const createUserSchema = baseSchema.extend({
  senha: z.string().min(6, { message: "A senha precisa ter no mínimo 6 caracteres." }),
});

// 3. Schema para EDITAR usuário (senha opcional)
const editUserSchema = baseSchema.extend({
  senha: z.string()
    .optional()
    .refine(val => !val || val.length >= 6, {
      message: "Se preenchida, a senha deve ter no mínimo 6 caracteres.",
    }),
});

// 4. Tipo unificado para o formulário. Usamos 'partial' para a senha ser opcional no tipo.
export type DadosDoFormulario = z.infer<typeof baseSchema> & {
  senha?: string;
};

// Props do componente
interface PropsFormDeUsuario {
  initialData?: DadosDoFormulario | null;
  onSave: (data: DadosDoFormulario) => void;
  onCancel: () => void;
}

export const FormularioDoUsuario = ({ initialData, onSave, onCancel }: PropsFormDeUsuario) => {
  const isEditing = !!initialData;

  // 5. Escolha o schema de validação correto ANTES de inicializar o formulário
  const form = useForm<DadosDoFormulario>({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: initialData || {
      usuario: '',
      nome: '',
      email: '',
      status: 'Ativo',
      senha: '',
    },
  });

  // Reseta o formulário se os dados iniciais mudarem (ex: fechar e abrir modal de novo)
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        senha: '', // Sempre limpa a senha por segurança
      });
    } else {
      form.reset({
        usuario: '',
        nome: '',
        email: '',
        status: 'Ativo',
        senha: '',
      });
    }
  }, [initialData, form.reset]);
  
  // Função de wrapper para o onSave, para garantir que os dados estão corretos
  const onSubmit = (data: DadosDoFormulario) => {
    onSave(data);
  };

  return (
    // O erro no 'control' deve desaparecer pois o 'form' agora está corretamente tipado
    <Form {...form}>
      {/* O erro no 'onSave' deve desaparecer pois agora usamos 'onSubmit' */}
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ana.silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ana Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Ex: ana.silva@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder={isEditing ? "Deixe em branco para não alterar" : "********"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" style={{ backgroundColor: '#2c5582' }} className="text-white hover:opacity-90">Salvar Usuário</Button>
        </div>
      </form>
    </Form>
  );
};