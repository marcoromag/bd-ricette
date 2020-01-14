import * as React from 'react'
import { Layout } from '../components/Layout'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI'
import { RicettaIntera } from '../components/RicettaView';
import { Col, Button} from 'reactstrap';
import { useHistory } from 'react-router';
import { InfoModal } from '../components/InfoModal';
import { useError } from '../GlobalContext';



export const VisualizzaRicetta : React.FC<{ricetta?:Ricetta, id:number}> = ({ricetta:cache, id}) => {
    const [ricetta, setRicetta] = React.useState<Ricetta>();
    const [loading, setLoading] = React.useState(false);
    const [,setError] = useError();

    React.useEffect( () => {
        if (cache && (cache.id === id)) {
            setRicetta(cache);
        } else {
            setLoading(true);
            RicetteAPI.ricetta(id)
            .then(setRicetta)
            .catch (setError)
            .finally(() => setLoading(false))
        }
    },[cache,id,setError])

    return <Layout titolo={ricetta ? ricetta.nome : 'Caricamento...'} loading={loading}>
        <Col xs="12">
            {ricetta && <RicettaIntera ricetta={ricetta!}/>}
        </Col>
    </Layout>


}