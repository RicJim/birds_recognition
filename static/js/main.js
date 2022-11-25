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
    li.classList.add('text-center','py-1')
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
            btnrecord.disabled = false;
            birdName = birdID;
            birdIMG(birdName);
        },
    });
}

let image = document.getElementById('imagen');
let imageName = document.getElementById('nombreIMG');

let label = ["Acanthidops bairdi - Pinzón piquiagudo",
            "Amazona Auropalliata - Nuca amarilla",
            "Amazona Oratrix - Loro rey",
            "Ara ambiguus - Guacamaya verde",
            "Chlorophonia callophrys - Fruterito de cejas doradas",
            "Harpia harpyja - Águila arpía",
            "Laterallus Jamaicensis - Burrito cuyano",
            "Myadestes melanops - Solitario carinegro",
            "Pharopmachrus mocinno - Quetzal",
            "Poliocrania exsul - Hormiguero dorsicastaño",
            "Pyrrhura picta eisenmanni - Perico carato",
            "Setophaga chrysoparia - Reinita caridorada",
            "Spizaetus ornatus - Aguilillo adornado"]

function birdIMG(birdName){
    if(birdName == label[0]){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
    } else if(birdName == label[1]){
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
    } else if(birdName == label[2]){
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
    } else if(birdName == label[3]){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
    } else if(birdName == label[4]){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
    } else if(birdName == label[5]){
        image.src = "https://cdn1.matadornetwork.com/blogs/2/2019/01/aguila-arpia.jpg";
    } else if(birdName == label[6]){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
    } else if(birdName == label[7]){
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
    } else if(birdName == label[8]){
        image.src ="https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
    } else if(birdName == label[9]){
        image.src = "https://live.staticflickr.com/65535/48731968408_7bc08ea5b8_b.jpg";
    } else if(birdName == label[10]){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
    } else if(birdName == label[11]){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
    } else{
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
    }
    imageName.innerHTML = birdName;
}

function changeImage(){
    if(image.src.match("47233731")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
        imageName.innerHTML = label[12];
    } else if (image.src.match("326175571")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
        imageName.innerHTML = label[11];
    } else if(image.src.match("Dendroica_chrysoparia1")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
        imageName.innerHTML = label[10];
    } else if(image.src.match("Azuero_Parakeet")){
        image.src = "https://live.staticflickr.com/65535/48731968408_7bc08ea5b8_b.jpg";
        imageName.innerHTML = label[9];
    } else if(image.src.match("48731968408_7bc08ea5b8_b")){
        image.src ="https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
        imageName.innerHTML = label[8];
    } else if(image.src.match("ac218d277b31_alta")){
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
        imageName.innerHTML = label[7];
    } else if(image.src.match("qvY4xqmDRU4EwSJEB2yFxv")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
        imageName.innerHTML = label[6];
    } else if(image.src.match("480560721")){
        image.src = "https://cdn1.matadornetwork.com/blogs/2/2019/01/aguila-arpia.jpg";
        imageName.innerHTML = label[5];
    } else if(image.src.match("aguila-arpia")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
        imageName.innerHTML = label[4];
    } else if(image.src.match("243972201")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
        imageName.innerHTML = label[3];
    } else if(image.src.match("245390831")){
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
        imageName.innerHTML = label[2];
    } else if(image.src.match("Loro-Baceza-Amarilla-Amazona-oratrix")){
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
        imageName.innerHTML = label[1];
    } else {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
        imageName.innerHTML = label[0];
    }
}

function changeImage1(){
    if(image.src.match("326175571")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
        imageName.innerHTML = label[0];
    } else if(image.src.match("47233731")){
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
        imageName.innerHTML = label[1];
    } else if(image.src.match("lora-nuca-amarilla.jpg")){
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
        imageName.innerHTML = label[2];
    } else if(image.src.match("Amazona-oratrix")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
        imageName.innerHTML = label[3];
    } else if(image.src.match("245390831")){
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
        imageName.innerHTML = label[4];
    } else if(image.src.match("243972201")){
        image.src = "https://cdn1.matadornetwork.com/blogs/2/2019/01/aguila-arpia.jpg";
        imageName.innerHTML = label[5];
    } else if(image.src.match("aguila-arpia")) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
        imageName.innerHTML = label[6];
    } else if (image.src.match("480560721")){
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
        imageName.innerHTML = label[7];
    } else if(image.src.match("1bQD5xqHuOnDLBM1XUC")) {
        image.src = "https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
        imageName.innerHTML = label[8];
    } else if(image.src.match("ac218d277b31_alta")){
        image.src = "https://live.staticflickr.com/65535/48731968408_7bc08ea5b8_b.jpg";
        imageName.innerHTML = label[9];
    } else if(image.src.match("48731968408_7bc08ea5b8_b")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
        imageName.innerHTML = label[10];
    } else if(image.src.match("Azuero_Parakeet")){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
        imageName.innerHTML = label[11];
    } else {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
        imageName.innerHTML = label[12];
    }
}
