import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { Loading } from './Loading'
import { useInfobox, useError } from '../GlobalContext'
import { Header } from './Header'

interface LayoutProps {
    titolo?: string
    headline?: string | React.ReactElement
    loading?: boolean
}

const InfoBox : React.FC = ({children}) => {
    const [,setInfobox] = useInfobox();
    const onClick = React.useCallback( () => setInfobox(undefined),[setInfobox]);
    return <div onClick={onClick} className="p-3 my-2 bg-info text-white rounded">
        <Row>
            <Col xs="auto">
                <i className="fas fa-info-circle fa-2x"></i>           
            </Col>
            <Col xs>
                {children}
            </Col>
            <Col xs>
                <i className="fas fa-times"></i>  
            </Col>
        </Row>

    </div>
}

const ErrorBox: React.FC = ({children}) => {
    const [,setError] = useError();
    const onClick = React.useCallback( () => setError(undefined),[setError]);
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return <div onClick={onClick} className="p-3 my-2 bg-danger text-white rounded">
        <Row>
            <Col xs="auto">
                <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>           
            </Col>
            <Col xs>
                {children}
            </Col>
            <Col xs="auto">
                <i className="fas fa-times"></i>  
            </Col>
        </Row>
    </div>
}

export const Layout : React.FC<LayoutProps & {className?: string}> = ({titolo,  className, headline, loading, children}) => {
    const [infobox] = useInfobox();
    const [error] = useError();
    return (              
    <Container>
        <Row className="sticky-top">
            <Header/>
            {titolo && 
            <Col xs="12" className="bg-warning text-white pt-2 pb-1">
                <h3>{titolo}</h3>
            </Col>}

        </Row>
        { headline && infobox && error &&
        <Row className="mt-3">
            {headline && <Col xs="12" className="mb-4"><h6 className="text-info">{headline}</h6></Col>}
            {infobox && <Col xs="12" className="mb-4"><InfoBox>{infobox}</InfoBox></Col>}
            {error && <Col xs="12" className="mb-4"><ErrorBox>{error.message}</ErrorBox></Col>}
        </Row>
        }
        <Row className={className || 'mt-3'}>
            <Loading loading={loading}>
                {children}
            </Loading>
        </Row>
    </Container>
    )
}