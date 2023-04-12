import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    Grid,
    TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Field, Formik } from "formik";
import React from "react";
import { useActions } from "../../hooks/useActions";
import { ChangeProfileSchema } from "../auth/validation";
import { green, pink, red } from "@mui/material/colors";
import { Navigate } from "react-router-dom";

const initialProfileValues = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    OldEmail: "",
    role: "",
};




const EditUser: React.FC = () => {
    const [block, setBlock] = React.useState(true);
    const { EditUser, DeleteUser, BlockUser } = useActions();

    let selectedUser = localStorage.getItem("updateUser");
    if (selectedUser == null) {
        return <Navigate to="/dashboard/users"></Navigate>;
    }

    let updateUser = JSON.parse(selectedUser);

    initialProfileValues.name = updateUser.name;
    initialProfileValues.surname = updateUser.surname;
    initialProfileValues.email = updateUser.email;
    initialProfileValues.phone = updateUser.phoneNumber;



    const handleBlock = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlock(event.target.checked);
    };


    const changeProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);


        const updatedUser = {
            Name: data.get("name"),
            Surname: data.get("surname"),
            Email: data.get("email"),
            OldEmail: updateUser.email,
            PhoneNumber: data.get("phone"),

        };
        EditUser(updatedUser);
    };

    return (
        <>
            <Formik
                validationSchema={ChangeProfileSchema}
                initialValues={initialProfileValues}
                onSubmit={() => { }}
            >
                {({ errors, touched, isValid }) => (
                    <Card>
                        <Box
                            onSubmit={changeProfile}
                            component="form"
                            noValidate
                            style={{ width: "100%" }}
                            sx={{ mt: 1 }}
                        >
                            <CardHeader
                                title="Updating user"
                            ></CardHeader>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label={"First name"}
                                            name="name"
                                            variant="outlined"
                                        />
                                        {errors.name && touched.name ? (
                                            <div style={{ color: "red" }}>{errors.name}</div>
                                        ) : null}
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label={"Second name"}
                                            name="surname"
                                            variant="outlined"
                                        />{" "}
                                        {errors.surname && touched.surname ? (
                                            <div style={{ color: "red" }}>{errors.surname}</div>
                                        ) : null}
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label={"Email"}
                                            name="email"
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
                                            label={"Phone"}
                                            name="phone"
                                            variant="outlined"
                                        />
                                        {errors.phone && touched.phone ? (
                                            <div style={{ color: "red" }}>{errors.email}</div>
                                        ) : null}
                                    </Grid>




                                    <Grid item md={6} xs={12}>

                                        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                                            <Button
                                                disabled={!isValid}
                                                color="primary"
                                                type="submit"
                                                variant="contained"
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Grid>

                                </Grid>

                            </CardContent>
                            <Divider />
                        </Box>





                        <Card>
                            <Box style={{ width: "100%" }} sx={{ mt: 1 }} >
                                <CardHeader
                                    style={{
                                        color: "red",

                                    }}
                                    subheader={"Block or delete user"}
                                    title="Danger zone"
                                ></CardHeader>








                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item md={5} xs={12}></Grid>


                                        <Grid item md={6} xs={12}>



                                            {updateUser.isBlocked ? (
                                                <Button
                                                    onClick={() => {
                                                        BlockUser(updateUser.email);
                                                    }}

                                                    variant="contained"
                                                    color="success"
                                                >
                                                    Unblock User
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        BlockUser(updateUser.email);
                                                    }}

                                                    variant="contained"
                                                    color="warning"
                                                >
                                                    Block User
                                                </Button>
                                            )}


                                            <Button
                                                onClick={() => {
                                                    DeleteUser(updateUser.email);
                                                }}
                                                variant="contained"
                                                color="error"
                                            >
                                                Delete user

                                            </Button>





                                        </Grid>
                                    </Grid>






                                </CardContent>
                            </Box>
                        </Card>


                    </Card>
                )}
            </Formik>

        </>
    );
};
export default EditUser;