import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    AutocompleteInput: {
        color: theme.palette.primary.main,
    },
    AutocompleteTag: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }
}));

export default function LabelsAutocomplete(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Autocomplete
                id='labels'
                name='labels'
                multiple
                options={props.options}
                getOptionLabel={(label) => label.name}
                getOptionSelected={(option, value) => {
                    return option.name === value.name
                }}
                value={props.value}
                onChange={props.onChange}
                classes={{
                    input: classes.AutocompleteInput,
                    tag: classes.AutocompleteTag,
                }}
                renderInput={(params) => (<TextField {...params} variant='outlined' />)} />
        </React.Fragment>
    );
}
