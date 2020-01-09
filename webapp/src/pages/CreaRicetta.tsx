import * as React from 'react'
import { Layout } from '../components/Layout'
import { Col, Label, Input, Row, Button } from 'reactstrap'
import { SelezionaDifficolta } from '../components/SelezionaDifficolta'
import { SelezionaTipologia } from '../components/SelezionaTipologia'
import { EditListaIngredienti } from '../components/EditListaIngredienti'
import RicetteAPI, { IngredienteRicetta, NuovaRicetta } from '../api/RicetteAPI'
import { useHistory } from 'react-router'
import { useConfig } from '../GlobalContext'
import { Link } from 'react-router-dom'

export const CreaRicetta : React.FC = () => {
    const {ricaricaIngredienti} = useConfig()
    const [loading, setLoading] = React.useState(false)
    const [error,setError] = React.useState<string>()
    const [nome,setNome] = React.useState<string>('')
    const [note,setNote] = React.useState<string>('')
    const [preparazione,setPreparazione] = React.useState<string>('')
    const [ingredienti, setIngredienti] = React.useState<IngredienteRicetta[]>([])
    const [tipologia, setTipologia] = React.useState<number>()
    const [difficolta, setDifficolta] = React.useState<number>(1)
    const [calorie, setCalorie] = React.useState<number>(0)
    const [cottura, setCottura] = React.useState<number>(0)
    const history = useHistory();

    const tipologiaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTipologia(val ? parseInt(val) : undefined);
    },[])
    const preparazioneChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        setPreparazione(e.target.value);
    },[])
    const noteChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    },[])
    const nomeChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        setNome(e.target.value);
    },[])
    const difficoltaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        setDifficolta(parseInt(e.target.value));
    },[])
    const calorieChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setCalorie(parseInt(val));
    },[])
    const cotturaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setCottura(parseInt(val));
    },[])

    const abilitaSalva = nome && tipologia && calorie && difficolta && preparazione && cottura;

    const salvaRicetta = React.useCallback ( () => {
        const ricetta : NuovaRicetta = {
            nome,
            tipologia: tipologia!,
            ingredienti,
            calorie,
            difficolta,
            modalita_preparazione: preparazione,
            note,
            numero_porzioni:0,
            tempo_cottura: cottura
        }
        RicetteAPI.inserisci(ricetta)
        .then(r => {
            ricaricaIngredienti();
            console.log(`FATTO ${JSON.stringify(r)}`)
        }).catch( e => setError(e.message))
    },[nome, note, preparazione, ingredienti, tipologia, difficolta, calorie, cottura, ricaricaIngredienti])


    return <Layout titolo="Crea una nuova ricetta"
    headline={<>
        Una volta creata, la ricetta dovrà essere validata da un redattore. 
        Puoi controllare lo stato della tua ricetta dal menu <Link to="/private/le-mie-ricette">">Le mie ricette</Link>
    </>}>
        <Col xs="12">
            <Label>Titolo</Label>
            <Input type="text" value={nome} onChange={nomeChange}/>
        </Col>
        <Col xs="12">
            <Label>Ingredienti</Label>
            <EditListaIngredienti lista={ingredienti} setLista={setIngredienti}/>
        </Col>
        <Col xs="12" sm="6">
            <Label>Modalità di preparazione</Label>
            <Input type="textarea" value={preparazione} onChange={preparazioneChange}/>
        </Col>
        <Col xs="6">
            <Row>
                <Col xs="12">
                    <Label>Tipologia</Label>
                    <SelezionaTipologia value={tipologia} onChange={tipologiaChange}/>
                </Col>
                <Col xs="12">
                    <Label>Difficoltà</Label>
                    <SelezionaDifficolta value={difficolta} onChange={difficoltaChange} mandatory/>
                </Col>
                <Col xs="12">
                    <Label>Calorie</Label>
                    <Input type="number" value={calorie} onChange={calorieChange}/>
                </Col>
                <Col xs="12">
                    <Label>Tempo di cottura</Label>
                    <Input type="number" value={cottura} onChange={cotturaChange}/>
                </Col>
            </Row>
        </Col>
        <Col xs="12" >
            <Label>Note</Label>
            <Input type="textarea" value={note} onchange={noteChange}/>
        </Col>
        <Col xs="12 mt-4" >
            <Button disabled={!abilitaSalva}  onClick={salvaRicetta}>Sottometti la ricetta ad un redattore</Button>
        </Col>


    </Layout>
}