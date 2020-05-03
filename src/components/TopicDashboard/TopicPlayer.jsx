import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useStorage } from "reactfire";
import { getTopicVideo } from "api";

function TopicPlayer({ meta }) {
  const [url, setUrl] = useState();
  const storage = useStorage();

  const { course, topic } = meta;

  useEffect(() => {
    getTopicVideo(storage, course, topic).then(setUrl);
  }, [meta]);

  return url ? (
    <video src={url} controls style={{ width: "100%" }}></video>
  ) : (
    <h4>Esperando recurso</h4>
  );
}

TopicPlayer.propTypes = {
  meta: PropTypes.any
};

export default TopicPlayer;
