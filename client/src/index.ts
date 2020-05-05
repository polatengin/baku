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
connection.on('error', (err) => {
  const connectionAlertFail = document.getElementById('connection-alert-fail');
  connectionAlertFail.classList.remove('d-none');

  const connectionAlertFailRedoButton = document.getElementById('connection-alert-fail-redo-button') as HTMLButtonElement;
  connectionAlertFailRedoButton.addEventListener('click', () => {
    location.reload();
  });
});
