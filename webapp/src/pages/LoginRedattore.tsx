import * as React from 'react'
import { Row, Col} from 'reactstrap'
import LoginAPI, { LoginFunction } from '../api/LoginAPI';
import { LoginView } from '../components/LoginView';
import { Layout } from '../components/Layout';



export const LoginRedattore: React.FC<{fn: LoginFunction}> = ({fn}) => {
  

    return (
        <Layout titolo="Login alla redazione">
            <Row>
                <Col xs="12" className="mx-auto my-5">
                    <LoginView fn={LoginAPI.loginRedattore} to="/redazione"/>
                </Col>
            </Row>
        </Layout>
    )
}