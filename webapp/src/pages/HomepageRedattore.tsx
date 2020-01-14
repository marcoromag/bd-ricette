import * as React from 'react'
import {  useError } from '../GlobalContext';
import { Layout, InfoBox } from '../components/Layout';
import { Col, NavItem, NavLink, Nav, TabContent, Row, Button, TabPane } from 'reactstrap';
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { useHistory } from 'react-router';

interface TabProps{
    ricette: Ricetta[], 
    ricarica: () => void
}

const RicetteDaValidare : React.FC<TabProps> = ({ricette, ricarica}) => {
    const {push} = useHistory();
    const [,setError] = useError();

    const revisiona = React.useCallback( (ricetta: Ricetta) => () => {
        RicetteAPI.setInLavorazione(ricetta)
        .then(() => push (`/redazione/validazione-ricetta/${ricetta.id}`,{ricetta}))
        .catch (setError)
    },[setError, push]);

    return <>
        {ricette.map(r => 
                <Row className="mb-2">
                    <Col xs="12" sm="6">{r.nome}</Col>
                    <Col xs="12" sm="3">{r.nome_autore}</Col>
                    <Col xs="12" sm="3"><Button onClick={revisiona(r)}>Revisiona</Button></Col>
                </Row>
        )}
    </>
}

const RicetteInLavorazione : React.FC<TabProps> = ({ricette,  ricarica}) => {
    const {push} = useHistory();
    const [,setError] = useError();
    const revisiona = React.useCallback( (ricetta: Ricetta) => () => {
        push (`/redazione/validazione-ricetta/${ricetta.id}`,{ricetta})
    },[push]);
    const rilascia = React.useCallback( (ricetta: Ricetta) => () => {
        RicetteAPI.setInserita(ricetta)
        .then(ricarica)
        .catch (setError)
    },[ricarica, setError]);

    return <>
        {ricette.map(r => 
                <Row className="mb-2">
                    <Col xs="12" sm="6">{r.nome}</Col>
                    <Col xs="12" sm="2">{r.nome_autore}</Col>
                    <Col xs="12" sm="2"><Button onClick={revisiona(r)}>Revisiona</Button></Col>
                    <Col xs="12" sm="2"><Button onClick={rilascia(r)}>Rilascia</Button></Col>
                </Row>
        )}
    </>
}

export const HomepageRedattore : React.FC = () => {

    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    const [activeTab, setActiveTab] = React.useState('1');
    const [ricette, setRicette] = React.useState<{
        inLavorazione: Ricetta[],
        daValidare: Ricetta[]
    }>()

    const ricarica = React.useCallback ( () => {
        Promise.all([
            RicetteAPI.ricetteInLavorazione(),
            RicetteAPI.ricerca({stato: 1})
        ]).then (([inLavorazione,daValidare]) => {
            setRicette({inLavorazione, daValidare})
        }).catch (setError)
        .finally(() => setLoading(false));
    },[setError])

    React.useEffect( ricarica,[ricarica])

    const toggle = React.useCallback ((tab: string) => {
      setActiveTab(activeTab => activeTab !== tab ? tab : activeTab);
    },[]);


    return <Layout titolo="Homepage redattore" loading={loading}>
        <Col xs="12">
            <Nav tabs>
                <NavItem>
                <NavLink
                    className={activeTab === '1' ? 'active' : undefined}
                    onClick={() => { toggle('1'); }}>
                    Ricette da validare
                </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                    className={activeTab === '2' ? 'active' : undefined}
                    onClick={() => { toggle('2'); }}
                >
                    Le ricette che sto validando
                </NavLink>
                </NavItem>
            </Nav>
            {ricette && 
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    {ricette.daValidare && ricette.daValidare.length ?
                        <RicetteDaValidare ricette={ricette.daValidare} ricarica={ricarica}/>
                        :<InfoBox>Nessuna ricetta da validare</InfoBox>
                    }
                </TabPane>
                <TabPane tabId="2">
                    {ricette.inLavorazione && ricette.inLavorazione.length ?
                        <RicetteInLavorazione ricette={ricette.inLavorazione} ricarica={ricarica}/>
                        :<InfoBox>Nessuna ricetta in lavorazione</InfoBox>
                    }
                </TabPane>
            </TabContent>
            }
        </Col>
    </Layout>

}