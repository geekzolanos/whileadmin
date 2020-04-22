import React, { useEffect, useState, useCallback } from "react";
import { useUser, useFirestore } from "reactfire";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Info from "@material-ui/icons/Info";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
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

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const user = useUser();
  const firestore = useFirestore();

  const [profile, setProfile] = useState({});
  const [sb, setSb] = useState();

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then(doc => setProfile(doc.data()));
  }, [user, firestore]);

  const handleChange = useCallback(
    e => {
      const target = e.target;
      setProfile(p => {
        const n = Object.assign({}, p);
        n[target.name] = target.value;
        return n;
      });
    },
    [setProfile]
  );

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      firestore
        .collection("users")
        .doc(user.uid)
        .set(profile, { merge: true })
        .then(() => {
          setSb(true);
          setTimeout(() => setSb(false), 4000);
        });
    },
    [profile]
  );

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>
                  Complete your profile
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Nombres"
                      id="user__name"
                      value={profile.name || ""}
                      onChange={handleChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <TextField
                      fullWidth
                      name="degree"
                      label="Degree"
                      id="user__degree"
                      value={profile.degree || ""}
                      onChange={handleChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email address"
                      id="user__email"
                      value={profile.email || ""}
                      onChange={handleChange}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} style={{ marginTop: 8 }}>
                    <TextField
                      multiline
                      fullWidth
                      name="description"
                      label="Description"
                      id="user__description"
                      value={profile.description || ""}
                      onChange={handleChange}
                      rows={5}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">
                  Update Profile
                </Button>
                <Snackbar
                  place="br"
                  color="success"
                  message="Datos actualizados."
                  open={sb}
                  icon={Info}
                  closeNotification={() => setSb(false)}
                  close
                />
              </CardFooter>
            </Card>
          </form>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={profile.avatarUrl} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{profile.degree}</h6>
              <h4 className={classes.cardTitle}>{profile.name}</h4>
              <p className={classes.description}>{profile.description}</p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
