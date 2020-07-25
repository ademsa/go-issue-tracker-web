import React from 'react';
import { useHistory } from 'react-router-dom';
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
    FormInput: {
        color: theme.palette.primary.main,
    },
    FormButton: {
        marginLeft: theme.spacing(3),
    }
}));

export function ProjectForm(props) {
    const classes = useStyles();

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
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h6' color='primary'>
                            {props.formTitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant='outlined' fullWidth>
                            <TextField
                                id='name'
                                name='name'
                                label='Name'
                                variant='outlined'
                                value={state.name}
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