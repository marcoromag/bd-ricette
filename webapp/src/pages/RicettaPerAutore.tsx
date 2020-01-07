import * as React from 'react'
import { Layout } from '../components/Layout'
import { useConfig } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Redirect } from 'react-router';
import { RicettaView, ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

export const RicettePerAutore : React.FC<{id:number}> = ({id}) => {
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [error,setError] = React.useState<string>();
    React.useEffect( () => {
        RicetteAPI.ricerca({autore: id})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (e => setError(e.message))
    },[id])
    

    return <Layout titolo="Recette per autore" loading={loading} errore={error}>
        {
            ricette && <Col xs="12">
                <ListaRicettaView lista={ricette}/>
            </Col>
        }

    </Layout>
        
} 