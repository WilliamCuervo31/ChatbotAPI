import json
import time
from openai import OpenAI
from . import settings
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from core.forms import CustomSigninForm, CustomUserForm
from core.models import Chat, Message

api_chat = OpenAI(
    api_key = "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",
)

def index(request):
    if request.user.is_authenticated:
        user = request.user
    else:
        user = False

    return render(request, 'index.html', {'user': user})

def chat(request):
    if not request.user.is_authenticated:
        return redirect('login')

    chat = Chat.objects.all().filter(user_id=request.user.id)
    if (chat.exists()):
        chat = chat.first()
    else:
        chat = Chat(user_id=request.user.id)
        chat.save()

    messages = Message.objects.all().filter(chat_id=chat.id)
    if not messages.exists():
        messages = False
    else:
        messages.order_by('-date')

    return render(request, 'chat.html', {'user': request.user, 'messages': messages})

@login_required
def chat_message(request):
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'POST':
        chat = get_object_or_404(Chat, user_id=request.user.id)
        data = str(request.body)
        data = data[2:]
        data = data[:-1]
        data_to_dictionary = json.loads(data)
        message = data_to_dictionary["text"]
        message_user = Message(text=message, sender="user", chat_id=chat.id)
        message_user.save()

        iaResponse = api_chat.chat.completions.create(
            messages = [
                {
                    "role": "user",
                    "content": message,
                }
            ],
            model="gpt-3.5-turbo",
            max_tokens=800,
        )

        response = iaResponse.choices[0].message.content
        if response != "Ha ocurrido un error":
            message_ia = Message(text=response, sender="ia", chat_id=chat.id)
            message_ia.save()

        return JsonResponse({'res': f'{response}'})

def chat_message_delete(request):
    if not request.user.is_authenticated:
        return redirect('login')

    chat = get_object_or_404(Chat, user_id=request.user.id)
    messages = Message.objects.all().filter(chat_id=chat.id)

    if not messages.exists():
        return redirect('chat')

    for message in messages:
        message.delete()

    return redirect('chat')

@login_required
def packages(request):
    if not request.user.is_authenticated:
        return redirect('login')

    return render(request, 'packages.html', {})

def signin(request):
    if request.user.is_authenticated:
        return redirect('index')

    form2 = CustomUserForm()
    if request.method == 'POST':
        form = CustomSigninForm(request, data=request.POST)
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            userInf = request.user
            messages.success(request, f'Hola {userInf.first_name}')
            return redirect('index')
        else:
            messages.error(request, 'Datos inválidos')
            return redirect('index')

    form = CustomSigninForm()
    return render(request, 'signin.html', {'form': form, 'form2': form2})

def signout(request):
    logout(request)
    messages.success(request, f'La sesión ha sido cerrada')
    return redirect('index')

def register(request):
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            pass1 = form.cleaned_data['password']
            pass2 = form.cleaned_data['password2']

            if pass1 != pass2:
                #En caso de que no coincidan las contraseñas
                messages.error(request, 'Las contraseñas no coinciden<br>')
            else:
                user = form.save()
                user.set_password(form.cleaned_data["password"])
                user.save()

                login(request, user)
                messages.success(request, f'Cuenta creada con éxito, hola {request.user.first_name}')
                return redirect('index')
        else:
            #Si el formulario no es válido es porque el email ya existe
            messages.error(request, 'El correo puesto ya existe')
    else:
        form = CustomUserForm()

    return redirect('index')