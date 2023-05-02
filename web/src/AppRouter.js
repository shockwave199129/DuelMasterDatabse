import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import DetailsPage from './DetailsPage';


function AppRouter() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/details/:id" component={DetailsPage} />
        </Switch>
      </BrowserRouter>
    );
  }