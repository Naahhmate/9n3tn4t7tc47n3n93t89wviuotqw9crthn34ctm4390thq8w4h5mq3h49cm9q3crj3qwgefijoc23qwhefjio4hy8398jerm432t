let localStream;
let remoteStream;
let peerConnection;
let audioContext;
let analyser;
let dataArray;
let isSpeaking = false;
let speakingThreshold = 0.02;

// WebRTC configuration for STUN servers (public)
const config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
};

// HTML Elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const muteButton = document.getElementById('muteButton');
const connectionStatus = document.getElementById('connectionStatus');

let isMuted = false;

// Event listeners
startCallButton.onclick = startCall;
endCallButton.onclick = endCall;
muteButton.onclick = toggleMute;

// Start the call
async function startCall() {
  // Get local video/audio stream
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  // Setup voice activity detection (VAD)
  setupVoiceDetection(localStream);

  // Create peer connection
  peerConnection = new RTCPeerConnection(config);

  // Add local stream to the peer connection
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  // Handle incoming remote stream
  peerConnection.ontrack = event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
      connectionStatus.textContent = "Connected";
    }
    remoteStream.addTrack(event.track);
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // Send candidate to the remote peer via signaling server (not included in this client-side example)
      console.log('New ICE candidate:', event.candidate);
    }
  };

  // Create offer and set local description
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  // Send the offer to the remote peer via signaling server (not included in this client-side example)
  console.log('Offer:', offer);
}

// Setup voice activity detection
function setupVoiceDetection(stream) {
  audioContext = new AudioContext();
  const audioSource = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  audioSource.connect(analyser);
  
  detectSpeaking();
}

// Detect if the user is speaking
function detectSpeaking() {
  requestAnimationFrame(detectSpeaking);
  analyser.getByteFrequencyData(dataArray);

  const sum = dataArray.reduce((a, b) => a + b, 0);
  const average = sum / dataArray.length;
  const normalizedAverage = average / 255;

  if (normalizedAverage > speakingThreshold) {
    if (!isSpeaking) {
      localVideo.style.border = '3px solid green'; // User starts speaking
      isSpeaking = true;
    }
  } else {
    if (isSpeaking) {
      localVideo.style.border = 'none'; // User stops speaking
      isSpeaking = false;
    }
  }
}

// Toggle mute/unmute for the local user
function toggleMute() {
  isMuted = !isMuted;
  localStream.getAudioTracks().forEach(track => {
    track.enabled = !isMuted;
  });

  muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
  localVideo.style.opacity = isMuted ? 0.5 : 1;  // Visual indicator of muting
}

// End the call
function endCall() {
  peerConnection.close();
  peerConnection = null;

  localStream.getTracks().forEach(track => track.stop());
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
  connectionStatus.textContent = "Disconnected";
}
