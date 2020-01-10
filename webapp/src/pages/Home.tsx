import * as React from 'react'
import { Layout } from '../components/Layout'
import { useLogin, useError } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { RicettaView } from '../components/RicettaView';
import { Col, Row } from 'reactstrap';
import { LoginView } from '../components/LoginView';
import { Link } from 'react-router-dom';
import LoginAPI from '../api/LoginAPI';
import { StoricoRicette } from '../components/StoricoRicette';

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
    },[])
    return <Layout titolo="Home" loading={loading} >
        <Col xs="12" sm="7">
            <h2>Ultime ricette pubblicate</h2>
            {ricette 
                ? ricette.map (r=><RicettaView ricetta={r}/>)
                :<span>nessuna ricetta</span>
            }   
        </Col>
        <Col xs="12" sm="5">
            <Row>
            
                {!login.isLoggedIn && 
                <Col xs="12" >
                    <h2>Accedi</h2>
                    <LoginView fn={LoginAPI.loginAutore}/>
                    Vuoi diventare un autore di ricette? <Link to="/public/registrazione">Clicca qui per registrarti</Link>. Sei già registrato? Effettua il login 
                    <Link to="/redazione/login">Accesso alla redazione</Link>. Sei già registrato? Effettua il login 
                </Col>}
                {login.isLoggedIn &&
                <Col xs="12">
                    Benvenuto {login.user!.nome}. Vuoi creare una ricetta? <Link to="/autore/nuova-ricetta">Clicca qui</Link>.
                </Col>
                }
                {login.isLoggedIn && login.user && login.user.tipo === 'autore' &&
                <Col xs="12">
                    <StoricoRicette/>
                </Col>}
            </Row>
        </Col>
    </Layout>
} 