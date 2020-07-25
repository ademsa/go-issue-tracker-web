import React from 'react';
import { makeStyles, Container } from '@material-ui/core';
import Header from './../Header/Header';
import FooterActions from '../Footer/FooterActions';

const useStyles = makeStyles((theme) => ({
    LayoutWrapper: {
        height: '100vh',
    },
    LayoutContainer: {
        marginTop: theme.spacing(3),
    },
}));

export default function Layout({ children }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.LayoutWrapper}>
                <Header />
                <Container maxWidth='md' className={classes.LayoutContainer}>
                    {children}
                </Container>
                <FooterActions />
            </div>
        </React.Fragment>
    );
}
