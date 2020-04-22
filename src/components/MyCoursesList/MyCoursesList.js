import React, { useEffect, useState } from "react";
import { useUser, useFirestore } from "reactfire";
import { getCoursesByUser } from "api";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Table from "../Table/Table.js";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import CardBody from "../Card/CardBody.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function MyCoursesList({ onSelected }) {
  const user = useUser();
  const firestore = useFirestore();
  const [courses, setCourses] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getCoursesByUser(firestore, user).then(setCourses);
  }, []);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Listado de cursos</h4>
        <p className={classes.cardCategoryWhite}>
          {courses.length} Curso(s) encontrados
        </p>
      </CardHeader>
      <CardBody>
        <Table
          hover
          tableHeaderColor="primary"
          onSelected={onSelected}
          tableHead={["Titulo", "Duration (Min)", "Estudiantes"]}
          tableData={courses.map(c => [c.name, c.duration, c.students.length])}
        />
      </CardBody>
    </Card>
  );
}

MyCoursesList.propTypes = {
  onSelected: PropTypes.func
};
