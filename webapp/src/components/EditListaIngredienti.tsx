import * as React from 'react'
import { IngredienteRicetta } from '../api/RicetteAPI'
import { Row, Col, Button, Input, Badge } from 'reactstrap'
import { SelezionaIngrediente } from './SelezionaIngrediente'
import { Ingrediente, IngredienteParziale } from '../api/ConfigAPI'

export interface EditListaIngredientiProps {
    lista: IngredienteRicetta[],
    setLista?: (lista: IngredienteRicetta[]) => void
}

export const EditListaIngredienti : React.FC<EditListaIngredientiProps> = ({lista, setLista}) => {
    const [ingrediente, setIngrediente] = React.useState<Ingrediente | IngredienteParziale>();
    const [quantita, setQuantita] = React.useState<string>();

    const onParziale = React.useCallback( (nome: string) => {
        setIngrediente({nome})
    },[])

    const rimuoviIngrediente = React.useCallback( (value: IngredienteParziale) => {
        setLista && setLista(lista.filter(i => i !== value))
    },[setLista, lista])

    const aggiungiDisabled = (!quantita || !ingrediente)
    const aggiungiIngrediente = React.useCallback( () => {
        if (!setLista || !quantita || !ingrediente) return;
        if (ingrediente.id && lista.find( i => i.id === ingrediente.id)) {
            setIngrediente(undefined)
            setQuantita(undefined)
            return;
        }
        setLista([...lista,{...ingrediente, quantita}])
        setIngrediente(undefined)
        setQuantita(undefined)
    },[setLista, quantita, ingrediente, lista])
    const quantitaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuantita(val);
    },[])

    return <Row>
        {lista.map( (i,n) => (<Col xs="12">
            <Row className={"mb-2"}>
                <Col xs="6" className={"mb-2"}>{i.nome}{!i.id && <Badge pill className="ml-1">new</Badge>}</Col>
                <Col xs="3">{i.quantita}</Col>
                <Col xs="3"><Button onClick={()=>rimuoviIngrediente(i)}>Rimuovi</Button></Col>
            </Row>
        </Col>
        ))}
        <Col xs="6"><SelezionaIngrediente ingrediente={ingrediente} onSelezioneIngrediente={setIngrediente} onParziale={onParziale}/></Col>
        <Col xs="3"><Input type="text" value={quantita || ''} onChange={quantitaChange}/></Col>
        <Col xs="3"><Button disabled={aggiungiDisabled} onClick={aggiungiIngrediente}>Aggiungi</Button></Col>
    </Row>
    
}