const admin = require("firebase-admin");
const serviceAccount = require("../firebase/appclient-9746b-firebase-adminsdk-fbsvc-9ef95251d6.json"); // Đường dẫn tới file json bạn tải về

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
