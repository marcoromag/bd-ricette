import React from 'react';
import {GlobalContextProvider, useLogin} from './GlobalContext'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute';
import { Container } from 'reactstrap';
import { NotFound } from './pages/NotFound';
import { Homepage } from './pages/Home';
import { RicettePerTipologia } from './pages/RicettePerTipologia';
import { RicettePerAutore } from './pages/RicettaPerAutore';
import { RicettePerIngrediente } from './pages/RicettePerIngrediente';
import { RicercaAvanzata } from './pages/RicercaAvanzata';
import { CreaRicetta } from './pages/CreaRicetta';
import { LoginRedattore } from './pages/LoginRedattore';
import { HomepageRedattore } from './pages/HomepageRedattore';
import { ValidazioneRicetta } from './pages/ValidazioneRicetta';
import { HomepageCapoRedattore } from './pages/HomepageCaporedattore';
import { ApprovazioneRicetta } from './pages/ApprovazioneRicetta';
import { hot } from 'react-hot-loader';
import { Registrazione } from './pages/Registrazione';
import { GestioneUtenze } from './pages/GestioneUtenze';
import { ConteggioApprovazioniPerRedattore } from './pages/ConteggioApprovazioniPerRedattore';
import { ReportApprovazioniPerRedattore } from './pages/ReportApprovazioniPerRedattore';
import { VisualizzaRicetta } from './pages/VisualizzaRicetta';

const RouteRedazione: React.FC = () => {
  const [login] = useLogin();
  return (login.user!.tipo) === 'redattore' 
  ? <Redirect to="/redazione/redattore"/>
  : <Redirect to="/redazione/caporedattore"/>
}


function App() {
  return (

    <Router basename="/webapp">
    <GlobalContextProvider>
      <Container>
        <Switch>
          <Route exact path="/" component={Homepage}/>
          <Route exact path="/redazione/login" component={LoginRedattore}/>
          <Route exact path="/public/registrazione" component={Registrazione}/>
          <PrivateRoute exact path="/redazione" tipo="redattore" component={RouteRedazione}/>
          <PrivateRoute exact path="/redazione/redattore" tipo="redattore"  component={HomepageRedattore}/>
          <PrivateRoute exact path="/redazione/caporedattore" tipo="caporedattore"  component={HomepageCapoRedattore}/>
          <PrivateRoute exact path="/redazione/stat-approvazioni" tipo="caporedattore"  component={ConteggioApprovazioniPerRedattore}/>
          <PrivateRoute exact path="/redazione/approvazioni/:matricola" tipo="caporedattore"  render={(props) => <ReportApprovazioniPerRedattore matricola={props.match.params.matricola}/>} />
          <PrivateRoute exact path="/redazione/gestione-utenze" tipo="caporedattore" component={GestioneUtenze}/>
          <PrivateRoute exact path="/redazione/validazione-ricetta/:id" tipo="redattore"  render={(props) => <ValidazioneRicetta id={parseInt(props.match.params.id)} ricetta={props.location.state.ricetta}/>}/>
          <PrivateRoute exact path="/redazione/approvazione-ricetta/:id" tipo="caporedattore"  render={(props) => <ApprovazioneRicetta id={parseInt(props.match.params.id)} ricetta={props.location.state.ricetta}/>}/>
          <Route exact path="/public/ricette/per-tipologia/:id" render={(props) => <RicettePerTipologia id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/per-autore/:id" render={(props) => <RicettePerAutore id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/per-ingrediente/:id" render={(props) => <RicettePerIngrediente id={parseInt(props.match.params.id)}/>}/>
          <Route exact path="/public/ricette/ricerca" component={RicercaAvanzata}/>
          <PrivateRoute exact path="/autore/nuova-ricetta" tipo='autore' component={CreaRicetta}/>
          <Route exact path="/public/ricetta/:id" render={(props) => <VisualizzaRicetta id={parseInt(props.match.params.id)} ricetta={props.location.state && props.location.state.ricetta}/>}/>

          <Route path="/404" component={NotFound}/>
          <Route path="*"><Redirect to="/404"/></Route>
        </Switch>
      </Container>
    </GlobalContextProvider>
    </Router>
  );
}

export default hot(module)(App);
