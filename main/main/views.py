import json
import time
from openai import OpenAI
from . import settings
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect

api_chat = OpenAI(
    api_key = "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",
)

def index(request):
    return render(request, 'index.html', {})

def chat(request):
    return render(request, 'chat.html', {})

def chat_message(request):
     if request.method == 'POST':
        data = str(request.body)
        data = data[2:]
        data = data[:-1]
        data_to_dictionary = json.loads(data)
        message = data_to_dictionary["text"]

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

        return JsonResponse({'res': f'{response}'})

def packages(request):
    return render(request, 'packages.html', {})

def header(request):
    return render(request, 'header.html', {})