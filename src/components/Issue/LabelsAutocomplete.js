import React from 'react';
import PropTypes from 'prop-types'
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

function LabelsAutocomplete(props) {
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
                renderInput={(params) => (<TextField {...params} variant='outlined' error={props.error} />)} />
        </React.Fragment>
    );
}

LabelsAutocomplete.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default LabelsAutocomplete;
