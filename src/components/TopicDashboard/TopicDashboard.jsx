import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";

import MetaView from "./MetaView";
import TopicPlayer from "./TopicPlayer";
import ContentView from "./ContentView";

function TopicDashboard({ course, topic }) {
  const meta = { course, topic };

  return (
    <Grid container spacing={4}>
      <Grid item md={8}>
        <TopicPlayer meta={meta} />
        <ContentView meta={meta} />
      </Grid>
      <Grid item md={4}>
        <MetaView topic={topic} />
      </Grid>
    </Grid>
  );
}

TopicDashboard.propTypes = {
  course: PropTypes.any,
  topic: PropTypes.any
};

export default TopicDashboard;
