import React from 'react';
import { makeStyles, TextField, Grid, FormControl, FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    FilterContainer: {
        alignItems: 'flex-end',
    },
    FilterInput: {
        color: theme.palette.primary.main,
    },
}));

export default function ProjectsFilter(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        name: ''
    });

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
        props.onChange(value);
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.FilterContainer}>
                <Grid item xs={12}>
                    <FormControl variant='outlined' fullWidth>
                        <TextField
                            id='name'
                            name='name'
                            variant='outlined'
                            value={state.name}
                            onChange={handleChange}
                            inputProps={{ className: classes.FilterInput, value: state.name }} />
                        <FormHelperText>
                            Search by name
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
