import Peer from 'peerjs';

const API_SECURE: boolean = false;
const API_HOST: string = 'localhost';
const API_PORT: number = 3000;

const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

const registerButton = document.getElementById('register-button') as HTMLButtonElement;
const answerButton = document.getElementById('answer-button') as HTMLButtonElement;
const videoMe = document.getElementById('video-me') as HTMLVideoElement;
const videoOther = document.getElementById('video-other') as HTMLVideoElement;

let searchText: string = '';

if (getUserMedia === null) {
  const mediaAlertFail = document.getElementById('media-alert-fail') as HTMLDivElement;

  mediaAlertFail.classList.remove('d-none');
}

const connection = new Peer({ secure: API_SECURE, host: API_HOST, port: API_PORT });
connection.on('open', (id) => {
  const connectionAlertSuccess = document.getElementById('connection-alert-success');
  const connectionAlertSuccessIdLabel = document.getElementById('connection-alert-success-id-label');

  connectionAlertSuccessIdLabel.innerText = id;

  connectionAlertSuccess.classList.remove('d-none');
  registerButton.classList.remove('disabled');
});

connection.on('call', call => {
  answerButton.classList.remove('d-none');

  getUserMedia({video: true, audio: true}, streamLocal => {
    answerButton.classList.add('d-none');

    call.answer(streamLocal);

    videoMe.srcObject = streamLocal;

    call.on('stream', streamRemote => {
      videoOther.srcObject = streamRemote;
});
  }, err => {
    console.log('Failed to get local stream' ,err);
  });
});

connection.on('error', (err) => {
  const connectionAlertFail = document.getElementById('connection-alert-fail');
  connectionAlertFail.classList.remove('d-none');

  const connectionAlertFailRedoButton = document.getElementById('connection-alert-fail-redo-button') as HTMLButtonElement;
  connectionAlertFailRedoButton.addEventListener('click', () => {
    location.reload();
  });
});

registerButton.addEventListener('click', () => {
  if (registerButton.classList.contains('disabled')) {
    return;
  }

  const emailInput = document.getElementById('email-input') as HTMLInputElement;

  const email = emailInput.value;

  fetch(
    `${API_SECURE ? 'https' : 'http'}://${API_HOST}:${API_PORT}/register`,
    { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'email': email, 'connection_id': connection.id }) }
  ).then(response => {
    const registerForm = document.getElementById('register-form') as HTMLDivElement;
    const contentForm = document.getElementById('content-form') as HTMLDivElement;

    registerForm.classList.add('d-none');
    contentForm.classList.remove('d-none');
  });
});
});

