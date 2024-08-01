feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const remoteClientVideo = document.querySelector('.remoteClientVideo');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause] = buttons;

let websocket;

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

// RUN webRTC
const constraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        },
    },
    audio: true
};
const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};
play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraOptions.value
            }
        };
        startStream(updatedConstraints);
    }
};

const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    streamStarted = true;
};

getCameraSelection();


//@region WEB RTC
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(mediaStream => {
        const recorder = new MediaRecorder(mediaStream)

        recorder.ondataavailable = event => {
            // get the Blob from the event
            const blob = event.data
            // and send that blob to the server...

            console.log("blob.size:" + blob.size)

            // WEBSOCKET
            const websocket = new WebSocket('ws://' + document.location.host + '/getstream');
            websocket.binaryType = 'arraybuffer'
            websocket.onopen = function (event) {
                console.log("websocket connection established.");
                websocket.send(blob)
            }

            // GET RESPONSE FROM WEBSERVER
            websocket.onmessage = function (event) {
                console.log('Messege from server: ', event.data)
                // Handle resonse from server
                // const mediaSource = new MediaSource()
                // const urlMS = URL.createObjectURL(mediaSource)
                // videoAnUser.src = urlMS

                console.log(event.data)
                // let dataType = {
                //     byteLength: 277163,
                //     detached: false,
                //     maxByteLength: 277163,
                //     resizable: false
                // }

                // mediaSource.addEventListener("sourceopen", () => {
                //     const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
                //     sourceBuffer.appendBuffer(event.data);
                //     sourceBuffer.addEventListener("updateend", () => {
                //         mediaSource.endOfStream();
                //         videoAnUser.play();
                //     })
                // })
            }
        };

        recorder.start(1000)
    })


// Установить нвоое соединение
const handleIceCandidate = (e) => {
    console.log('found ice candidate');
    if (e.candidate) {
        websocket.send(JSON.stringify({ iceCandidate: e.candidate }));
    }
};
const handleTrackEvent = (e) => {
    console.log('Recieved tacks');
    remoteClientVideo.srcObject = e.streams[0];
};
function createPeer() {
    console.log("new perr conn")
    const peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    // peer.onnegotiationneeded = handleNegotiationNeeded;
    peer.onicecandidate = handleIceCandidate;
    peer.ontrack = handleTrackEvent;
    return peer
}



//@endregion