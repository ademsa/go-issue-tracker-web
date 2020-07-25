import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, AppBar, Toolbar, Grid, Typography, IconButton, Tooltip } from '@material-ui/core';
import { Home, BugReport, Description, Label } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    HeaderGrid: {
        alignItems: 'center',
    },
    HeaderButtonsLeft: {
        textAlign: 'center',
        '@media (min-width: 992px)': {
            textAlign: 'left',
        }
    },
    HeaderTitle: {
        textAlign: 'center',
    },
    HeaderLink: {
        color: theme.palette.secondary.main,
        textDecoration: 'none',
    },
    HeaderButtonsRight: {
        textAlign: 'center',
        '@media (min-width: 992px)': {
            textAlign: 'right',
        }
    },
}));

export default function Header() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <AppBar position='sticky'>
                <Toolbar>
                    <Grid container spacing={3} className={classes.HeaderGrid}>
                        <Grid item xs={12} md={2} className={classes.HeaderButtonsLeft}>
                            <Link to='/'>
                                <Tooltip title='Home' aria-label='Home'>
                                    <IconButton color='secondary'>
                                        <Home />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Grid>
                        <Grid item xs={12} md={8} className={classes.HeaderTitle}>
                            <Typography variant='h5'>
                                <Link to='/' className={classes.HeaderLink}>
                                    Issue Tracker
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={2} className={classes.HeaderButtonsRight}>
                            <Link to='/issues'>
                                <Tooltip title='Issues' aria-label='Issues'>
                                    <IconButton color='secondary'>
                                        <BugReport />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link to='/projects'>
                                <Tooltip title='Projects' aria-label='Projects'>
                                    <IconButton color='secondary'>
                                        <Description />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link to='/labels'>
                                <Tooltip title='Labels' aria-label='Labels'>
                                    <IconButton color='secondary'>
                                        <Label />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}
