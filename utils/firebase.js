const firebaseConfig = {
	apiKey: "AIzaSyDlo3i5dQdvYYTKbthlU2xheqckn0E0NH8",
	authDomain: "pwpgirls-df33a.firebaseapp.com",
	projectId: "pwpgirls-df33a",
	storageBucket: "pwpgirls-df33a.appspot.com",
	messagingSenderId: "445271766618",
	appId: "1:445271766618:web:97d06afc57ddaf42db0a63",
};
// Requiring firebase (as our db)
const _firebase = require("firebase");

module.exports = _firebase.initializeApp(firebaseConfig);
