/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Container, Avatar, Paper, Grid, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { LockOutlined } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LoginForm from "./LoginForm";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundImage: "url(https://source.unsplash.com/featured/?nature)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  grid: {
    height: "100vh"
  },
  paper: {
    padding: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "72%",

    [theme.breakpoints.up("md")]: {
      flexGrow: 0,
      maxWidth: "34%",
      flexBasis: "34%"
    }
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  mAuto: {
    margin: "auto"
  }
}));

const LoginFormStyled = withStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  cedula: {
    "& input": {
      "-moz-appearance": "textfield",
      appearance: "none",
      margin: 0,

      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0
      }
    }
  }
}))(LoginForm);

function LoginComponent({ err, ...props }) {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);

  // Error Handling
  useEffect(() => {
    err && setErrOpen(true);
  }, [err]);
  const handleErrClose = () => setErrOpen(false);

  return (
    <Container className={classes.container}>
      <Grid
        container
        className={classes.grid}
        alignItems="center"
        justify="flex-end"
      >
        <Grid
          item
          xs={12}
          component={Paper}
          className={classes.paper}
          elevation={6}
        >
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingreso al sistema
          </Typography>
          <LoginFormStyled onSubmit={props.handleSubmit} busy={props.busy} />
        </Grid>
      </Grid>
      <Snackbar open={errOpen} autoHideDuration={5000} onClose={handleErrClose}>
        <MuiAlert
          severity="error"
          elevation={6}
          variant="filled"
          onClose={handleErrClose}
        >
          Usuario o Contraseña incorrectos. Por favor, intente nuevamente.
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default LoginComponent;
