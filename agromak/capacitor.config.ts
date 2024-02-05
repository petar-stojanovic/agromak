import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'agromak',
  webDir: 'www/browser',
  plugins: {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "serverClientId": "585229624701-b1pf89nfltssh95m1bhtpbc2n3pi85vk.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;

