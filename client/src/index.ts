import Peer from 'peerjs';

const API_SECURE: boolean = false;
const API_HOST: string = 'localhost';
const API_PORT: number = 3000;

const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

const registerButton = document.getElementById('register-button') as HTMLButtonElement;
const answerButton = document.getElementById('answer-button') as HTMLButtonElement;
const hangupButton = document.getElementById('hangup-button') as HTMLButtonElement;
const videoMe = document.getElementById('video-me') as HTMLVideoElement;
const videoOther = document.getElementById('video-other') as HTMLVideoElement;

let call: Peer.MediaConnection;
let streamLocal: MediaStream;
let streamRemote: MediaStream;

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

    let attendeeList: any[];
    response.json().then(_ => {
      attendeeList = _;

      fillAttendeesList(attendeeList);
    });

    const searchAttendeeInput = document.getElementById('search-attendee-input') as HTMLInputElement;
    searchAttendeeInput.addEventListener('keyup', () => {
      searchText = searchAttendeeInput.value;
      fillAttendeesList(attendeeList);
    });

    const refreshButton = document.getElementById('refresh-button') as HTMLButtonElement;
    refreshButton.addEventListener('click', () => {
      fetch(
        `${API_SECURE ? 'https' : 'http'}://${API_HOST}:${API_PORT}/list`, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
      ).then(response => {
        response.json().then(_ => {
          fillAttendeesList(_);
        });

        refreshProgress.style.width = '99%';
      });
    });

    const refreshProgress = document.getElementById('refresh-progress') as HTMLDivElement;
    setInterval(() => {
      let current = parseInt(refreshProgress.style.width.replace('%', ''), 10) - 1;

      if (current === 0) {
        current = 99;

        refreshButton.click();
      }

      refreshProgress.style.width = `${current}%`;
    }, 1000);

  });
});

function fillAttendeesList(attendees: any[]) {
  const attendeeList = document.getElementById('attendee-list');
  attendeeList.innerHTML = '';

  const list = attendees.filter(item => (item.email as string).indexOf(searchText) > -1 || (item.connection_id as string).indexOf(searchText) > -1);

  list.forEach(item => {
    const attendee = document.createElement('div');
    attendee.className='list-group-item d-flex justify-content-between align-items-center';

    const details = document.createElement('p');
    details.className = 'm-0';
    details.innerText = item.email;

    const id = document.createElement('p');
    id.className = 'm-0 text-muted font-weight-light font-italic';
    id.innerHTML = `<small>${item.connection_id}</small>`;

    details.appendChild(id);
    attendee.appendChild(details);

    if (item.connection_id !== connection.id) {
      const button = document.createElement('button');
      button.addEventListener('click', event => {
        makeCall(item.connection_id);
      });
      button.className = 'badge badge-primary badge-pill btn btn-link start-video-call-button';
      button.innerHTML = '<i class="fas fa-video"></i>';
      attendee.appendChild(button);
    }

    attendeeList.appendChild(attendee);
  });
}

function makeCall(id: string) {
  getUserMedia({video: true, audio: true}, streamLocal => {
    const hangupButton = document.getElementById('hangup-button') as HTMLButtonElement;
    hangupButton.classList.remove('d-none');

    videoMe.srcObject = streamLocal;

    const call = connection.call(id, streamLocal);

    call.on('stream', streamRemote => {
      videoOther.srcObject = streamRemote;
    });
  }, err => {
    console.log('Failed to get local stream' ,err);
  });
}
