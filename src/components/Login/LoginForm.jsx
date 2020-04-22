import React from 'react';
import { Button, TextField, Box, CircularProgress } from '@material-ui/core';
import Copyright from '../Copyright';

export default ({classes, busy, onSubmit}) => (    
  <form className={classes.form} onSubmit={onSubmit}>
    <TextField
      className={classes.cedula}
      variant="outlined"
      margin="normal"
      required
      fullWidth
      label="Cedula"
      name="cedula"
      type="number"
      autoComplete="username"
      autoFocus
    />
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="password"
      label="Contraseña"
      type="password"
      autoComplete="current-password"
    />

    { busy && <CircularProgress style={{display: 'block', margin: 'auto'}} /> }
    
    <Button
      className={classes.submit}
      type="submit"
      fullWidth
      variant="contained"
      color="primary">
      Entrar
    </Button>
    
    <Box mt={5}>
      <Copyright />
    </Box>
  </form>
);