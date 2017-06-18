from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from chat_app.models import Chat
from ChatApp import settings
from .forms import UserForm


def index(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.set_password(user.password)
            user.save()
            login(request,user)
            print('>>>>>>>>form Valid')
            return HttpResponseRedirect('/home/')
        else:
            print('>>>>>form not valid')
    else:
        form = UserForm()

    return render(request,'index.html',{'form': form,'user': request.user})


def Login(request):
    user = None
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        print(username)
        print(password)
        user = authenticate(username = username, password = password)
    if user is not None:
        if user.is_active:
            print('>>>>>>>>>>>User Active')
            login(request,user)
            return HttpResponseRedirect('/home/')
        else:
            return HttpResponse('User is not active')
    else:
        print('>>>>>>>>>>>User Not There')

    return render(request,'login.html',{})


@login_required
def Logout(request):
    logout(request)
    return HttpResponseRedirect('/index/')


@login_required
def Home(request):
    return render(request,'home.html')


@login_required
def Post(request):
    data = request.POST.get('mssg',None)
    if data:
        data = '[' + request.user.username + ']' + ': ' + data
        c = Chat(user=request.user, message=data)
        c.save()
        return JsonResponse({'mssg': data, 'user': c.user.username})
    else:
        return HttpResponse('Request must be a POST')


@login_required
def Message(request):
    c = Chat.objects.all()
    return render(request,'messages.html',{'chat':c})

