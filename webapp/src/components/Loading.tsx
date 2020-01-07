import * as React from 'react'
import { Spinner } from 'reactstrap'

export const LoadingView : React.FC = () => {
    return <Spinner className="mx-auto" color="info"/>
}

export const Loading: React.FC<{loading?: boolean}> = ({loading, children}) => {
    return loading ? <LoadingView/> : <>{children}</>
}