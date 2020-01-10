import * as React from 'react'
import { Layout } from '../components/Layout';
import { Col, NavItem, NavLink, Nav, TabContent, Row, Button, TabPane } from 'reactstrap';
import RicetteAPI, { Ricetta } from '../api/RicetteAPI';
import { useHistory } from 'react-router';
import { useError } from '../GlobalContext';

interface TabProps{
    ricette: Ricetta[], 
    ricarica: () => void
}

const RicetteDaApprovare : React.FC<TabProps> = ({ricette, ricarica}) => {
    const {push} = useHistory();
    const [,setError] = useError();
    const revisiona = React.useCallback( (ricetta: Ricetta) => () => {
         push (`/redazione/approvazione-ricetta/${ricetta.id}`,{ricetta})
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

export const HomepageCapoRedattore : React.FC = () => {

    const [loading, setLoading] = React.useState(true);
    const [,setError] = useError();
    const [activeTab, setActiveTab] = React.useState('1');
    const [ricette, setRicette] = React.useState<{
        daApprovare: Ricetta[]
    }>()

    const ricarica = React.useCallback ( () => {
        Promise.all([
            RicetteAPI.ricerca({stato: 3})
        ]).then (([daApprovare]) => {
            setRicette({daApprovare})
        }).catch (setError)
        .finally(() => setLoading(false));
    },[])


    React.useEffect( ricarica,[ricarica])

    const toggle = React.useCallback ((tab: string) => {
      setActiveTab(activeTab => activeTab !== tab ? tab : activeTab);
    },[]);


    return <Layout titolo="Homepage caporedattore" loading={loading}>
        <Col xs="12">
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? 'active' : undefined}
                        onClick={() => { toggle('1'); }}>
                        Ricette da approvare
                    </NavLink>
                </NavItem>
            </Nav>
            {ricette && 
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1"><RicetteDaApprovare ricette={ricette!.daApprovare} ricarica={ricarica}/></TabPane>
                
            </TabContent>
            }
        </Col>
    </Layout>

}