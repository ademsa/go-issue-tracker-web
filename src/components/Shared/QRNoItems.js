import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    ContainerGrid: {
        textAlign: 'center',
        marginTop: theme.spacing(3),
    }
}));

export default function QRNoItems(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.ContainerGrid}>
                <Grid item xs={12}>
                    <Typography variant='h6' color='primary'>{props.message}</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
