import React, { useEffect } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Dashboard from "components/CourseDashboard/CourseDashboard";
import CourseStudents from "components/CourseStudents/CourseStudents";

const CourseDashboard = ({ course, students, topics, refresh }) => {
  const match = useRouteMatch();

  useEffect(() => {
    refresh({ courseId: match.params.courseId });
  }, [match.params.courseId]);

  const handleCourseUpdate = () =>
    refresh({ force: { courses: { course: true } } });

  return (
    topics && (
      <Switch>
        <Route path={`${match.path}/students`}>
          <CourseStudents students={students} />
        </Route>

        <Route>
          <Dashboard
            course={course}
            topics={topics}
            students={students}
            onUpdate={handleCourseUpdate}
          />
        </Route>
      </Switch>
    )
  );
};

CourseDashboard.propTypes = {
  course: PropTypes.any,
  topics: PropTypes.any,
  students: PropTypes.array,
  refresh: PropTypes.func
};

export default CourseDashboard;
