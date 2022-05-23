const firebase = require("./firebase"); // reference to our db
const firestore = firebase.firestore(); // if using firestore
require("firebase/storage"); // must be required for this to work
const storage = firebase.storage().ref(); // create a reference to storage
global.XMLHttpRequest = require("xhr2"); // must be used to avoid bug
const addFile = async (my_file) => {
	try {
		// Grab the file
		const file = my_file;
		// Format the filename
		if (file === undefined) {
			return null;
		}
		const timestamp = Date.now();
		let name = file.originalname.split(".")[0];
		name = name.replace(".", "");
		const type = file.originalname.split(".")[1];
		const fileName = `${name}_${timestamp}.${type}`;
		// Step 1. Create reference for file name in cloud storage
		const imageRef = storage.child(fileName);
		// Step 2. Upload the file in the bucket storage
		const snapshot = await imageRef.put(file.buffer);
		// Step 3. Grab the public url
		const downloadURL = await snapshot.ref.getDownloadURL();

		return downloadURL;
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports = addFile;
