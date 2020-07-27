import React from 'react';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { makeStyles, Typography, IconButton, Card, CardContent, CardActions, CardHeader, Avatar, CardActionArea } from '@material-ui/core';
import { Edit, DeleteForever, Description } from '@material-ui/icons';
import DeleteConfirmationDialog from './../Shared/DeleteConfirmationDialog';

const useStyles = makeStyles((theme) => ({
    Card: {
        backgroundColor: theme.palette.primary.main,
    },
    CardAvatar: {
        backgroundColor: theme.palette.background.paper,
    },
    CardLabels: {
        marginTop: theme.spacing(1),
    },
    CardLabel: {
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.secondary.main,
        margin: theme.spacing(0.5),
    },
    CardActions: {
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        alignItems: 'center',
    },
    CardActionsEmpty: {
        flexGrow: 1,
    },
}));

function ProjectItem(props) {
    const classes = useStyles();

    const history = useHistory()
    function openProject() {
        history.push('/projects/' + props.id);
    }

    const [state, setState] = React.useState({
        deleteConfirmationUI: false,
    });

    const handleDeleteConfirmation = () => {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: true,
        }));
    }
    function handleDeleteCanceled() {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: false,
        }));
    }
    function handleDelete() {
        setState(prevState => ({
            ...prevState,
            deleteConfirmationUI: false,
        }));
        props.onDelete(props.id)
    }

    return (
        <React.Fragment>
            <Card className={classes.Card}>
                <CardActionArea onClick={openProject}>
                    <CardHeader
                        title={props.name}
                        avatar={<Avatar className={classes.CardAvatar}><Description color='secondary' /></Avatar>} />
                    <CardContent>
                        <Typography>{props.description}&nbsp;</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.CardActions} disableSpacing>
                    <div className={classes.CardActionsEmpty}>&nbsp;</div>
                    <IconButton color='secondary' onClick={openProject}>
                        <Edit />
                    </IconButton>
                    <IconButton color='secondary' onClick={handleDeleteConfirmation}>
                        <DeleteForever />
                    </IconButton>
                </CardActions>
            </Card>
            <DeleteConfirmationDialog
                title={props.name}
                status={state.deleteConfirmationUI}
                onDelete={handleDelete}
                onCancel={handleDeleteCanceled} />
        </React.Fragment>
    );
}

ProjectItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default ProjectItem;
