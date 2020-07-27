import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    ContainerGrid: {
        textAlign: 'center',
        marginTop: theme.spacing(3),
    }
}));

function QRNoItems(props) {
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

QRNoItems.propTypes = {
    message: PropTypes.string.isRequired,
}

export default QRNoItems;
