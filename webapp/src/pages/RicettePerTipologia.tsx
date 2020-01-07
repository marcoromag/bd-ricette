import * as React from 'react'
import { Layout } from '../components/Layout'
import { useConfig } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Redirect } from 'react-router';
import { RicettaView, ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';

export const RicettePerTipologia : React.FC<{id:number}> = ({id}) => {
    const {tipologie} = useConfig();
    const tipologia = React.useMemo ( () => tipologie.find(t => t.id === id) ,[id,tipologie]);
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [error,setError] = React.useState<string>();
    React.useEffect( () => {
        if (!tipologia) return;
        RicetteAPI.ricerca({tipologia:tipologia.id})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (e => setError(e.message))
    },[tipologia])
    

    return tipologia ? <Layout titolo={tipologia.nome} loading={loading} errore={error}>
        {
            ricette && <Col xs="12">
                <ListaRicettaView lista={ricette}/>
            </Col>
        }

    </Layout>
    : <Redirect to="/404"/>
        
} 