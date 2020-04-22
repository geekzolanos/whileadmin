/* eslint-disable react/display-name */
import React from "react";
import { Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// eslint-disable-next-line react/prop-types
export default ({ className }) => (
  <Typography
    variant="body2"
    color="textSecondary"
    align="center"
    className={className}
  >
    {"Copyright © "}
    <Link color="inherit" href="https://geekzolanos.github.io/" target="blank">
      Geekzolanos
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);
