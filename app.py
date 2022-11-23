from flask import Flask, render_template, request, flash

import numpy as np
from keras.models import model_from_json

import os
import librosa as lb
import librosa.display
import matplotlib.pyplot as plt
import cv2

#audio file
file_path = 'app/static/uploads/tmp.wav'

#Image parameters
SIZE = 224
#Mel spectogram parameters
NFFT = 1024 #Tamaño de FFT
HOPL = 320 #Paso entre ventanas
out = 'app/static/uploads/tmp.png'

#File Upload
APP_ROOT = os.path.abspath(os.path.dirname(__file__))

label = ["Acathidops bairdi - Pinzón piquiagudo","Amazona Auropalliata - Nuca amarilla","Amazona Oratrix - Loro rey",
        "Ara ambiguus - Guacamaya verde","Chlorophonia callophrys - Fruterito de cejas doradas",
        "Laterallus Jamaicensis - Burrito cuyano","Myadestes melanops - Solitario carinegro","Pharopmachrus mocinno - Quetzal",
        "Pyrrhura picta eisenmanni - Perico carato","Setophaga chrysoparia - Reinita caridorada","Spizaetus ornatus - Aguilillo adornado"]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

model = None

#Load Model
def load_model():
    json_file = open('app/model/model.json','r')
    model_json = json_file.read()
    json_file.close()
    global model
    model = model_from_json(model_json)
    model.load_weights("app/model/model.h5")

#Predic
def predic(file):
    x = cv2.imread(file, cv2.IMREAD_COLOR)
    x = np.expand_dims(x, axis=0)
    array = model.predict(x)
    resultado = array[0].round()
    respuesta = np.argmax(resultado)

    bird = str(label[int(respuesta)])
    return bird

@app.route("/", methods=['GET'])
def index():
    return render_template("index.html")

@app.route("/save",methods=['GET','POST'])
def save():
    if request.method == "POST":
        file = request.files['audio_data']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        else:
            file.save(file.save(os.path.join(APP_ROOT,app.config['UPLOAD_FOLDER'],"tmp.wav")))
        return render_template('index.html', request="POST")
    else:
         return render_template("index.html")

@app.route("/spec", methods = ['GET','POST'])
def spec():
    if request.method == 'POST':
        #captura y muestreo del audio
        #mag variable para capturar el valor de la amplitud
        #y señal de entrada(amplitud) - sr frecuencia de muestreo(muestra)
        y, sr = librosa.load(file_path, sr=32000)

        #Convert to Mel Spectrogram
        Mel_spect = lb.feature.melspectrogram(y=y,sr=sr, n_fft=NFFT, hop_length=HOPL, win_length=NFFT)

        #Spectogram Mel Log
        Mel_spect_db = lb.power_to_db(Mel_spect, ref=np.max)

        #Save diagram
        fig, ax = plt.subplots()
        p = librosa.display.specshow(Mel_spect_db, ax=ax)
        plt.axis('off')
        fig.savefig(out, bbox_inches='tight', pad_inches = 0)

        imagen = cv2.imread(out)
        imagen = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
        imagen = cv2.resize(imagen,(SIZE,SIZE),interpolation = cv2.INTER_CUBIC)
        imagen = cv2.medianBlur(imagen,1)
        imagen = 255-imagen
        imagen = cv2.cvtColor(imagen, cv2.COLOR_GRAY2BGR)
        cv2.imwrite(out, imagen)

        def pred():
            #Spectogram image route
            bird_name = predic(out)
            return bird_name
        birdID = pred()
        return birdID
    return None

if __name__ == "__main__":
    load_model()
    app.run()
    #app.run(debug= True,port = 5000)

if __name__ == "app":
    load_model()