import React, { useCallback, useEffect, useState } from "react";
import { useUser, useFirestore } from "reactfire";
import { getCoursesByUser } from "api";
import MyCoursesList from "components/MyCoursesList/MyCoursesList.js";
import CourseDashboard from "components/CourseDashboard/CourseDashboard.js";

export default function TableList() {
  const user = useUser();
  const firestore = useFirestore();
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState();

  const handleSelected = useCallback(
    key => {
      setCourse(courses[key]);
    },
    [courses]
  );

  useEffect(() => {
    getCoursesByUser(firestore, user).then(setCourses);
  }, []);

  return course ? (
    <CourseDashboard course={course} />
  ) : (
    <MyCoursesList courses={courses} onSelected={handleSelected} />
  );
}
