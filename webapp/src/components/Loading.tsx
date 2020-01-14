import * as React from 'react'
import { Spinner, Row, Col } from 'reactstrap'

export const LoadingView : React.FC = () => {
    return <Col xs="12" className="text-center mt-5 pt-5">
        <Spinner className="mx-auto" color="info"/>
    </Col>
}

export const Loading: React.FC<{loading?: boolean}> = ({loading, children}) => {
    return loading ? <LoadingView/> : <>{children}</>
}