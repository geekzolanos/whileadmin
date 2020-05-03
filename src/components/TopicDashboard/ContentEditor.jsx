import React, { useEffect, useState, useRef } from "react";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import raw from "rehype-raw";
import slug from "remark-slug";
import toc from "remark-toc";
import stringify from "rehype-stringify";
import MdEditor from "react-markdown-editor-lite";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { useStorage } from "reactfire";
import { getTopicContent } from "api";
import "react-markdown-editor-lite/lib/index.css";

const processor = unified()
  .use(markdown, { commonmark: true })
  .use(slug)
  .use(toc)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(raw)
  .use(stringify);

const render = text =>
  new Promise(ret => processor.process(text, (_err, res) => ret(res.contents)));

function ContentEditor({ course, topic, onDirty, onReady }) {
  const storage = useStorage();
  const ref = useRef();
  const [content, setContent] = useState();

  useEffect(() => {
    getTopicContent(storage, course, topic).then(setContent);

    onReady(() => () => {
      onDirty(false);
      return ref.current.getMdValue();
    });
  }, []);

  return (
    <Paper>
      <MdEditor
        ref={ref}
        value={content || ""}
        renderHTML={render}
        onChange={() => onDirty(true)}
      />
    </Paper>
  );
}

ContentEditor.propTypes = {
  course: PropTypes.any,
  topic: PropTypes.any,
  onDirty: PropTypes.func,
  onReady: PropTypes.func
};

export default ContentEditor;
