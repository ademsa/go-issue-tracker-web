import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    Content: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
}));

export default function NotFound() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.Content}>
                <Grid item xs={12}>
                    <Typography variant='h3' color='primary'>
                        Nothing Found :(
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
