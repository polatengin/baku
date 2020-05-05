const API_SECURE: boolean = false;
const API_HOST: string = 'localhost';
const API_PORT: number = 3000;
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
const registerButton = document.getElementById('register-button') as HTMLButtonElement;
const answerButton = document.getElementById('answer-button') as HTMLButtonElement;
let searchText: string = '';

if (getUserMedia === null) {
  const mediaAlertFail = document.getElementById('media-alert-fail') as HTMLDivElement;

  mediaAlertFail.classList.remove('d-none');
}

const connection = new Peer({ secure: API_SECURE, host: API_HOST, port: API_PORT });
