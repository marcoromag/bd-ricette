import React from 'react'
import {Container, Row, Col, Toast, ToastBody} from 'reactstrap'
import { DisplayError } from './DisplayError'
import { Loading } from './Loading'
import { useInfobox, useError } from '../GlobalContext'

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
        </Row>

    </div>
}

export const Layout : React.FC<LayoutProps & {className?: string}> = ({titolo,  className, headline, loading, children}) => {
    const [infobox] = useInfobox();
    const [error] = useError();
    return (
    <Container>
            <Row>
                {titolo && <Col xs="12" className="mb-4"><h1>{titolo}</h1></Col>}
                {headline && <Col xs="12" className="mb-4"><h6 className="text-info">{headline}</h6></Col>}
                {infobox && <Col xs="12" className="mb-4"><InfoBox>{infobox}</InfoBox></Col>}
                {error && <Col xs="12" className="mb-4"><DisplayError error={error.message}/></Col>}
            </Row>
            <Row className={className}>
                <Loading loading={loading}>
                    {children}
                </Loading>
            </Row>
    </Container>

    )
}