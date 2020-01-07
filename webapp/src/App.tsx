import React from 'react';
import {GlobalContextProvider} from './GlobalContext'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';

import { Container } from 'reactstrap';
import { Header } from './components/Header';

import { NotFound } from './pages/NotFound';
import { Homepage } from './pages/Home';
import { RicettePerTipologia } from './pages/RicettePerTipologia';
import { RicettePerAutore } from './pages/RicettaPerAutore';
import { RicettePerIngrediente } from './pages/RicettePerIngrediente';
import { RicercaAvanzata } from './pages/RicercaAvanzata';




function App() {
  return (

    <Router basename="/webapp">
    <GlobalContextProvider>
      <Container>
        <Header/>
        <Switch>
          <Route exact path="/" component={Homepage}/>
          <Route exact path="/public/login" component={Login}/>
          <Route exact path="/public/ricette/per-tipologia/:id" render={(props) => <RicettePerTipologia id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/per-autore/:id" render={(props) => <RicettePerAutore id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/per-ingrediente/:id" render={(props) => <RicettePerIngrediente id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/ricerca" component={RicercaAvanzata}/>
          <Route path="/404" component={NotFound}/>
          <Route path="*"><Redirect to="/404"/></Route>
        </Switch>
      </Container>
    </GlobalContextProvider>
    </Router>
  );
}

export default App;
