# Generated by Django 5.1.5 on 2025-02-08 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crouirouge', '0004_messages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
