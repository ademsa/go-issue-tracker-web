import React from 'react';
import { makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout'
import Home from './components/Other/Home'
import NotFound from './components/Other/NotFound'
import Issues from './components/Issue/Issues'
import NewIssue from './components/Issue/NewIssue'
import EditIssue from './components/Issue/EditIssue'
import Projects from './components/Project/Projects'
import NewProject from './components/Project/NewProject'
import EditProject from './components/Project/EditProject'
import Labels from './components/Label/Labels'
import NewLabel from './components/Label/NewLabel'
import EditLabel from './components/Label/EditLabel'

const useStyles = makeStyles((theme) => ({
  Wrapper: {
    height: '100vh',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.Wrapper}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Layout>
              <Home />
            </Layout>
          </Route>
          <Route exact path='/issues'>
            <Layout>
              <Issues />
            </Layout>
          </Route>
          <Route exact path='/issues/new'>
            <Layout>
              <NewIssue />
            </Layout>
          </Route>
          <Route path='/issues/:id'>
            <Layout>
              <EditIssue />
            </Layout>
          </Route>
          <Route exact path='/projects'>
            <Layout>
              <Projects />
            </Layout>
          </Route>
          <Route exact path='/projects/new'>
            <Layout>
              <NewProject />
            </Layout>
          </Route>
          <Route path='/projects/:id'>
            <Layout>
              <EditProject />
            </Layout>
          </Route>
          <Route exact path='/labels'>
            <Layout>
              <Labels />
            </Layout>
          </Route>
          <Route exact path='/labels/new'>
            <Layout>
              <NewLabel />
            </Layout>
          </Route>
          <Route path='/labels/:id'>
            <Layout>
              <EditLabel />
            </Layout>
          </Route>
          <Route exact path='/404'>
            <Layout>
              <NotFound />
            </Layout>
          </Route>
          <Route path='*'>
            <Layout>
              <NotFound />
            </Layout>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
