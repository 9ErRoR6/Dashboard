import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import { useActions } from "../../hooks/useActions";
import { ChangePasswordSchema, ChangeProfileSchema } from ".././auth/validation";
import { Field, Formik } from "formik";
import { Navigate } from "react-router-dom";

const changePasswordValues = {
  oldPassword: "",
  currentPassword: "",
  confirmPassword: "",
};

const changeProfileValues = {
  name: "",
  surname: "",
  email: "",
  phone: "",
};

const Profile: React.FC<any> = () => {
  const { user } = useTypedSelector((store) => store.userReducer);
  const { UpdateUserPrifile } = useActions();
  const [isRedirect, setRedirect]: any = useState(false);
  const { LogOut } = useActions();

  const Logout = () => {
    LogOut(user.Id);
    setRedirect(true);
  };
  if (isRedirect) {
    return <Navigate to="/" />;
  }
  //ChangePassword,

  changeProfileValues.name = user.Name;
  changeProfileValues.surname = user.Surname;
  changeProfileValues.email = user.Email;
  changeProfileValues.phone = user.PhoneNumber;

  const changePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const OldPassword = data.get("oldPassword");
    const NewPassword = data.get("currentPassword");
    const ConfirmPassword = data.get("confirmPassword");
    const updatedPassword = {
      UserId: user.Id,
      OldPassword,
      NewPassword,
      ConfirmPassword,
    };
    //ChangePassword(updatedPassword);
  };

  const changeProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const surname = data.get("surname");
    const email = data.get("email");
    const phone = data.get("phone");
    const updatedUser = {
      Id: user.Id,
      name,
      surname,
      email,
      phone,
    };
    UpdateUserPrifile(updatedUser);
    Logout();
  };

  return (
    <>
      <Formik
        initialValues={changeProfileValues}
        onSubmit={() => { }}
        validationSchema={ChangeProfileSchema}
      >
        {({ errors, touched, isSubmitting, isValid }) => (
          <Card>
            <Box
              onSubmit={changeProfileSubmit}
              component="form"
              noValidate
              style={{ width: "100%" }}
              sx={{ mt: 1 }}
            >
              <CardHeader
                title="Profile"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label={"First Name"}
                      name="name"
                      variant="outlined"
                      required
                    />
                    {errors.name && touched.name ? (
                      <div style={{ color: "red" }}>{errors.name}</div>
                    ) : null}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Last name"
                      name="surname"
                      required
                      variant="outlined"
                    />
                    {errors.surname && touched.surname ? (
                      <div style={{ color: "red" }}>{errors.surname}</div>
                    ) : null}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email Address"
                      name="email"
                      required
                      variant="outlined"
                    />
                    {errors.email && touched.email ? (
                      <div style={{ color: "red" }}>{errors.email}</div>
                    ) : null}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      required
                      variant="outlined"
                    />
                    {errors.phone && touched.phone ? (
                      <div style={{ color: "red" }}>{errors.email}</div>
                    ) : null}
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button
                  color="primary"
                  disabled={!isValid}
                  type="submit"
                  variant="contained"
                >
                  {isSubmitting ? "Loading" : " Save details"}
                </Button>
              </Box>
            </Box>
          </Card>
        )}
      </Formik>
    </>
  );
};
export default Profile;