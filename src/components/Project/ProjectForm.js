import React from 'react';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { makeStyles, Grid, Button, Paper, TextField, FormControl, FormHelperText, Typography } from '@material-ui/core';
import { Save, Cancel } from '@material-ui/icons';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro'

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

function ProjectForm(props) {
    const classes = useStyles();

    const { register, handleSubmit, errors } = useForm();

    const initialState = {
        id: '',
        name: '',
        description: '',
    }
    let id = '';
    if (props.project !== undefined && props.project !== null) {
        id = props.project.id;
        initialState.id = props.project.id
        initialState.name = props.project.name
        initialState.description = props.project.description
    }

    const [state, setState] = React.useState(initialState);

    function saveState(event) {
        let name = event.target.name;
        let value = event.target.value;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    function handleSave() {
        props.onSave(id, state.name, state.description);
    }

    const history = useHistory()
    function handleAddNew() {
        history.push('/projects/new');
    }

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
                        <Grid item xs={12}>
                            <FormControl variant='outlined' fullWidth className={classes.FormControl} error={errors.name !== undefined}>
                                <TextField
                                    id='name'
                                    name='name'
                                    label='Name'
                                    variant='outlined'
                                    value={state.name}
                                    onChange={saveState}
                                    inputRef={register({ required: true, minLength: 3, maxLength: 100 })}
                                    error={errors.name !== undefined}
                                    inputProps={{ className: classes.FormInput }} />
                                <FormHelperText>
                                    {errors.name && errors.name.type === "required" && <span>This field is required.</span>}
                                    {errors.name && errors.name.type === "minLength" && <span>Field value should have at least 3 characters.</span>}
                                    {errors.name && errors.name.type === "maxLength" && <span>Field value should have at most 100 characters.</span>}
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
                                    inputRef={register({ maxLength: 1000 })}
                                    error={errors.description !== undefined}
                                    inputProps={{ className: classes.FormInput }} />
                                <FormHelperText>
                                    {errors.description && errors.description.type === "maxLength" && <span>Field value should have at most 1000 characters.</span>}
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

ProjectForm.propTypes = {
    project: PropTypes.object,
    formTitle: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export { ProjectForm };

export default createFragmentContainer(
    ProjectForm,
    {
        project: graphql`
        fragment ProjectForm_project on Project {
            id
            name
            description
        }
        `
    }
);