import * as React from 'react'
import { Layout } from '../components/Layout'
import { useConfig } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Redirect } from 'react-router';
import { RicettaView, ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

export const RicettePerIngrediente : React.FC<{id:number}> = ({id}) => {
    const {ingredienti} = useConfig();
    const ingrediente = React.useMemo ( () => ingredienti.find(t => t.id === id) ,[id,ingredienti]);
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [error,setError] = React.useState<string>();
    React.useEffect( () => {
        if (!ingrediente) return;
        RicetteAPI.ricerca({ingredienti:[ingrediente.id]})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (e => setError(e.message))
    },[ingrediente])
    

    return ingrediente ? <Layout titolo={`Ricette con ${ingrediente.nome}`} loading={loading} errore={error}>
        {
            ricette && <Col xs="12">
                <ListaRicettaView lista={ricette}/>
            </Col>
        }

    </Layout>
    : <Redirect to="/404"/>
        
} 