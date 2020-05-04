function getCoursesByUser(firestore, user) {
  const userRef = firestore.collection("users").doc(user.uid);

  return firestore
    .collection("courses")
    .where("teacher", "==", userRef)
    .get();
}

function getTopicsByCourse(firestore, course) {
  return firestore
    .collection("topics")
    .where("course", "==", course.ref)
    .orderBy("createdAt", "desc")
    .get();
}

function getStudentsByCourse(course) {
  return Promise.all(course.data().students.map(ref => ref.get()));
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
