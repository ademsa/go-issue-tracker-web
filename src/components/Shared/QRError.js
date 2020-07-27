import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles, Grid, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon'

const useStyles = makeStyles((theme) => ({
    ContainerGrid: {
        textAlign: 'center',
        marginTop: theme.spacing(3),
    }
}));

function QRError(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.ContainerGrid}>
                <Grid item xs={12}>
                    <Icon color='error' fontSize='large'>error</Icon>
                    <Typography variant='h6' color='error'>{props.error && props.error.message}</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

QRError.propTypes = {
    error: PropTypes.object.isRequired,
}

export default QRError;
