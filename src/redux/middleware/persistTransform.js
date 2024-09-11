// persistTransform.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'V!N_P0NDI'; // Use a strong key

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const encryptionTransform = {
  in: (inboundState) => {
    //console.log('Encrypting state:', inboundState);
    return {
      ...inboundState,
      auth: encrypt(inboundState.auth), // Encrypt auth state
      plant: encrypt(inboundState.plant), // Encrypt plant state
    };
  },
  out: (outboundState) => {
    //console.log('Decrypting state:', outboundState);
    return {
      ...outboundState,
      auth: decrypt(outboundState.auth), // Decrypt auth state
      plant: decrypt(outboundState.plant), // Decrypt plant state
    };
  },
};

export default encryptionTransform;
