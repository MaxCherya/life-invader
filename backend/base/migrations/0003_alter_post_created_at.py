# Generated by Django 5.1.6 on 2025-02-16 14:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
