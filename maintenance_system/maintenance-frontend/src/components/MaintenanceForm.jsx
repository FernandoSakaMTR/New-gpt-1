import { useState } from 'react'
import api from '../api.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Wrench, Calendar, Clock, User, MapPin, AlertTriangle } from 'lucide-react'

const MaintenanceForm = () => {
  const [formData, setFormData] = useState({
    requester_name: '',
    department: '',
    maintenance_type: '',
    equipment_status: '',
    equipment_location_press: '',
    equipment_location_press_number: '',
    equipment_location_thread: '',
    equipment_location_thread_number: '',
    equipment_location_other: '',
    equipment_location_other_number: '',
    problem_description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (
      !formData.requester_name ||
      !formData.department ||
      !formData.maintenance_type ||
      !formData.equipment_status ||
      !formData.problem_description
    ) {
      setSubmitMessage('Por favor, preencha todos os campos obrigatórios.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // O helper `api` já lança erro se a resposta não for ok e retorna JSON quando dá certo
      await api('/api/maintenance-requests/', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      setSubmitMessage('Requisição de manutenção enviada com sucesso!')
      setFormData({
        requester_name: '',
        department: '',
        maintenance_type: '',
        equipment_status: '',
        equipment_location_press: '',
        equipment_location_press_number: '',
        equipment_location_thread: '',
        equipment_location_thread_number: '',
        equipment_location_other: '',
        equipment_location_other_number: '',
        problem_description: ''
      })
    } catch (error) {
      setSubmitMessage(error.message || 'Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Sistema de Requisição de Manutenção</h1>
          </div>
          <p className="text-lg text-gray-600">Registrar, Monitorar, Priorizar e Controlar as requisições de manutenção</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Pedido de Manutenção
            </CardTitle>
            <CardDescription className="text-blue-100">
              Preencha todos os campos obrigatórios para solicitar uma manutenção
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações do Solicitante */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="requester_name" className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Nome do Solicitante *
                  </Label>
                  <Input
                    id="requester_name"
                    value={formData.requester_name}
                    onChange={(e) => handleInputChange('requester_name', e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Setor *
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tipo de Manutenção */}
              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center">
                  <Wrench className="h-4 w-4 mr-2" />
                  Tipo de Manutenção *
                </Label>
                <RadioGroup
                  value={formData.maintenance_type}
                  onValueChange={(value) => handleInputChange('maintenance_type', value)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="eletrica" id="eletrica" />
                    <Label htmlFor="eletrica">Elétrica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mecanica" id="mecanica" />
                    <Label htmlFor="mecanica">Mecânica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outros" id="outros" />
                    <Label htmlFor="outros">Outros</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Status do Equipamento */}
              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Status do Equipamento *
                </Label>
                <RadioGroup
                  value={formData.equipment_status}
                  onValueChange={(value) => handleInputChange('equipment_status', value)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="funcionando" id="funcionando" />
                    <Label htmlFor="funcionando">Funcionando</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alerta" id="alerta" />
                    <Label htmlFor="alerta">Alerta</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inoperante" id="inoperante" />
                    <Label htmlFor="inoperante">Inoperante</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Localização do Equipamento */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Localização/Identificação do Equipamento</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_press">Prensa</Label>
                    <Input
                      id="equipment_location_press"
                      value={formData.equipment_location_press}
                      onChange={(e) => handleInputChange('equipment_location_press', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_press_number">Nº da Prensa</Label>
                    <Input
                      id="equipment_location_press_number"
                      value={formData.equipment_location_press_number}
                      onChange={(e) => handleInputChange('equipment_location_press_number', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_thread">Rosca</Label>
                    <Input
                      id="equipment_location_thread"
                      value={formData.equipment_location_thread}
                      onChange={(e) => handleInputChange('equipment_location_thread', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_thread_number">Nº da Rosca</Label>
                    <Input
                      id="equipment_location_thread_number"
                      value={formData.equipment_location_thread_number}
                      onChange={(e) => handleInputChange('equipment_location_thread_number', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_other">Outros</Label>
                    <Input
                      id="equipment_location_other"
                      value={formData.equipment_location_other}
                      onChange={(e) => handleInputChange('equipment_location_other', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment_location_other_number">Nº (Outros)</Label>
                    <Input
                      id="equipment_location_other_number"
                      value={formData.equipment_location_other_number}
                      onChange={(e) => handleInputChange('equipment_location_other_number', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Descrição do Problema */}
              <div className="space-y-2">
                <Label htmlFor="problem_description" className="text-sm font-medium">
                  O que está ocorrendo? *
                </Label>
                <Textarea
                  id="problem_description"
                  value={formData.problem_description}
                  onChange={(e) => handleInputChange('problem_description', e.target.value)}
                  required
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva detalhadamente o problema encontrado..."
                />
              </div>

              {/* Botão de Envio */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Wrench className="h-5 w-5 mr-2" />
                      Enviar Requisição
                    </>
                  )}
                </Button>
              </div>

              {/* Mensagem de Status */}
              {submitMessage && (
                <div
                  className={`text-center p-4 rounded-lg ${
                    submitMessage.includes('sucesso')
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MaintenanceForm
