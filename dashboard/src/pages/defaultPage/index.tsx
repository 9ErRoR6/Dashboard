import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTypedSelector } from "../../hooks/useTypeSelector";


const DefaultPage: React.FC = () => {
    const { user } = useTypedSelector((store) => store.userReducer);
    console.log(user);
    return (<Box sx={{ minWidth: 275 }}>
        <Card variant="outlined" style={{ backgroundColor: "rgb(66, 135, 245)" }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {user.role}
                </Typography>
                <Typography variant="h5" component="div">
                    {user.Name} {user.Surname}
                </Typography>
                <Typography variant="body2">
                    {user.Email}
                </Typography>
                <Typography variant="body2">
                    {user.PhoneNumber}
                </Typography>
            </CardContent>
        </Card>
    </Box >);
};

export default DefaultPage;