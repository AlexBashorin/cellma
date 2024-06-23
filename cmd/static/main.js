feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

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
    }
};

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
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

const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};

const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    streamStarted = true;
};

getCameraSelection();

document.querySelector(".send-stream").addEventListener("click", async () => {
    await fetch("/sendstream")
        .then(e => e.status)
        .then(d => console.log(d))

    function sendToOneUser(target, msgString) {
        connectionArray.find((conn) => conn.username === target).send(msgString);
    }

    if (sendToClients) {
        const msgString = JSON.stringify(msg);

        if (msg.target && msg.target.length !== 0) {
            sendToOneUser(msg.target, msgString);
        } else {
            for (const connection of connectionArray) {
                connection.send(msgString);
            }
        }
    }
})


// API GET STREAM DATA
const contraints = { video: true }
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(mediaStream => {
        const recorder = new MediaRecorder(mediaStream)

        recorder.ondataavailable = event => {
            // get the Blob from the event
            const blob = event.data
            // and send that blob to the server...
            
            console.log(blob)

            // websocket
            const socket = new WebSocket('ws://localhost:3000/getstream');
            socket.binaryType = 'arraybuffer'
            socket.onopen = function(event) {
                console.log("websocket connection established.");
                socket.send(blob)
            }
            socket.onmessage = function(event) {
                console.log('Messege from server: ', event.data)
                // handle resonse from server
            }
        };

        recorder.start(1000)
    })