async function getCoursesByUser(firestore, user) {
  const userRef = firestore.collection("users").doc(user.uid);

  const snapshot = await firestore
    .collection("courses")
    .where("teacher", "==", userRef)
    .get();

  const courses = snapshot.docs.map(doc =>
    Object.assign({ ref: doc.ref }, doc.data())
  );

  return courses;
}

async function getTopicsByCourse(firestore, course) {
  const snapshot = await firestore
    .collection("topics")
    .where("course", "==", course.ref)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => {
    const data = Object.assign({ id: doc.id }, doc.data());
    return data;
  });
}

function getStudentsByCourse(course) {
  return Promise.all(
    course.students.map(async ref => {
      const doc = await ref.get();
      return doc.data();
    })
  );
}

export { getCoursesByUser, getTopicsByCourse, getStudentsByCourse };
