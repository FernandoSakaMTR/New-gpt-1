import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wrench, Play, Square, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

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

const MaintenanceExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [technicianName, setTechnicianName] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await api(`/api/maintenance-requests/${id}/`);
        setRequest(data);
        setTechnicianName(data.technician_name || '');
        setResolutionNotes(data.resolution_notes || '');
      } catch (error) {
        setError(error.message || 'Falha ao carregar os detalhes da requisição.');
        console.error('Fetch error:', error);
      }
    };
    fetchRequest();
  }, [id]);

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    let url = `/api/maintenance-requests/${id}/${actionType}/`;
    let body = {};

    if (actionType === 'start') {
      body.technician_name = technicianName;
    } else if (actionType === 'finish') {
      body.resolution_notes = resolutionNotes;
    }

    try {
      const data = await api(url, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setRequest(data); // Atualiza os dados da requisição com a resposta do servidor
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!request) return <div className="text-center p-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/manutencao')} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a Lista
        </Button>

        {/* Detalhes do Solicitante */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Requisição Nº {request.maintenance_number}</CardTitle>
                <CardDescription>Detalhes preenchidos pelo solicitante.</CardDescription>
              </div>
              <Badge
                variant={getStatusVariant(request.status)}
                className="flex items-center text-lg px-4 py-2"
              >
                {getStatusIcon(request.status)}
                <span className="capitalize">{request.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Solicitante:</strong> {request.requester_name}</div>
            <div><strong>Setor:</strong> {request.department}</div>
            <div><strong>Data da Requisição:</strong> {new Date(request.request_date).toLocaleDateString('pt-BR')}</div>
            <div><strong>Hora da Requisição:</strong> {request.request_time}</div>
            <div><strong>Tipo de Manutenção:</strong> <span className="capitalize">{request.maintenance_type}</span></div>
            <div><strong>Status do Equipamento:</strong> <span className="capitalize">{request.equipment_status}</span></div>
            <div className="md:col-span-2">
              <strong>Descrição do Problema:</strong>
              <p className="mt-1 p-2 bg-gray-100 rounded">{request.problem_description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Área de Execução */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-6 w-6 mr-2 text-indigo-600" />
              Área de Execução
            </CardTitle>
            <CardDescription>Preencha os campos e inicie/finalize a manutenção.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="technician_name">Nome do Técnico</Label>
              <Input
                id="technician_name"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                disabled={request.status !== 'aberto'}
              />
            </div>

            {request.start_datetime && (
              <div className="text-sm">
                <strong>Início:</strong> {new Date(request.start_datetime).toLocaleString('pt-BR')}
              </div>
            )}

            {request.end_datetime && (
              <div className="text-sm">
                <strong>Fim:</strong> {new Date(request.end_datetime).toLocaleString('pt-BR')}
              </div>
            )}

            {request.total_time && (
              <div className="text-sm">
                <strong>Tempo Total:</strong> {request.total_time}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="resolution_notes">Descrição da Manutenção Executada</Label>
              <Textarea
                id="resolution_notes"
                rows={5}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                disabled={request.status !== 'em_andamento'}
                placeholder="Descreva o que foi feito para solucionar o problema..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
              {request.status === 'aberto' && (
                <Button
                  onClick={() => handleAction('start')}
                  disabled={isSubmitting || !technicianName}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Manutenção
                </Button>
              )}

              {request.status === 'em_andamento' && (
                <Button
                  onClick={() => handleAction('finish')}
                  disabled={isSubmitting || !resolutionNotes}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Finalizar Manutenção
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceExecution;
