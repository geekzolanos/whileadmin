import React, { useState } from "react";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardBody from "../Card/CardBody";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TopicPlayer from "./TopicPlayer";
import Backup from "@material-ui/icons/Backup";
import { DropzoneDialog } from "material-ui-dropzone";
import { useStorage } from "reactfire";
import ContentEditor from "./ContentEditor";
import MetaEditor from "./MetaEditor";
import { getThumbFromVideo, createVideoFromFile } from "utils";
import {
  uploadTopicVideoThumb,
  uploadTopicVideo,
  uploadTopicContent
} from "api";

const getProgress = ({ bytesTransferred, totalBytes }) =>
  (bytesTransferred / totalBytes) * 100;

function TopicForm({ classes, course, topic }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [vidSuccessOpen, setVidSuccessOpen] = useState(false);
  const [vidErrOpen, setVidErrOpen] = useState(false);
  const [contentDirty, setContentDirty] = useState(false);
  const [contentFetch, setContentFetch] = useState();
  const storage = useStorage();

  const onVideoSubmit = async files => {
    const file = files[0];

    setUploading(true);
    setDialogOpen(false);

    const req = uploadTopicVideo(storage, course, topic, file);

    req.on("state_changed", snapshot =>
      setUploadProgress(getProgress(snapshot))
    );

    try {
      await req; // Wait until upload finishes

      // Get Thumb
      const $video = await createVideoFromFile(file);
      const thumbUrl = await getThumbFromVideo($video).then(blob =>
        uploadTopicVideoThumb(storage, course, topic, blob)
      );

      // Update meta
      const meta = { thumbUrl, duration: Math.round($video.duration) };
      await topic.ref.set(meta, { merge: true });
      setVidSuccessOpen(true);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setVidErrOpen(true);
    }
  };

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      await topic.ref.set(data, { merge: true });
      if (contentDirty) {
        await uploadTopicContent(storage, course, topic, contentFetch());
      }
      setVidSuccessOpen(true);
      setSubmitting(false);
    } catch (e) {
      console.error(e);
      setVidErrOpen(true);
    }
  };

  const $player = (
    <>
      <h4>Detalles de video</h4>
      <TopicPlayer meta={{ course, topic }} />
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Backup />}
        onClick={() => setDialogOpen(true)}
      >
        Cambiar recurso
      </Button>
    </>
  );

  const $uploadProgress = (
    <>
      <h4>Actualizando recurso</h4>
      <LinearProgress variant="determinate" value={uploadProgress} />
    </>
  );

  const $uploadDialog = (
    <DropzoneDialog
      open={dialogOpen}
      onSave={onVideoSubmit}
      onClose={() => setDialogOpen(false)}
      acceptedFiles={["video/mp4"]}
      maxFileSize={5000000}
      filesLimit={1}
      useChipsForPreview={true}
      showAlerts={false}
      previewText="Seleccionado"
      dialogTitle="Subir recurso"
    />
  );

  const $successAlert = (
    <Snackbar
      open={vidSuccessOpen}
      autoHideDuration={4000}
      onClose={() => setVidSuccessOpen(false)}
      message="Recurso actualizado"
    >
      <Alert variant="filled" severity="success">
        Recurso actualizado
      </Alert>
    </Snackbar>
  );

  const $errorAlert = (
    <Snackbar
      open={vidErrOpen}
      autoHideDuration={4000}
      onClose={() => setVidErrOpen(false)}
      message="Recurso actualizado"
    >
      <Alert variant="filled" severity="error">
        Ha ocurrido un error. Verifique su conexion a internet e intente
        nuevamente.
      </Alert>
    </Snackbar>
  );

  return (
    <>
      <Grid container spacing={4} direction="column" alignItems="stretch">
        <Grid container item spacing={4} alignItems="stretch">
          <Grid item md={8}>
            <MetaEditor classes={classes} topic={topic} submit={onSubmit} />
          </Grid>
          <Grid item md={4}>
            <Card className={classes.my0}>
              <CardBody>{uploading ? $uploadProgress : $player}</CardBody>
            </Card>
          </Grid>
        </Grid>
        <Grid item>
          <Card>
            <CardHeader color="secondary">
              <h4>Contenido del tema</h4>
            </CardHeader>
            <CardBody>
              <ContentEditor
                course={course}
                topic={topic}
                onReady={setContentFetch}
                onDirty={setContentDirty}
              />
            </CardBody>
          </Card>
        </Grid>
      </Grid>

      {($successAlert, $errorAlert, $uploadDialog)}
    </>
  );
}

TopicForm.propTypes = {
  course: PropTypes.any,
  topic: PropTypes.any,
  onSubmit: PropTypes.func,
  classes: PropTypes.any
};

export default withStyles({
  h100: {
    height: "100%"
  },
  my0: {
    marginTop: 0,
    marginBottom: 0
  }
})(TopicForm);
