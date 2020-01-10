import * as React from 'react'
import { Layout } from '../components/Layout'
import { useConfig, useError } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Redirect } from 'react-router';
import { ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

export const RicettePerIngrediente : React.FC<{id:number}> = ({id}) => {
    const {ingredienti} = useConfig();
    const ingrediente = React.useMemo ( () => ingredienti.find(t => t.id === id) ,[id,ingredienti]);
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    React.useEffect( () => {
        if (!ingrediente) return;
        RicetteAPI.ricerca({ingredienti:[ingrediente.id]})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (setError)
    },[ingrediente, setError])
    

    return ingrediente ? <Layout titolo={`Ricette con ${ingrediente.nome}`} loading={loading}>
        {
            ricette && <Col xs="12">
                <ListaRicettaView xs="12" sm="6" md="4" lista={ricette}/>
            </Col>
        }

    </Layout>
    : <Redirect to="/404"/>
        
} 