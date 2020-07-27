import React from 'react';
import { useHistory } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro'
import PropTypes from 'prop-types'
import { makeStyles, Grid, Button, Paper, MenuItem, InputLabel, Select, TextField, FormControl, FormHelperText, Typography } from '@material-ui/core';
import { Save, Cancel } from '@material-ui/icons';
import LabelsAutocomplete from './LabelsAutocomplete';
import { GetObjIDsAsStringArray } from './../../utils'

const useStyles = makeStyles((theme) => ({
    Paper: {
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        textAlign: 'center',
        padding: theme.spacing(3),
    },
    FormInput: {
        color: theme.palette.primary.main,
    },
    FormButton: {
        marginLeft: theme.spacing(3),
    }
}));

function IssueForm(props) {
    const classes = useStyles();

    const initialState = {
        id: '',
        title: '',
        description: '',
        status: '',
        project: 0,
        labels: [],
    };
    let id = '';
    if (props.issue !== undefined && props.issue !== null) {
        id = props.issue.id;
        initialState.id = props.issue.id
        initialState.title = props.issue.title
        initialState.description = props.issue.description
        initialState.status = props.issue.status
        initialState.project = props.issue.project.id
        initialState.labels = []
        props.issue.labels.edges.map(edge => (
            initialState.labels.push(edge.node)
        ))
    }

    const [state, setState] = React.useState(initialState);

    function saveState(event, newValue) {
        let name = event.target.name;
        let value = event.target.value;
        if (name === undefined) {
            name = 'labels';
            value = newValue;
        }
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    function handleSave() {
        const labels = GetObjIDsAsStringArray(state.labels)
        props.onSave(id, state.title, state.description, state.status, state.project, labels);
    }

    const history = useHistory()
    function handleAddNew() {
        history.push('/issues/new');
    }

    return (
        <React.Fragment>
            <Paper className={classes.Paper} elevation={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h6' color='primary'>
                            {props.formTitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl variant='outlined' fullWidth>
                            <InputLabel color='primary'>Status</InputLabel>
                            <Select
                                id='status'
                                name='status'
                                required
                                label='Status'
                                value={state.status}
                                onChange={saveState}
                                inputProps={{ className: classes.FormInput }}>
                                <MenuItem key={1} value={1}>Status 1</MenuItem>
                                <MenuItem key={2} value={2}>Status 2</MenuItem>
                                <MenuItem key={3} value={3}>Status 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl variant='outlined' fullWidth>
                            <InputLabel color='primary'>Project</InputLabel>
                            <Select
                                id='project'
                                name='project'
                                required
                                disabled={props.issue !== undefined && props.issue !== null}
                                label='Project'
                                value={state.project}
                                onChange={saveState}
                                inputProps={{ className: classes.FormInput }}>
                                <MenuItem key={0} value={0}>&nbsp;</MenuItem>
                                {props.allProjects && props.allProjects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant='outlined' fullWidth>
                            <TextField
                                id='title'
                                name='title'
                                label='Title'
                                variant='outlined'
                                value={state.title}
                                onChange={saveState}
                                required
                                inputProps={{ className: classes.FormInput }} />
                            <FormHelperText>
                                Max. 255 characters
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant='outlined' fullWidth>
                            <TextField
                                id='description'
                                name='description'
                                label='Description'
                                variant='outlined'
                                multiline
                                rows={5}
                                value={state.description}
                                onChange={saveState}
                                inputProps={{ className: classes.FormInput }} />
                            <FormHelperText>
                                Max. 1000 characters
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant='outlined' fullWidth>
                            <LabelsAutocomplete
                                options={props.allLabels || []}
                                value={state.labels}
                                onChange={saveState} />
                            <FormHelperText>
                                Labels
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant='contained'
                            className={classes.FormButton}
                            size='large'
                            onClick={props.onCancel}
                            startIcon={<Cancel />}>
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            className={classes.FormButton}
                            size='large'
                            onClick={handleSave}
                            startIcon={<Save />}>
                            Save
                        </Button>
                        {id !== '' &&
                            <Button
                                variant='contained'
                                className={classes.FormButton}
                                size='large'
                                onClick={handleAddNew}
                                startIcon={<Save />}>
                                Add New
                        </Button>}
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

IssueForm.propTypes = {
    issue: PropTypes.object,
    allProjects: PropTypes.array.isRequired,
    allLabels: PropTypes.array.isRequired,
    formTitle: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export { IssueForm };

export default createFragmentContainer(
    IssueForm,
    {
        issue: graphql`
        fragment IssueForm_issue on Issue {
            id
            title
            description
            status
            project{
                id
            }
            labels(first:1000) @connection(key:"Issues_labels"){
                edges{
                    node{
                        id
                        name
                    }
                }
            }
            createdAt
        }
        `
    }
);
