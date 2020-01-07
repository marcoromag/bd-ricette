import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { DisplayError } from './DisplayError'
import { Loading } from './Loading'

interface LayoutProps {
    titolo?: string
    errore? : string
    headline?: string | React.ReactElement
    loading?: boolean
}

export const Layout : React.FC<LayoutProps & {className?: string}> = ({titolo, errore, className, headline, loading, children}) => {
    
    return (
    <Container>
            <Row>
                {titolo && <Col xs="12" className="mb-4"><h1>{titolo}</h1></Col>}
                {headline && <Col xs="12" className="mb-4"><h6 className="text-info">{headline}</h6></Col>}
                {<Col xs="12"><DisplayError error={errore}/></Col>}
            </Row>
            <Row className={className}>
                {loading ? <Loading/> : children}
            </Row>
    </Container>

    )
}