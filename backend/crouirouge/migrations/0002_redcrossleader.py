# Generated by Django 5.1.5 on 2025-02-06 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crouirouge', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RedcrossLeader',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('leader_image', models.ImageField(blank=True, null=True, upload_to='leaders_image')),
                ('start_year', models.DateField()),
                ('end_year', models.DateField()),
            ],
        ),
    ]
