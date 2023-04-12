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
import { Navigate, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Label } from "@mui/icons-material";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import { useActions } from "../../hooks/useActions";
interface RouteParams extends Record<string, string | undefined> {
    userid: string;
    token: string;
}

const ConfirmEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { message } = useTypedSelector((store) => store.userReducer);
    const { ConfirmUserEmail } = useActions();

    const handleConfirmEmail = () => {
        const confirmData = {
            Id: searchParams.get("userid"),
            Token: searchParams.get("token"),
        };

        ConfirmUserEmail(confirmData);
    };

    if (
        message === "Email confirmed!" ||
        searchParams.get("userid") == null ||
        searchParams.get("token") == null
    ) {
        return <Navigate to="/"></Navigate>;
    }

    return (
        <>
            <Container maxWidth="sm">
                <Box style={{ marginTop: "100px" }}>
                    <Typography color="textPrimary" variant="h4">
                        Are you want to confirm your email?
                    </Typography>
                    <Button
                        style={{
                            marginTop: "20px",
                            marginLeft: "20%",
                            marginRight: "20%",
                            width: "60%",
                        }}
                        color="primary"
                        variant="contained"
                        onClick={handleConfirmEmail}
                    >
                        Confirm Email
                    </Button>
                </Box>
            </Container>
        </>
    );
};
export default ConfirmEmail;