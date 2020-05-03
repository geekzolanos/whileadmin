async function getCoursesByUser(firestore, user) {
  const userRef = firestore.collection("users").doc(user.uid);

  const snapshot = await firestore
    .collection("courses")
    .where("teacher", "==", userRef)
    .get();

  const courses = snapshot.docs.map(doc =>
    Object.assign({ id: doc.id, ref: doc.ref }, doc.data())
  );

  return courses;
}

async function getTopicsByCourse(firestore, course) {
  const snapshot = await firestore
    .collection("topics")
    .where("course", "==", course.ref)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc =>
    Object.assign({ id: doc.id, ref: doc.ref }, doc.data())
  );
}

function getStudentsByCourse(course) {
  return Promise.all(
    course.students.map(async ref => {
      const doc = await ref.get();
      return doc.data();
    })
  );
}

async function getProfileByStudents(functions, course) {
  const res = await functions.httpsCallable("usersFromCourse")({
    courseId: course.id
  });

  return res.data.result;
}

function getTopicContent(storage, course, topic) {
  return storage
    .ref(`courses/${course.id}/${topic.id}/content.md`)
    .getDownloadURL()
    .then(fetch)
    .then(res => res.text());
}

function uploadTopicVideoThumb(storage, course, topic, blob) {
  return storage
    .ref(`thumbs/${course.id}/${topic.id}.jpg`)
    .put(blob)
    .then(ss => ss.ref.getDownloadURL());
}

function uploadTopicVideo(storage, course, topic, file) {
  return storage.ref(`courses/${course.id}/${topic.id}/video.mp4`).put(file);
}

function uploadTopicContent(storage, course, topic, content) {
  return storage
    .ref(`courses/${course.id}/${topic.id}/content.md`)
    .put(new Blob([content], { type: "text/markdown" }));
}

function getTopicVideo(storage, course, topic) {
  return storage
    .ref(`courses/${course.id}/${topic.id}/video.mp4`)
    .getDownloadURL();
}

export {
  getCoursesByUser,
  getTopicsByCourse,
  getStudentsByCourse,
  getProfileByStudents,
  getTopicContent,
  uploadTopicVideoThumb,
  uploadTopicVideo,
  uploadTopicContent,
  getTopicVideo
};
