import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Mail from "@material-ui/icons/Mail";

import { useRouteMatch, Link as RouterLink } from "react-router-dom";

function MetaView({ topic }) {
  const match = useRouteMatch();
  if (!topic) return <CircularProgress />;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
          Informacion
        </Typography>
        <Typography variant="h5" gutterBottom>
          {topic.name}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          align="justify"
          style={{ marginBottom: 12 }}
        >
          {topic.description}
        </Typography>
        <Typography variant="overline" gutterBottom>
          Detalles
        </Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Duracion
              </TableCell>
              <TableCell align="right">{topic.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardActions>
        <Link
          component={RouterLink}
          to={`${match.url}/edit`}
          style={{ margin: "auto" }}
          underline="none"
        >
          <Button size="small" startIcon={<Mail />}>
            Editar Tema
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

MetaView.propTypes = {
  classes: PropTypes.object,
  topic: PropTypes.any
};
export default MetaView;
