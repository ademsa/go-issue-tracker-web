import React from 'react';
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

export default function LabelItem(props) {
    const classes = useStyles();

    const { id, name, colorHexCode } = props;

    const history = useHistory()
    function openLabel() {
        history.push('/labels/' + id);
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
        props.onDelete(id)
    }

    return (
        <React.Fragment>
            <Card className={classes.Card}>
                <CardActionArea onClick={openLabel}>
                    <CardHeader
                        title={name}
                        avatar={<Avatar className={classes.CardAvatar}><Description color='secondary' /></Avatar>} />
                    <CardContent>
                        <Typography>{colorHexCode}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.CardActions} disableSpacing>
                    <div className={classes.CardActionsEmpty}>&nbsp;</div>
                    <IconButton color='secondary' onClick={openLabel}>
                        <Edit />
                    </IconButton>
                    <IconButton color='secondary' onClick={handleDeleteConfirmation}>
                        <DeleteForever />
                    </IconButton>
                </CardActions>
            </Card>
            <DeleteConfirmationDialog
                title={name}
                status={state.deleteConfirmationUI}
                onDelete={handleDelete}
                onCancel={handleDeleteCanceled} />
        </React.Fragment>
    );
}