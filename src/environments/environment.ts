// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAh3DbZ0JW6Enbl6yItPOc5BhFHc9cp3Fc",
    authDomain: "expenses-tracker-system.firebaseapp.com",
    databaseURL: "https://expenses-tracker-system-default-rtdb.firebaseio.com",
    projectId: "expenses-tracker-system",
    storageBucket: "expenses-tracker-system.firebasestorage.app",
    messagingSenderId: "873108457705",
    appId: "1:873108457705:web:747ce07393814d110f8878"
  },
  emailjsConfig: {// Login to EmailJs portal and create your own templete to get this!
    serviceId: 'service_dg7xpou', 
    templateId: 'template_9x1nu4g',
    userId: 'xhMeUj522zD_IZymn'
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
