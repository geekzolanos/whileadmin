import React, { useEffect } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Dashboard from "components/TopicDashboard/TopicDashboard";
import TopicForm from "components/TopicDashboard/TopicForm";

const TopicDashboard = ({ course, topic, refresh }) => {
  const match = useRouteMatch();

  useEffect(() => {
    refresh({ courseId: match.params.courseId, topicId: match.params.topicId });
  }, [match.params.topicId]);

  return (
    topic && (
      <Switch>
        <Route path={`${match.path}/edit`}>
          <TopicForm course={course} topic={topic} />
        </Route>
        <Route>
          <Dashboard course={course} topic={topic} />
        </Route>
      </Switch>
    )
  );
};

TopicDashboard.propTypes = {
  course: PropTypes.any,
  topic: PropTypes.any,
  refresh: PropTypes.func
};

export default TopicDashboard;
