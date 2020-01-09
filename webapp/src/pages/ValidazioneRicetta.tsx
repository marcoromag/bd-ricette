import * as React from 'react'
import { Layout } from '../components/Layout'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI'
import { RicettaIntera } from '../components/RicettaView';
import { Col, Button} from 'reactstrap';
import { useHistory } from 'react-router';
import { InfoModal } from '../components/InfoModal';



export const ValidazioneRicetta : React.FC<{ricetta?:Ricetta, id:number}> = ({ricetta:cache, id}) => {
    const [ricetta, setRicetta] = React.useState<Ricetta>();
    const [loading, setLoading] = React.useState(false);
    const [error,setError] = React.useState<string>();
    const [modal,setModal] = React.useState<string>();
    const {push} = useHistory();

    React.useEffect( () => {
        if (cache && (cache.id === id)) {
            setRicetta(cache);
        } else {
            setLoading(true);
            RicetteAPI.ricetta(id)
            .then(setRicetta)
            .catch (e => setError(e.message) )
            .finally(() => setLoading(false))
        }
    },[cache,id])

    const approva = React.useCallback( () => {
        ricetta && RicetteAPI.setValidata(ricetta)
        .then(() => setModal("La ricetta è stata validata e sottomessa al caporedattore"))
        .catch(e => setError(e.message))
    },[setError, ricetta]);

    const rigetta = React.useCallback( () => {
        ricetta && RicetteAPI.setValidata(ricetta)
        .then(() => setModal("La ricetta è stata rigettata e risottomessa all'autore"))
        .catch(e => setError(e.message))
    },[setError, ricetta]);

    const modalClick = React.useCallback( () => {
        setModal(undefined);
        push('/redazione');
    },[])

    return <Layout titolo="Validazione della ricetta" loading={loading} errore={error}>
        <Col xs="12">
            {ricetta && <RicettaIntera ricetta={ricetta!}/>}
        </Col>
        <Col xs="12" sm="6" className="text-center">
            <Button color="success" onClick={approva}>Approva</Button>
        </Col>
        <Col xs="12" sm="6" className="text-center">
            <Button color="danger" onClick={rigetta}>Rifiuta</Button>
        </Col>
        <InfoModal body={modal} onConfirm={modalClick}></InfoModal>
    </Layout>


}