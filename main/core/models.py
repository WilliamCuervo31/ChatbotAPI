from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    user =  models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'chat'
    
    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'
        db_table = 'chat'
        ordering = ['id']

class Message(models.Model):
    date = models.DateTimeField(auto_now_add=True, null=False, verbose_name='Fecha y hora')
    sender = models.CharField(max_length=20, null=False, verbose_name='Emisor')
    text = models.TextField(null=False, verbose_name='Texto')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.chat.user.first_name}'
    
    class Meta:
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'
        db_table = 'mensaje'
        ordering = ['id']