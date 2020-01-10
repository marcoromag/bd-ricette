import * as React from 'react'
import { Layout } from '../components/Layout'
import { useConfig, useError } from '../GlobalContext'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Redirect } from 'react-router';
import { ListaRicettaView } from '../components/RicettaView';
import { Col } from 'reactstrap';
import { InfoMessage } from '../components/Info';

export const RicettePerTipologia : React.FC<{id:number}> = ({id}) => {
    const {tipologie} = useConfig();
    const tipologia = React.useMemo ( () => tipologie.find(t => t.id === id) ,[id,tipologie]);
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    React.useEffect( () => {
        if (!tipologia) return;
        RicetteAPI.ricerca({tipologia:tipologia.id})
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (setError)
    },[tipologia, setError])

    const has = ricette && ricette.length;
    

    return tipologia ? <Layout titolo={`Ricette per ${tipologia.nome}`} loading={loading}>
        <Col xs="12">
        {!!has && <ListaRicettaView xs="12" sm="6" md="4" lista={ricette!}/>}
        {!!!has && <InfoMessage>Nessuna ricetta in questa tipologia</InfoMessage>}
        </Col>

    </Layout>
    : <Redirect to="/404"/>
        
} 