import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import Save from "@material-ui/icons/Save";

const CourseForm = ({ course, onSubmit }) => (
  <Formik initialValues={course.data()} onSubmit={onSubmit}>
    {({ isSubmitting }) => (
      <Form>
        <Card>
          <CardHeader color="primary">
            <Grid container alignItems="center">
              <Grid item xs={12} md={true}>
                <h4>Editar Curso</h4>
                <p>Edite datos del curso</p>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={<Save />}
                  style={{ color: "#fff" }}
                >
                  Guardar Cambios
                </Button>
              </Grid>
            </Grid>
          </CardHeader>

          <CardBody>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <Field
                  component={TextField}
                  name="name"
                  id="course__name"
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Field
                  component={TextField}
                  name="duration"
                  id="course__duration"
                  label="Duracion"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item md={12} style={{ marginTop: 8 }}>
                <Field
                  component={TextField}
                  name="description"
                  id="course__description"
                  label="Descripcion"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                />
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </Form>
    )}
  </Formik>
);

CourseForm.propTypes = {
  course: PropTypes.any,
  onSubmit: PropTypes.func
};

export default CourseForm;
