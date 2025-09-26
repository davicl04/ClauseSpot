import { RowTabelaUsuario} from './RowTabelaUsuario';

// Dados de exemplo. No futuro, isso virá de uma API.
const users = [
  { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com', role: 'Admin', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'Editor', status: 'Ativo' },
  { id: 3, name: 'Carla Dias', email: 'carla.dias@example.com', role: 'Visualizador', status: 'Inativo' },
  { id: 4, name: 'Daniel Martins', email: 'daniel.martins@example.com', role: 'Editor', status: 'Ativo' },
];

export const TabelaUsuario = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Nome</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">E-mail</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Cargo</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {users.map(user => (
            <RowTabelaUsuario key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
