import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const getStatusVariant = (status) => {
  switch (status) {
    case 'concluido':
      return 'success';
    case 'em_andamento':
      return 'warning';
    case 'aberto':
    default:
      return 'destructive';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle className="h-4 w-4 mr-2" />;
    case 'em_andamento':
      return <Clock className="h-4 w-4 mr-2" />;
    case 'aberto':
    default:
      return <AlertTriangle className="h-4 w-4 mr-2" />;
  }
};

const MaintenanceList = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api('/api/maintenance-requests/');
        setRequests(data || []);
      } catch (error) {
        setError(error.message || 'Falha ao carregar as requisições.');
        console.error('Fetch error:', error);
      }
    };

    fetchRequests();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <List className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Painel de Manutenção</h1>
          </div>
          <p className="text-lg text-gray-600">Visualize e gerencie todas as requisições de manutenção.</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Chamados Registrados</CardTitle>
            <CardDescription>Aqui estão todos os chamados de manutenção abertos e concluídos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.maintenance_number}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(req.status)} className="flex items-center">
                          {getStatusIcon(req.status)}
                          <span className="capitalize">{req.status.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{req.requester_name}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{new Date(req.request_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Button onClick={() => navigate(`/manutencao/${req.id}`)} variant="outline" size="sm">
                          <Wrench className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center">
                      Nenhum chamado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceList;
