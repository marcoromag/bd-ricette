import * as React from 'react'
import { Row, Col, Input, InputProps } from "reactstrap";
import { Difficolta } from './Difficolta';

export const SelezionaDifficolta : React.FC<InputProps & {mandatory?:boolean}> = ({mandatory, value, ...rest}) => {
    return  <Row>
        <Col xs="8">
            <Input {...rest} type="select" value={value}>
                {!mandatory && <option>--</option>}
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </Input>
        </Col>
        <Col xs="4">
            <Difficolta livello={parseInt(value as string)}/>
        </Col>
    </Row>
}
