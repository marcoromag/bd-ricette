import * as React from 'react'
import { ButtonProps, Card, CardBody, Row, Button, Col } from 'reactstrap'

export interface CardButtonProps  {
    testo: string
}

export const CardButton : React.FC<ButtonProps & CardButtonProps> = ({testo, children,...props}) => {

    return <Card>
        <CardBody>
            <Row>
                <Col xs="8" className="mx-auto">
                    <Button block outline color="primary" {...props}>{testo}</Button>
                </Col>
                {children &&                
                <Col xs="auto" className="mx-auto text-center mt-3">
                    {children}
                </Col>
                }

            </Row>
        </CardBody>
    </Card>
}