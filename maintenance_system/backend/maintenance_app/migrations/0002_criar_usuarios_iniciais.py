# maintenance_app/migrations/0002_criar_usuarios_iniciais.py

import os
from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_initial_users(apps, schema_editor):
    """
    Cria os grupos e usuários iniciais do sistema.
    """
    User = apps.get_model('maintenance_app', 'CustomUser')
    Group = apps.get_model('auth', 'Group')

    # --- Criação de Grupos ---
    admin_group, _ = Group.objects.get_or_create(name='Administradores')
    maintenance_group, _ = Group.objects.get_or_create(name='Equipe de Manutenção')
    requester_group, _ = Group.objects.get_or_create(name='Solicitantes')

    # --- Obtenção de Senhas das Variáveis de Ambiente ---
    admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'default_password')
    maintenance_password = os.environ.get('DJANGO_MAINTENANCE_PASSWORD', 'default_password')
    requester_password = os.environ.get('DJANGO_REQUESTER_PASSWORD', 'default_password')

    # --- Criação do Superusuário (Admin) ---
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'first_name': 'Administrador',
            'last_name': 'do Sistema',
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True,
            'password': make_password(admin_password)
        }
    )
    if created:
        admin_user.groups.add(admin_group)

    # --- Criação do Usuário de Manutenção ---
    maintenance_user, created = User.objects.get_or_create(
        username='manutencao',
        defaults={
            'first_name': 'Membro',
            'last_name': 'da Manutenção',
            'email': 'manutencao@example.com',
            'is_staff': True,
            'is_superuser': False,
            'password': make_password(maintenance_password)
        }
    )
    if created:
        maintenance_user.groups.add(maintenance_group)

    # --- Criação do Usuário Solicitante ---
    requester_user, created = User.objects.get_or_create(
        username='solicitante',
        defaults={
            'first_name': 'Usuário',
            'last_name': 'Solicitante',
            'email': 'solicitante@example.com',
            'is_staff': False,
            'is_superuser': False,
            'password': make_password(requester_password)
        }
    )
    if created:
        requester_user.groups.add(requester_group)

class Migration(migrations.Migration):

    dependencies = [
        ('maintenance_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_users),
    ]