const admin = require("firebase-admin");
const functions = require("firebase-functions");

const getProfiles = async courseId => {
  // course
  const course = await admin
    .firestore()
    .collection("courses")
    .doc(courseId)
    .get();

  // students
  const refs = course.data().students;
  const profiles = await Promise.all(refs.map(s => admin.auth().getUser(s.id)));

  return profiles.map(p => ({
    displayName: p.displayName,
    photoUrl: p.photo,
    lastSignInTime: p.metadata.lastSignInTime
  }));
};

exports.usersFromCourse = functions.https.onCall(({ courseId }, _ctx) =>
  getProfiles(courseId).then(_res => ({ result: _res }))
);

admin.initializeApp();
