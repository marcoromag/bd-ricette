import * as React from 'react'
import { Layout } from '../components/Layout'
import { Col, Row } from 'reactstrap'
import { CardButton } from '../components/CardButton'
import { useHistory } from 'react-router'


export const GestioneUtenze : React.FC = () => {

    const {push} = useHistory();
    const nuovoRedattoreClick = React.useCallback( () => {
        push('/redazione/nuovo-redattore');
    },[push])

    return <Layout titolo="Gestione utenze">
        <Col xs="12" sm="6">
            <Row>
                <Col xs="12">
                    <CardButton testo="Crea un nuovo redattore" onClick={nuovoRedattoreClick}/>
                </Col>
            </Row>
        </Col>
        <Col xs="12" sm="6">
            
        </Col>
    </Layout>
}