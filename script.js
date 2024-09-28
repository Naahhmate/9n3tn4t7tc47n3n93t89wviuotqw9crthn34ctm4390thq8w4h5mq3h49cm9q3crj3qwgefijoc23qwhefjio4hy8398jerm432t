let localStream;
let remoteStream;
let peerConnection;

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

// Event listeners
startCallButton.onclick = startCall;
endCallButton.onclick = endCall;

// Start the call
async function startCall() {
  // Get local video/audio stream
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  // Create peer connection
  peerConnection = new RTCPeerConnection(config);

  // Add local stream to the peer connection
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  // Handle incoming remote stream
  peerConnection.ontrack = event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
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

// End the call
function endCall() {
  peerConnection.close();
  peerConnection = null;

  localStream.getTracks().forEach(track => track.stop());
  remoteStream.getTracks().forEach(track => track.stop());

  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
