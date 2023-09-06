// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyD_3Pf8UxRjY3uyenADRV02lizmmUAH6Rc',
    authDomain: 'mobile-web-f276c.firebaseapp.com',
    projectId: 'mobile-web-f276c',
    storageBucket: 'mobile-web-f276c.appspot.com',
    messagingSenderId: '685642464600',
    appId: '1:685642464600:web:3de9dbed30d231ce9eb92d',
  },

  stripe: {
    publicKey: 'pk_test_51Nl1tWArc6gJSMik0852ZaV67fHCzceJ9bkJTu5flGbJABIGrp3dcWD0ORalbhOTgBPoj8vAHPWRNIVkCT0p97OU00mSoqgsG8',
  },
};
