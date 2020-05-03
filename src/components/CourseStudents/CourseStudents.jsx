import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardBody from "../Card/CardHeader";
import MaterialTable from "material-table";

export default function CourseStudents({ students }) {
  const handleSelected = () => {};

  return (
    students && (
      <Grid container>
        <Grid item xs={8}>
          <Card>
            <CardHeader>
              <h4>Listado de estudiantes</h4>
              <p>Gestion de plantel</p>
            </CardHeader>
            <CardBody>
              <MaterialTable
                title=""
                onRowClick={handleSelected}
                options={{ search: true, sorting: true }}
                columns={[
                  { title: "Nombres", field: "displayName" },
                  {
                    title: "Ultimo Ingreso",
                    field: "lastSignInTime",
                    type: "datetime"
                  }
                ]}
                data={students}
                components={{
                  Container: React.Fragment
                }}
              />
            </CardBody>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Paper />
        </Grid>
      </Grid>
    )
  );
}

CourseStudents.propTypes = {
  students: PropTypes.array
};
