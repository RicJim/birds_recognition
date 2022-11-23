URL = window.URL || window.webkitURL;

let gumStream;
let rec;
let input;

let AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext

let btnrecord = document.getElementById("record");
let btnpredic = document.getElementById("predic");

btnrecord.addEventListener("click", recording);
btnpredic.addEventListener("click", prediction);

function recording(){
    const constraints = { audio:true, video:false }
    btnrecord.disabled = true;
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream){
            audioContext = new AudioContext();

            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            rec = new Recorder(input,{ numChannels:1 })

            rec.record();
            setTimeout(()=>{
                btnrecord.disabled = false;
                btnpredic.disabled = false;
                rec.stop();
                gumStream.getAudioTracks()[0].stop();
                rec.exportWAV(createDownloadLink);
            }, 10000);
        })
        .catch(function(err){
            btnrecord.disabled = false;
            console.log(err)
        });
}

function createDownloadLink(blob){
    let url = URL.createObjectURL(blob);
    let au = document.createElement('audio');
    let li = document.createElement('li');
    let link = document.createElement('a');

    var filename = new Date().toISOString();
    au.controls = true;
    au.src = url;

    link.href = url;
    link.download = filename+".wav";
    link.innerHTML = "Save File";

    li.appendChild(au);
    //li.appendChild(document.createTextNode(filename+".wav"))
    li.appendChild(link);

    var up = document.createElement('a');
    //up.href="#";
    //up.innerHTML = "Upload";
    up.hidden = true;

    up.addEventListener("click",function(event){
        var xhr=new XMLHttpRequest();
        xhr.onload=function(e){
            if(this.readyState === 4){
                console.log("Server returned: ",e.target.responseText);
            }
        };
        let fd = new FormData();
        fd.append("audio_data",blob,filename);
        xhr.open("POST","/save",true);
        xhr.send(fd);
    })
    up.click()
    li.appendChild(document.createTextNode(" "))
    //li.appendChild(up)
    recordingsList.appendChild(li);
}

function prediction(){
    btnpredic.disabled = true;
    $.ajax({
        type: 'POST',
        url: '/spec',
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (birdID) {
            //Get and display the result
            $('#bird_name').fadeIn(600);
            $('#bird_name').text(' Ave Identificada:  ' + birdID);
        },
    });
}

let image = document.getElementById('imagen');
let imageName = document.getElementById('nombreIMG');

function changeImage(){
    if(image.src.match("Dendroica_chrysoparia1")){
        image.src ="https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
        imageName.innerHTML = "Quetzal";
    } else if(image.src.match("ratio_default_0")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
        imageName.innerHTML = "Aguilillo adornado";
    } else if(image.src.match("326175571")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
        imageName.innerHTML = "Perico carato";
    } else if(image.src.match("Azuero_Parakeet")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
        imageName.innerHTML = "Fruterito de cejas doradas";
    } else if(image.src.match("243972201")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
        imageName.innerHTML = "Guacamaya verde";
    } else if(image.src.match("245390831")){
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
        imageName.innerHTML = "Loro Rey";
    } else if(image.src.match("Amazona-oratrix")){
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
        imageName.innerHTML = "Nuca Amarilla";
    } else if(image.src.match("lora-nuca-amarilla")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
        imageName.innerHTML = "Pinzón piquiagudo";
    } else if(image.src.match("47233731")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
        imageName.innerHTML = "Burrito cuyano";
    } else if(image.src.match("480560721")){
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
        imageName.innerHTML = "Solitario Carinegro"
    } else {
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
        imageName.innerHTML = "Reinita caridorada";
    }
}

function changeImage1(){
    if(image.src.match("ratio_default_0")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
        imageName.innerHTML = "Reinita caridorada";
    } else if (image.src.match("Dendroica_chrysoparia1")){
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
        imageName.innerHTML = "Solitario Carinegro"
    } else if(image.src.match("d7FLvfHHlVscO")) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
        imageName.innerHTML = "Burrito cuyano";
    } else if(image.src.match("480560721")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
        imageName.innerHTML = "Pinzón piquiagudo";
    } else if(image.src.match("47233731")){
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
        imageName.innerHTML = "Nuca Amarilla";
    } else if(image.src.match("lora-nuca-amarilla.jpg")){
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
        imageName.innerHTML = "Loro Rey";
    } else if(image.src.match("Amazona-oratrix")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
        imageName.innerHTML = "Guacamaya verde";
    } else if(image.src.match("245390831")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
        imageName.innerHTML = "Fruterito de cejas doradas";
    } else if(image.src.match("243972201")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
        imageName.innerHTML = "Perico carato";
    } else if(image.src.match("Azuero_Parakeet")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
        imageName.innerHTML = "Aguilillo adornado";
    } else {
        image.src = "https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
        imageName.innerHTML = "Quetzal";
    }
}