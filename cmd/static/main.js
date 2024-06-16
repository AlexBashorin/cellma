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

// ----------------- OLD ----------------- //
// let video = document.createElement("video")

// video.setAttribute('playsinline', '');
// video.setAttribute('autoplay', '');
// video.setAttribute('muted', '');
// video.style.width = '200px';
// video.style.height = '200px';


// var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
// var constraints = {
//     audio: false,
//     video: {
//         facingMode: facingMode
//     }
// };

// navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
//     video.srcObject = stream;
// });

// // Display
// // const displayMediaOptions = {
// //     video: {
// //         displaySurface: "browser",
// //     },
// //     audio: {
// //         suppressLocalAudioPlayback: false,
// //     },
// //     preferCurrentTab: false,
// //     selfBrowserSurface: "exclude",
// //     systemAudio: "include",
// //     surfaceSwitching: "include",
// //     monitorTypeSurfaces: "include",
// // };

// // (async function startCapture(displayMediaOptions) {
// //     let captureStream;

// //     try {
// //         captureStream =
// //             await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
// //     } catch (err) {
// //         console.error(`Error: ${err}`);
// //     }
// //     return captureStream;
// // })();
