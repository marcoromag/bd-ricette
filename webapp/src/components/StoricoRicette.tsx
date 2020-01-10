import * as React from 'react'
import RicetteAPI, { Ricetta } from '../api/RicetteAPI'
import { useError } from '../GlobalContext';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap';
import styles from './StoricoRicette.module.scss';

export const StoricoRicette : React.FC = () => {
    const [ricette, setRicette] = React.useState<Ricetta[]>()
    const [,setError] = useError();

    React.useEffect( () => {
        RicetteAPI.ricetteNonPubblicatePerAutore()
        .then(setRicette)
        .catch (setError)
    },[]);

    return <Card>
        <CardHeader>
            Le tue ricette non ancora pubblicate
        </CardHeader>
        <CardBody>
            {ricette && ricette.map (r => 
            <Row className={styles.item}>
                <Col>
                    <h4>{r.nome}</h4>
                </Col>
                <Col xs="auto"><Button outline color="primary">Vai</Button></Col>
                {r.storico && r.storico.length && 
                    <Col xs="12" className={styles.head}>
                        <Row>
                            <Col xs="12" sm="4" >Data</Col>
                            <Col xs="12" sm="4">Stato</Col>
                            <Col xs="12" sm="4">Persona</Col>
                        </Row>
                    </Col>
                }
                {r.storico && r.storico.map(s => 
                    <Col xs="12" className={styles.riga}>
                        <Row>
                            <Col xs="12" sm="4" className={styles.riga}>{s.data_ora}</Col>
                            <Col xs="12" sm="4" className={styles.riga}>{s.nome_stato}</Col>
                            <Col xs="12" sm="4" className={styles.riga}>{s.nome} {s.cognome}</Col>
                        </Row>
                    </Col>
                )}
            </Row>
            )}
        </CardBody>
    </Card> 
    
    

}