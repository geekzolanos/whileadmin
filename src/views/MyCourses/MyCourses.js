import React from "react";
import { useUser, useFirestore, useFunctions } from "reactfire";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import CoursesList from "components/CoursesList/CoursesList";
import CourseDashboard from "./CourseDashboard";
import TopicDashboard from "./TopicDashboard";
import CourseProvider from "components/CourseProvider/CourseProvider";

export default function MyCourses() {
  const match = useRouteMatch();

  const props = {
    firestore: useFirestore(),
    functions: useFunctions(),
    user: useUser()
  };

  return (
    <CourseProvider {...props}>
      {({ course, courses, topic, students, topics, refresh }) => (
        <Switch>
          <Route path={`${match.path}/:courseId/topic/:topicId`}>
            <TopicDashboard course={course} topic={topic} refresh={refresh} />
          </Route>

          <Route path={`${match.path}/:courseId`}>
            <CourseDashboard
              course={course}
              students={students}
              topics={topics}
              refresh={refresh}
            />
          </Route>

          <Route>
            <CoursesList courses={courses} />
          </Route>
        </Switch>
      )}
    </CourseProvider>
  );
}
