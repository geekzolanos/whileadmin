import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Info from "@material-ui/icons/Info";

import Table from "../Table/Table.js";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import Snackbar from "../Snackbar/Snackbar";

import { getTopicsByCourse, getStudentsByCourse } from "api";

import { useFirestore } from "reactfire";

function CourseForm({ course, ...props }) {
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
}

CourseForm.propTypes = {
  course: PropTypes.array,
  onSubmit: PropTypes.func
};

const TopicsList = ({ topics }) => (
  <Card>
    <CardHeader color="primary">
      <h4>Listado de Temas</h4>
      <p>{topics.length} Temas(s) encontrados</p>
    </CardHeader>
    <CardBody>
      <Table
        hover
        tableHeaderColor="primary"
        tableHead={["Titulo", "Duration (Min)", "Fecha Creacion"]}
        tableData={topics.map(c => [
          c.name,
          c.length.toString(),
          c.createdAt.toString()
        ])}
      />
    </CardBody>
  </Card>
);

TopicsList.propTypes = {
  topics: PropTypes.array
};

const getInitials = name =>
  name
    .split(" ")
    .map(e => e[0].toLocaleUpperCase())
    .join("");

const StudentsGrid = ({ students }) => (
  <Card>
    <CardHeader>
      <h4>Estudiantes</h4>
      <p>{students.length} Estudiante(s) inscritos</p>
    </CardHeader>
    <CardBody>
      <Grid container spacing={2}>
        {students.map((s, i) => (
          <Grid item md={6} key={i}>
            <Tooltip title={s.name} aria-label={s.name} placement="top">
              <Avatar style={{ margin: "auto" }}>{getInitials(s.name)}</Avatar>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </CardBody>
  </Card>
);

StudentsGrid.propTypes = {
  students: PropTypes.array
};

export default function CourseDashboard({ course }) {
  const firestore = useFirestore();

  const [topics, setTopics] = useState([]);
  const [students, setStudents] = useState([]);
  const [sb, setSb] = useState();

  useEffect(() => {
    if (course) {
      // Fetch topics
      getTopicsByCourse(firestore, course).then(setTopics);

      // Fetch Students
      getStudentsByCourse(course).then(setStudents);
    }
  }, [course]);

  const handleSubmit = useCallback(data => {
    course.ref.set(data, { merge: true }).then(() => {
      setSb(true);
      setTimeout(() => setSb(false), 4000);
    });
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item md={9}>
        <CourseForm course={course} onSubmit={handleSubmit} />
        <TopicsList topics={topics} />
      </Grid>
      <Grid item md={3}>
        <StudentsGrid students={students} />
      </Grid>

      <Snackbar
        place="br"
        color="success"
        message="Datos actualizados."
        open={sb}
        icon={Info}
        closeNotification={() => setSb(false)}
        close
      />
    </Grid>
  );
}

CourseDashboard.propTypes = {
  course: PropTypes.any
};
