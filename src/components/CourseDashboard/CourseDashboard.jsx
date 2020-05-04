import React, { useState } from "react";
import {
  useRouteMatch,
  useHistory,
  Link as RouterLink
} from "react-router-dom";

import PropTypes from "prop-types";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import Info from "@material-ui/icons/Info";

import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";
import CardFooter from "../Card/CardFooter.js";
import Snackbar from "../Snackbar/Snackbar";
import MaterialTable from "material-table";

import CourseForm from "./CourseForm";
import { getTopicTypeText } from "utils";

const TopicsList = ({ topics, onSelected }) => {
  const data = topics.docs.map((doc, index) => ({
    ...doc.data(),
    index,
    createdAt: doc
      .get("createdAt")
      .toDate()
      .toLocaleString()
  }));

  const handleSelect = (_e, item) => onSelected(topics.docs[item.index]);

  return (
    <Card>
      <CardHeader color="info">
        <h4>Listado de Temas</h4>
        <p>{topics.docs.length} Temas(s) encontrados</p>
      </CardHeader>
      <CardBody>
        <MaterialTable
          title=""
          onRowClick={handleSelect}
          options={{ search: true, sorting: true }}
          columns={[
            { title: "Titulo", field: "name" },
            {
              title: "Duration (Min)",
              field: "length",
              type: "number"
            },
            {
              title: "Estado",
              field: "type",
              render: ({ type }) => getTopicTypeText(type)
            },
            {
              title: "Fecha Creacion",
              field: "createdAt",
              type: "datetime"
            }
          ]}
          data={data}
          components={{
            Container: React.Fragment
          }}
        />
      </CardBody>
    </Card>
  );
};

TopicsList.propTypes = {
  topics: PropTypes.array,
  onSelected: PropTypes.func
};

const getInitials = name =>
  name
    .split(" ")
    .map(e => e[0].toLocaleUpperCase())
    .join("");

const StudentsGrid = ({ students }) => {
  const match = useRouteMatch();

  return (
    students && (
      <Card>
        <CardHeader color="rose">
          <h4>Estudiantes</h4>
          <p>{students.length} Estudiante(s) inscritos</p>
        </CardHeader>
        <CardBody>
          <Grid container spacing={2}>
            {students.slice(0, 8).map((s, i) => (
              <Grid item md={6} key={i}>
                <Tooltip
                  title={s.displayName}
                  aria-label={s.displayName}
                  placement="top"
                >
                  <Avatar style={{ margin: "auto" }}>
                    {getInitials(s.displayName)}
                  </Avatar>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </CardBody>
        <CardFooter>
          <Link
            component={RouterLink}
            color="inherit"
            underline="none"
            to={`${match.url}/students`}
          >
            Ver todos
          </Link>
        </CardFooter>
      </Card>
    )
  );
};

StudentsGrid.propTypes = {
  students: PropTypes.array
};

export default function CourseDashboard({
  course,
  topics,
  students,
  onUpdate
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const [sb, setSb] = useState();

  const handleTopic = topic => history.push(`${match.url}/topic/${topic.id}`);

  const handleSubmit = (data, { setSubmitting }) =>
    course.ref.update(data).then(() => {
      onUpdate();
      setSubmitting(false);
      setSb(true);
      setTimeout(() => setSb(false), 4000);
    });

  return (
    <Grid container spacing={4}>
      <Grid item md={9}>
        <CourseForm course={course} onSubmit={handleSubmit} />
        <TopicsList topics={topics} onSelected={handleTopic} />
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
  course: PropTypes.any,
  topics: PropTypes.any,
  students: PropTypes.array,
  onUpdate: PropTypes.func
};
