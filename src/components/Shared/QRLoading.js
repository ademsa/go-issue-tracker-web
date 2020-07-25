import React from 'react';
import { makeStyles, Grid, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    ContainerGrid: {
        textAlign: 'center',
        marginTop: theme.spacing(3),
    }
}));

export default function QRLoading() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.ContainerGrid}>
                <Grid item xs={12}>
                    <CircularProgress color="primary" />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
