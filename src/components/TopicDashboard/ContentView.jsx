import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { useStorage } from "reactfire";
import { getTopicContent } from "api";

const ContentView = ({ meta }) => {
  const [content, setContent] = useState();
  const storage = useStorage();

  const { course, topic } = meta;

  useEffect(() => {
    getTopicContent(storage, course, topic).then(setContent);
  }, [meta]);

  return content ? (
    <ReactMarkdown source={content} />
  ) : (
    <h4>Esperando recurso</h4>
  );
};

ContentView.propTypes = {
  meta: PropTypes.any
};

export default ContentView;
