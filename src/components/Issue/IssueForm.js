import React from 'react';
import { useHistory } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form';
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
    Form: {
        width: '100%'
    },
    FormControl: {
        marginBottom: theme.spacing(1),
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

    const { register, handleSubmit, setValue, errors } = useForm({
        defaultValues: {
            status: initialState.status,
            project: initialState.project,
            labels: initialState.labels,
        }
    });

    const [state, setState] = React.useState(initialState);

    function saveState(event, newValue) {
        let name = event.target.name;
        let value = event.target.value;
        if (name === undefined) {
            name = 'labels';
            value = newValue;
        }
        setValue(name, value, { shouldValidate: true });
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

    React.useEffect(() => {
        register({ name: 'status' }, { required: true });
        register({ name: 'project' }, {
            required: true,
            validate: {
                key: value => value !== 0
            }
        });
        register({ name: 'labels' }, {
            required: true,
            validate: {
                size: value => value !== undefined ? value.length > 0 : false
            }
        });
    }, [register]);

    return (
        <React.Fragment>
            <Paper className={classes.Paper} elevation={0}>
                <form onSubmit={handleSubmit(handleSave)} className={classes.Form}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h6' color='primary'>
                                {props.formTitle}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.status !== undefined}>
                                <InputLabel color='primary'>Status</InputLabel>
                                <Select
                                    id='status'
                                    name='status'
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
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.project !== undefined}>
                                <InputLabel color='primary'>Project</InputLabel>
                                <Select
                                    id='project'
                                    name='project'
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
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.title !== undefined}>
                                <TextField
                                    id='title'
                                    name='title'
                                    label='Title'
                                    variant='outlined'
                                    value={state.title}
                                    onChange={saveState}
                                    inputRef={register({ required: true, minLength: 3, maxLength: 500 })}
                                    error={errors.title !== undefined}
                                    inputProps={{ className: classes.FormInput }} />
                                <FormHelperText>
                                    {errors.title && errors.title.type === "required" && <span>This field is required.</span>}
                                    {errors.title && errors.title.type === "minLength" && <span>Field value should have at least 3 characters.</span>}
                                    {errors.title && errors.title.type === "maxLength" && <span>Field value should have at most 500 characters.</span>}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.description !== undefined}>
                                <TextField
                                    id='description'
                                    name='description'
                                    label='Description'
                                    variant='outlined'
                                    multiline
                                    rows={5}
                                    value={state.description}
                                    onChange={saveState}
                                    inputRef={register({ required: true, minLength: 3, maxLength: 1000 })}
                                    error={errors.description !== undefined}
                                    inputProps={{ className: classes.FormInput }} />
                                <FormHelperText>
                                    {errors.description && errors.description.type === "required" && <span>This field is required.</span>}
                                    {errors.description && errors.description.type === "minLength" && <span>Field value should have at least 3 characters.</span>}
                                    {errors.description && errors.description.type === "maxLength" && <span>Field value should have at most 1000 characters.</span>}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.labels !== undefined}>
                                <LabelsAutocomplete
                                    options={props.allLabels || []}
                                    value={state.labels}
                                    onChange={saveState}
                                    error={errors.labels !== undefined} />
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
                                type='submit'
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
                </form>
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
