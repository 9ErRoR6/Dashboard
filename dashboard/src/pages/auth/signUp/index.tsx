import React, { useState } from "react";
import { Formik, Field } from "formik";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { SignUpSchema } from "../validation";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypeSelector";
import { Navigate } from "react-router-dom";

const Register: React.FC = () => {
    const [role, setRole] = useState("Users");
    const { message } = useTypedSelector((store) => store.userReducer);
    const { IncertUser } = useActions();

    if (message === "User successfully created.") {
        return <Navigate to="/" />;
    }

    const initialValues = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const newUser = {
            Name: data.get("firstName"),
            Surname: data.get("lastName"),
            Email: data.get("email"),
            Role: role,
            Password: data.get("password"),
            confirmPassword: data.get("confirmPassword"),
        };

        IncertUser(newUser);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    return (
        <>
            <Box
                component="main"
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexGrow: 1,
                    minHeight: "100%",
                }}
            >
                <Container maxWidth="sm">
                    <Formik
                        onSubmit={() => { }}
                        initialValues={initialValues}
                        validationSchema={SignUpSchema}
                    >
                        {({ errors, touched, isSubmitting, isValid, dirty }) => (
                            <Box
                                sx={{ my: 3 }}
                                onSubmit={handleSubmit}
                                component="form"
                                noValidate
                            >
                                <Typography color="textPrimary" variant="h4">
                                    Create a new account
                                </Typography>
                                <Typography color="textSecondary" gutterBottom variant="body2">
                                    Use your email to create a new account
                                </Typography>
                                {errors.firstName && touched.firstName ? (
                                    <div style={{ color: "red" }}>{errors.firstName}</div>
                                ) : null}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="First Name"
                                    margin="normal"
                                    name="firstName"
                                    variant="outlined"
                                />
                                {errors.lastName && touched.lastName ? (
                                    <div style={{ color: "red" }}>{errors.lastName}</div>
                                ) : null}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Last Name"
                                    margin="normal"
                                    name="lastName"
                                    variant="outlined"
                                />
                                {errors.email && touched.lastName ? (
                                    <div style={{ color: "red" }}>{errors.email}</div>
                                ) : null}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Email Address"
                                    margin="normal"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                />
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        value={role}
                                        defaultValue={role}
                                        label={role}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Users"}>Users</MenuItem>
                                        <MenuItem value={"Administrators"}>Administrators</MenuItem>
                                    </Select>
                                </FormControl>
                                {errors.password && touched.password ? (
                                    <div style={{ color: "red" }}>{errors.password}</div>
                                ) : null}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Password"
                                    margin="normal"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                />
                                {errors.confirmPassword && touched.confirmPassword ? (
                                    <div style={{ color: "red" }}>{errors.confirmPassword}</div>
                                ) : null}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Confirm password"
                                    margin="normal"
                                    name="confirmPassword"
                                    type="password"
                                    variant="outlined"
                                />
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        display: "flex",
                                        ml: -1,
                                    }}
                                ></Box>
                                <Box sx={{ py: 2 }}>
                                    <Button
                                        disabled={!(isValid && dirty)}
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        {isSubmitting ? "Loading" : "Sign Up Now"}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Formik>
                </Container>
            </Box>
        </>
    );
};
export default Register;