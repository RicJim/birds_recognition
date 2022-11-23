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