import React, { useEffect, useState } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Dashboard from "components/TopicDashboard/TopicDashboard";
import TopicForm from "components/TopicDashboard/TopicForm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { TopicTypes } from "config/constants";

const TopicDashboard = ({ course, topic, refresh }) => {
  const match = useRouteMatch();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);

  const requestPublish = () => setPublishDialogOpen(true);
  const handleDialogClose = () => setPublishDialogOpen(false);

  const handlePublish = () => {
    handleDialogClose();

    topic.ref.update({ type: TopicTypes.Public }).then(() => {
      handleUpdate();
      setPublishSuccessOpen(true);
    });
  };

  const handleUpdate = () => refresh({ force: { topics: { topic: true } } });

  const props = { course, topic, requestPublish, onUpdate: handleUpdate };

  useEffect(() => {
    refresh({ courseId: match.params.courseId, topicId: match.params.topicId });
  }, [match.params.topicId]);

  return (
    topic && (
      <>
        <Switch>
          <Route path={`${match.path}/edit`}>
            <TopicForm {...props} />
          </Route>
          <Route>
            <Dashboard {...props} />
          </Route>
        </Switch>

        <Dialog open={publishDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Confirmacion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirme. ¿Desea publicar el topico {topic.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handlePublish}>
              Publicar
            </Button>
            <Button onClick={handleDialogClose}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={publishSuccessOpen}
          autoHideDuration={4000}
          onClose={() => setPublishSuccessOpen(false)}
        >
          <Alert variant="filled" severity="success">
            Tema publicado
          </Alert>
        </Snackbar>
      </>
    )
  );
};

TopicDashboard.propTypes = {
  course: PropTypes.any,
  topic: PropTypes.any,
  refresh: PropTypes.func
};

export default TopicDashboard;
