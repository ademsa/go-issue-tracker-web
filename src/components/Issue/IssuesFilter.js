import React from 'react';
import { makeStyles, TextField, MenuItem, Select, Grid, FormControl, FormHelperText } from '@material-ui/core';
import LabelsAutocomplete from './LabelsAutocomplete';
import { GetObjIDsAsStringArray } from '../../utils';

const useStyles = makeStyles((theme) => ({
    FilterContainer: {
        alignItems: 'flex-end',
    },
    FilterInput: {
        color: theme.palette.primary.main,
    },
    FilterSelect: {
        color: theme.palette.primary.main,
    }
}));

export default function IssuesFilter(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        title: '',
        project: props.paramProjectId !== undefined ? props.paramProjectId : 0,
        labels: props.paramLabels !== undefined ? props.paramLabels : [],
    });

    function handleChange(event, newValue) {
        let name = event.target.name;
        let value = event.target.value;
        let fwValue = value
        let labels = []
        if (name === undefined) {
            name = 'labels';
            value = newValue
            fwValue = [];
            newValue.map(label => (
                fwValue.push(label.id)
            ))
            fwValue = fwValue.join(',')
        } else {
            labels = GetObjIDsAsStringArray(state.labels)
        }

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "title") {
            props.onChange(fwValue, state.project, labels);
        } else if (name === "project") {
            props.onChange(state.title, fwValue, labels);
        } else {
            props.onChange(state.title, state.project, fwValue);
        }
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.FilterContainer}>
                <Grid item xs={12} md={3}>
                    <FormControl variant='outlined' fullWidth>
                        <TextField
                            id='title'
                            name='title'
                            variant='outlined'
                            value={state.title}
                            onChange={handleChange}
                            inputProps={{ className: classes.FilterInput }} />
                        <FormHelperText>
                            Search by title
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl variant='outlined' fullWidth>
                        <Select
                            id='project'
                            name='project'
                            value={state.project}
                            onChange={handleChange}
                            classes={{ outlined: classes.FilterSelect }}>
                            <MenuItem key={0} value={0}>&nbsp;</MenuItem>
                            {props.projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            Select project to filter issues
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl variant='outlined' fullWidth>
                        <LabelsAutocomplete
                            options={props.labels}
                            value={state.labels}
                            onChange={handleChange} />
                        <FormHelperText>
                            Select labels to filter issues
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
