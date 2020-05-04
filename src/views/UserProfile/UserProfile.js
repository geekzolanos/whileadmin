import React, { useEffect, useState, useCallback } from "react";
import { useUser, useFirestore } from "reactfire";
import PropTypes from "prop-types";
import { string, object, ref } from "yup";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Info from "@material-ui/icons/Info";

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

/**
 * Profile
 */
const ProfileScheme = object().shape({
  name: string().required(),
  degree: string().required(),
  email: string().email(),
  description: string().required(),
  profileUrl: string().url()
});

const ProfileForm = withStyles(styles)(props => (
  <Formik
    enableReinitialize // Change This
    validationSchema={ProfileScheme}
    initialValues={props.profile}
    onSubmit={props.handleSubmit}
  >
    {({ isSubmitting }) => (
      <Form>
        <Card>
          <CardHeader color="primary">
            <h4 className={props.classes.cardTitleWhite}>Edit Profile</h4>
            <p className={props.classes.cardCategoryWhite}>
              Complete your profile
            </p>
          </CardHeader>
          <CardBody>
            <Grid spacing={4} container>
              <Grid item xs={12} sm={12} md={5}>
                <Field
                  component={TextField}
                  fullWidth
                  name="name"
                  label="Nombres"
                  id="user__name"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <Field
                  component={TextField}
                  fullWidth
                  name="degree"
                  label="Degree"
                  id="user__degree"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Field
                  component={TextField}
                  fullWidth
                  name="email"
                  label="Email address"
                  id="user__email"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  fullWidth
                  name="profileUrl"
                  label="Perfil de LinkedIn"
                  id="user__profile"
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 8 }}>
                <Field
                  component={TextField}
                  multiline
                  fullWidth
                  name="description"
                  label="Description"
                  id="user__description"
                  rows={5}
                />
              </Grid>
            </Grid>
          </CardBody>
          <CardFooter>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </Form>
    )}
  </Formik>
));

ProfileForm.propTypes = {
  profile: PropTypes.any,
  handleSubmit: PropTypes.func
};

const UserSchema = object().shape({
  displayName: string().required(),
  password: string()
    .required()
    .min(8),
  password_confirm: string()
    .oneOf([ref("password"), null])
    .required()
});

const UserForm = withStyles(styles)(props => (
  <Formik
    initialValues={{
      displayName: props.user.displayName || "",
      password: "",
      password_confirm: ""
    }}
    validationSchema={UserSchema}
    onSubmit={props.handleSubmit}
  >
    {({ isSubmitting }) => (
      <Form>
        <Card>
          <CardHeader color="primary">
            <h4 className={props.classes.cardTitleWhite}>Edit User</h4>
            <p className={props.classes.cardCategoryWhite}>
              Change your account details
            </p>
          </CardHeader>
          <CardBody>
            <Grid spacing={4} container>
              <Grid item xs={12} sm={12} md={5}>
                <Field
                  component={TextField}
                  fullWidth
                  name="displayName"
                  label="Nombres"
                  id="user__name"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <Field
                  type="password"
                  component={TextField}
                  fullWidth
                  name="password"
                  label="Contraseña"
                  id="user__password"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Field
                  type="password"
                  component={TextField}
                  fullWidth
                  name="password_confirm"
                  label="Confirme Contraseña"
                  id="user__password-confirm"
                />
              </Grid>
            </Grid>
          </CardBody>
          <CardFooter>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              Update User
            </Button>
          </CardFooter>
        </Card>
      </Form>
    )}
  </Formik>
));

UserForm.propTypes = {
  user: PropTypes.any,
  handleSubmit: PropTypes.func
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const user = useUser();
  const firestore = useFirestore();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    degree: "",
    description: "",
    profileUrl: ""
  });

  const [sb, setSb] = useState(false);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => setProfile(doc.data()));
  }, [user, firestore]);

  const onProfileSubmit = useCallback(
    (data, { setSubmitting }) => {
      firestore
        .collection("users")
        .doc(user.uid)
        .update(data)
        .then(() => {
          setSubmitting(false);
          setSb(true);
          setTimeout(() => setSb(false), 4000);
        });
    },
    [profile]
  );

  const onUserSubmit = useCallback(
    ({ displayName, password }, { setSubmitting }) => {
      const req = [];
      if (displayName) req.push(user.updateProfile({ displayName }));
      if (password) req.push(user.updatePassword(password));

      Promise.all(req).then(() => {
        setSubmitting(false);
        setSb(true);
        setTimeout(() => setSb(false), 4000);
      });
    },
    [profile]
  );

  const classes = useStyles();
  return (
    <div>
      <Grid spacing={4} container>
        <Grid item xs={12} sm={12} md={8}>
          <ProfileForm profile={profile} handleSubmit={onProfileSubmit} />
          <UserForm user={user} handleSubmit={onUserSubmit} />

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
        <Grid item xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#" onClick={e => e.preventDefault()}>
                <img src={profile.avatarUrl} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{profile.degree}</h6>
              <h4 className={classes.cardTitle}>{profile.name}</h4>
              <p className={classes.description}>{profile.description}</p>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
