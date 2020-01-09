import * as React from 'react'
import { Layout } from '../components/Layout'
import { useLogin } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { RicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';
import { LoginView } from '../components/LoginView';
import { Link } from 'react-router-dom';
import LoginAPI from '../api/LoginAPI';

export const Homepage : React.FC = () => {
    const [login] = useLogin();

    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [error,setError] = React.useState<string>();
    React.useEffect( () => {
        RicetteAPI.ultimeRicette()
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (e => setError(e.message))
    },[])
    return <Layout titolo="Home" loading={loading} errore={error}>
        <Col xs="7">
            <h2>Ultime ricette pubblicate</h2>
            {ricette 
                ? ricette.map (r=><RicettaView ricetta={r}/>)
                :<span>nessuna ricetta</span>
            }   
        </Col>
        {!login.isLoggedIn ? <>
        <Col xs="12" sm="5">
             <LoginView fn={LoginAPI.loginAutore}/>
             Vuoi diventare un autore di ricette? <Link to="/public/registrazione">Clicca qui per registrarti</Link>. Sei già registrato? Effettua il login 
        </Col>
        <Col xs="12" sm="5">
             <Link to="/redazione/login">Accesso alla redazione</Link>. Sei già registrato? Effettua il login 
        </Col>
        </>
        : <Col xs="12">
            Benvenuto
        </Col>
        }
    </Layout>
} 