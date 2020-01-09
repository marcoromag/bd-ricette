import * as React from 'react'
import { useLogin } from '../GlobalContext';
import { Layout } from '../components/Layout';
import { Col, NavItem, NavLink, Nav, TabContent, Row, Button, TabPane } from 'reactstrap';
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { Loading } from '../components/Loading';
import { useHistory } from 'react-router';

interface TabProps{
    ricette: Ricetta[], 
    setErrore: (e:string) => void,
    ricarica: () => void
}

const RicetteDaValidare : React.FC<TabProps> = ({ricette, setErrore, ricarica}) => {
    const {push} = useHistory();
    const revisiona = React.useCallback( (ricetta: Ricetta) => () => {
        RicetteAPI.setInLavorazione(ricetta)
        .then(() => push (`/redazione/validazione-ricetta/${ricetta.id}`,{ricetta}))
        .catch (e => setErrore(e))
    },[setErrore, push]);

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

const RicetteInLavorazione : React.FC<TabProps> = ({ricette, setErrore, ricarica}) => {
    const {push} = useHistory();
    const revisiona = React.useCallback( (ricetta: Ricetta) => () => {
        push (`/redazione/validazione-ricetta/${ricetta.id}`,{ricetta})
    },[push]);
    const rilascia = React.useCallback( (ricetta: Ricetta) => () => {
        RicetteAPI.setInserita(ricetta)
        .then(ricarica)
        .catch (e => setErrore(e))
    },[push]);

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
    const [error,setError] = React.useState<string>();
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
        }).catch (e => setError(e.message))
        .finally(() => setLoading(false));
    },[])


    React.useEffect( ricarica,[ricarica])

    const toggle = React.useCallback ((tab: string) => {
      setActiveTab(activeTab => activeTab !== tab ? tab : activeTab);
    },[]);


    return <Layout titolo="Homepage redattore" loading={loading} errore={error}>
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
                <TabPane tabId="1"><RicetteDaValidare ricette={ricette!.daValidare} setErrore={setError} ricarica={ricarica}/></TabPane>
                <TabPane tabId="2"><RicetteInLavorazione ricette={ricette!.inLavorazione} setErrore={setError} ricarica={ricarica}/></TabPane>
            </TabContent>
            }
        </Col>
    </Layout>

}