import * as React from 'react'
import { Layout } from '../components/Layout'
import { useLogin } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { RicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

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
    return <Layout titolo="Home">
        <Col xs="12">
            <h2>Ultime ricette pubblicate</h2>
            {ricette 
                ? ricette.map (r=><RicettaView ricetta={r}/>)
                :<span>nessuna ricetta</span>
            }   
        </Col>
    </Layout>
} 