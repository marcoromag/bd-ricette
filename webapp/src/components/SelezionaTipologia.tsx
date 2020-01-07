import * as React from 'react'
import { Input, InputProps } from 'reactstrap'
import { useConfig } from '../GlobalContext';


export const SelezionaTipologia : React.FC<InputProps> = ({value, ...rest}) => {
    const {tipologie} = useConfig();

    return  <Input {...rest} type="select" value={value}>
        {!value && <option>--</option>}
        {tipologie && tipologie.map( f => <option key={f.id} value={f.id}>{f.nome}</option>)}
    </Input>
}
