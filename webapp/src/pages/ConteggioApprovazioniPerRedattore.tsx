import * as React from 'react'
import { Layout } from '../components/Layout'
import StatisticheAPI, { ConteggioPerRedattore } from '../api/StatisticheAPI'
import { useError } from '../GlobalContext';
import { Col, Row } from 'reactstrap';
import { useHistory } from 'react-router';

export const ConteggioApprovazioniPerRedattore : React.FC = () => {
    const [stat,setStat] = React.useState<ConteggioPerRedattore[]>();
    const [loading, setLoading] = React.useState(false);
    const [,setError] = useError();
    const {push} = useHistory();

    React.useEffect( () => {
        setLoading(true)
        StatisticheAPI.conteggioPerRedattore()
        .then (setStat)
        .catch (setError)
        .finally (() => setLoading(false))
    },[setError])


    return <Layout titolo="Attivazioni per redattore" loading={loading}>
        <Col xs="8" className="mx-auto">
            <Row>
                <Col xs="3">
                    Matricola
                </Col>
                <Col xs="3">
                    Nome
                </Col>
                <Col xs="3">
                    Cognome
                </Col>
                <Col xs="3">
                    Conteggio
                </Col>
            </Row>

            {stat && stat.map (s => 
                <Row key={s.matricola} className="mt-2 py-2 bg-light" onClick={() => push(`/statistiche/lista-approvazioni-per-redattore/${s.matricola}`)}>
                    <Col xs="3">
                        {s.matricola}
                    </Col>
                    <Col xs="3">
                        {s.nome}
                    </Col>
                    <Col xs="3">
                        {s.cognome}
                    </Col>
                    <Col xs="1">
                        {s.conteggio}
                    </Col>
                    <Col xs className="text-right">
                        <i className="fas fa-chevron-right "></i>
                    </Col>
                </Row>
            )}
        </Col>

    </Layout>
}