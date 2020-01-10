import * as React from 'react'
import { Layout } from '../components/Layout'
import { useError } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

export const RicettePerAutore : React.FC<{id:number}> = ({id}) => {
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    React.useEffect( () => {
        RicetteAPI.ricerca({autore: id})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (setError)
    },[id, setError])
    

    return <Layout titolo="Recette per autore" loading={loading}>
        {
            ricette && <Col xs="12">
                <ListaRicettaView lista={ricette}/>
            </Col>
        }

    </Layout>
        
} 