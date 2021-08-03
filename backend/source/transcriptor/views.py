#from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import librosa
from .Transcriptor import Transcriptor
# Create your views here.


@csrf_exempt
def processAudio(request):
    if request.method == 'POST':
        print(request.POST.get("fileName"))
        scoreName=request.POST.get("fileName")
        print(scoreName)
        x, fs = librosa.load(request.FILES["audioFile"], sr=44100, mono=True)
        transcriptor = Transcriptor(x)
        generatedScore = transcriptor.generateScore(scoreName)
        print(generatedScore)
        response = HttpResponse('../download/YourMusicSheet.pdf')
        return response
