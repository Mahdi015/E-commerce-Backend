
var admin = require("firebase-admin");
const { model } = require("mongoose");

var serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
module.exports= admin;