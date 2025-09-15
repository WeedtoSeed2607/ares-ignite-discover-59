import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.03e1711bfb794d96850823907eb5308d',
  appName: 'ares-ignite-discover',
  webDir: 'dist',
  server: {
    url: 'https://03e1711b-fb79-4d96-8508-23907eb5308d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    }
  }
};

export default config;