from . import settings
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect

def index(request):
    return render(request, 'index.html', {})

def chat(request):
    return render(request, 'chat.html', {})