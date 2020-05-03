import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";

const CourseForm = ({ course, ...props }) => {
  const [state, setState] = useState({});

  const handleSubmit = e => {
    e.preventDefault();
    props.onSubmit(state);
  };

  useEffect(() => {
    setState(course);
  }, [course]);

  const handleChange = useCallback(
    e => {
      const target = e.target;
      setState(p => {
        const n = Object.assign({}, p);
        n[target.name] = target.value;
        return n;
      });
    },
    [setState]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h4>Editar Curso</h4>
          <p>Edite datos del curso</p>
        </CardHeader>

        <CardBody>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <TextField
                name="name"
                id="course__name"
                label="Nombre"
                value={state.name || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                name="duration"
                id="course__duration"
                label="Duracion"
                value={state.duration || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item md={12} style={{ marginTop: 8 }}>
              <TextField
                name="description"
                id="course__description"
                label="Descripcion"
                fullWidth
                multiline
                rows={5}
                value={state.description || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardBody>

        <CardFooter>
          <Button color="primary" type="submit">
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

CourseForm.propTypes = {
  course: PropTypes.any,
  onSubmit: PropTypes.func
};

export default CourseForm;
