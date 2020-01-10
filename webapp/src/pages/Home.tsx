import * as React from 'react'
import { Layout } from '../components/Layout'
import { useLogin, useError } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import {  ListaRicettaView } from '../components/RicettaView';
import { Col, Row,Card, CardBody } from 'reactstrap';
import { LoginView } from '../components/LoginView';
import { Link, useHistory } from 'react-router-dom';
import LoginAPI from '../api/LoginAPI';
import { StoricoRicette } from '../components/StoricoRicette';
import { CardButton } from '../components/CardButton';
import { InfoMessage } from '../components/Info';

const AutoreBarraSinistra: React.FC = () => {
    const [{user}] = useLogin();

    return <>
        <Col xs="12">
            <CardButton testo="crea una ricetta">
                Benvenuto {user!.nome}. Vuoi creare una ricetta?
            </CardButton>
        </Col>
        <Col xs="12" className="mt-4">
            <StoricoRicette/>
        </Col>
    </>
}

const AccessoBarraSinistra: React.FC = () => {
    const {push} = useHistory();

    return <>
        <Col xs="12" >
            <LoginView fn={LoginAPI.loginAutore} messaggio="Se sei un autore del nostro sito, inserisci le tue credenziali per accedere"/>
        </Col>
        <Col xs="12" className="mt-4">
            <CardButton testo="Registrati" onClick={()=>push('/public/registrazione')}>
                <small>Vuoi diventare un autore di ricette? registrati al nostro sito</small>
            </CardButton>
        </Col>
        <Col xs="12" className="mt-4">
            <Card>
                <CardBody>
                    <span>Sei un redattore? effettua l'<Link to="/redazione/login">accesso alla redazione</Link>.</span>
                </CardBody>
            </Card>
        </Col>
    </>
}


export const Homepage : React.FC = () => {
    const [login] = useLogin();

    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    React.useEffect( () => {
        RicetteAPI.ultimeRicette()
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (setError)
    },[setError])
    return <Layout titolo="Home" loading={loading} >
        <Col xs="12" sm="7">
            <h2>Ultime ricette pubblicate</h2>
            {ricette && <ListaRicettaView xs="12" lista={ricette}/>}
            {!ricette && <InfoMessage>Nessuna ricetta</InfoMessage>}
        </Col>
        <Col xs="12" sm="5">
            <Row>
                {!login.isLoggedIn && <AccessoBarraSinistra/>}
                {login.isLoggedIn && login.user && login.user.tipo === 'autore' && <AutoreBarraSinistra/>}
            </Row>
        </Col>
    </Layout>
} 