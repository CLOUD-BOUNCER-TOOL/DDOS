export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// utils/getLocalIP.js
export const getLocalIP = async () => {
    return new Promise((resolve, reject) => {
      const peerConnection = new RTCPeerConnection();
      peerConnection.createDataChannel('');
      
      peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .catch(reject);
      
      peerConnection.onicecandidate = event => {
        if (!event || !event.candidate) return;
        const ipMatch = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(event.candidate.candidate);
        if (ipMatch) {
          resolve(ipMatch[0]);  // This is the local IP
          peerConnection.onicecandidate = null;  // Stop searching once IP is found
        }
      };
    });
  };
  