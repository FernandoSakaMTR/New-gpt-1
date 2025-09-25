from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('operator', 'Operator'),
        ('maintenance', 'Maintenance'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True)

    def __str__(self):
        return self.username

class MaintenanceRequest(models.Model):
    # Informações do Solicitante
    requester_name = models.CharField(max_length=100, verbose_name="Nome do Solicitante")
    request_date = models.DateField(auto_now_add=True, verbose_name="Data da Requisição")
    request_time = models.TimeField(auto_now_add=True, verbose_name="Hora da Requisição")
    department = models.CharField(max_length=100, verbose_name="Setor")

    # Tipo de Manutenção
    MAINTENANCE_TYPE_CHOICES = [
        ("eletrica", "Elétrica"),
        ("mecanica", "Mecânica"),
        ("outros", "Outros"),
    ]
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES, verbose_name="Tipo de Manutenção")

    # Status do Equipamento
    EQUIPMENT_STATUS_CHOICES = [
        ("funcionando", "Funcionando"),
        ("alerta", "Alerta"),
        ("inoperante", "Inoperante"),
    ]
    equipment_status = models.CharField(max_length=20, choices=EQUIPMENT_STATUS_CHOICES, verbose_name="Status do Equipamento")

    # Localização/Identificação do Equipamento
    equipment_location_press = models.CharField(max_length=100, blank=True, null=True, verbose_name="Prensa")
    equipment_location_press_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Nº da Prensa")
    equipment_location_thread = models.CharField(max_length=100, blank=True, null=True, verbose_name="Rosca")
    equipment_location_thread_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Nº da Rosca")
    equipment_location_other = models.CharField(max_length=100, blank=True, null=True, verbose_name="Outros (Localização)")
    equipment_location_other_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Nº (Outros)")

    # Descrição do Problema
    problem_description = models.TextField(verbose_name="O que está ocorrendo?")

    # --- CAMPOS DA MANUTENÇÃO ---
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em Andamento'),
        ('concluido', 'Concluído'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberto', verbose_name="Status")
    technician_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nome do Técnico")
    start_datetime = models.DateTimeField(blank=True, null=True, verbose_name="Início da Execução")
    end_datetime = models.DateTimeField(blank=True, null=True, verbose_name="Fim da Execução")
    resolution_notes = models.TextField(blank=True, null=True, verbose_name="Descrição da Manutenção Executada")


    def __str__(self):
        return f"Requisição {self.id} ({self.status}) - {self.requester_name}"

    class Meta:
        verbose_name = "Requisição de Manutenção"
        verbose_name_plural = "Requisições de Manutenção"

