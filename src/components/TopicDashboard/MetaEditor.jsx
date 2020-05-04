import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import Save from "@material-ui/icons/Save";
import PropTypes from "prop-types";
import clsx from "clsx";

function MetaEditor({ classes, topic, submit }) {
  return (
    <Formik initialValues={topic.data()} onSubmit={submit}>
      {({ isSubmitting }) => (
        <Form className={classes.h100}>
          <Card className={clsx(classes.h100, classes.my0)}>
            <CardHeader color="primary">
              <Grid container alignItems="center">
                <Grid item xs={12} md={true}>
                  <h4>Editando Tema</h4>
                </Grid>
                <Grid item md="auto">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                  >
                    Guardar cambios
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody style={{ paddingTop: 28 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Field
                    name="name"
                    fullWidth
                    variant="outlined"
                    component={TextField}
                    label="Titulo"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="description"
                    multiline
                    fullWidth
                    variant="outlined"
                    component={TextField}
                    label="Descripcion"
                    rows={4}
                  />
                </Grid>
              </Grid>
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

MetaEditor.propTypes = {
  topic: PropTypes.any,
  submit: PropTypes.func,
  disabled: PropTypes.bool,
  classes: PropTypes.array
};

export default MetaEditor;
