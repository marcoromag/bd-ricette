import * as React from 'react'
import { Layout } from '../components/Layout'
import RicetteAPI, { Ricetta, RicercaRicettaParam } from '../api/RicetteAPI';
import { Ingrediente } from '../api/ConfigAPI';
import { Label, Col } from 'reactstrap';
import { SelezionaTipologia } from '../components/SelezionaTipologia';
import { Loading } from '../components/Loading';
import { ListaRicettaView } from '../components/RicettaView';
import InputRange, { Range } from 'react-input-range';
import { Slider } from '../components/Slider';
import { SelezionaDifficolta } from '../components/SelezionaDifficolta';
import { SelezionaIngrediente, SelezionaListaIngredienti } from '../components/SelezionaIngrediente';
import { useError } from '../GlobalContext';

export const RicercaAvanzata : React.FC = () => {
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(false);
    const [,setError] = useError();
    const [ingredienti, setIngredienti] = React.useState<Ingrediente[]>()
    const [tipologia, setTipologia] = React.useState<number>()
    const [difficolta, setDifficolta] = React.useState<number>()
    const [calorieRng, setCalorieRng] = React.useState<Range>({min:0, max:1000})
    const [cotturaRng, setCotturaRng] = React.useState<Range>({min:0, max:180})

    const tipologiaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTipologia(val ? parseInt(e.target.value) : undefined);
    },[])
    const difficoltaChange = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setDifficolta(val ? parseInt(e.target.value) : undefined);
    },[])

    React.useEffect( () => {
        const query : RicercaRicettaParam = {
            difficolta: difficolta ? difficolta: undefined,
            ingredienti: (ingredienti && ingredienti.length) ? ingredienti.map(i => i.id) : undefined,
            tipologia: tipologia ? tipologia : undefined,
            calorie_min: (calorieRng && calorieRng.min && calorieRng.min >0) ? calorieRng.min : undefined,
            calorie_max: (calorieRng && calorieRng.max && calorieRng.max <1000) ? calorieRng.max : undefined,
            tempo_cottura_min: (cotturaRng && cotturaRng.min && cotturaRng.min > 0) ? cotturaRng.min : undefined,
            tempo_cottura_max: (cotturaRng && cotturaRng.max && cotturaRng.max < 180) ? cotturaRng.max : undefined,
        }

        if (!Object.keys(query).filter(k => query[k as keyof RicercaRicettaParam]).length) {
            setRicette(undefined);
            return;
        }
        setLoading(true)
        setError(undefined);
        RicetteAPI.ricerca(query)
        .then (setRicette)
        .catch (setError)
        .finally (() => setLoading(false))
    },[ingredienti, tipologia, calorieRng, cotturaRng, difficolta])
    

    return <Layout titolo="Ricerca ricetta">
        <Col xs="12" sm="6">
            <Label>Tipologia</Label>
            <SelezionaTipologia value={tipologia} onChange={tipologiaChange}/>
        </Col>
        <Col xs="12" sm="6">
            <Label>Difficoltà</Label>
            <SelezionaDifficolta value={difficolta} onChange={difficoltaChange}/>
        </Col>
        <Col xs="12" sm="6" className="pb-3 mt-sm-2">
            <Label>Calorie</Label>
            <Slider  minValue={0} maxValue={1000}  value={calorieRng} onChange={(v) => setCalorieRng(v as Range)}/>
        </Col>
        <Col xs="12" sm="6" className="pb-3 mt-sm-2">
            <Label>Tempo di cottura</Label>
            <Slider  minValue={0} maxValue={180}  value={cotturaRng} onChange={(v) => setCotturaRng(v as Range)}/>
        </Col>
        <Col xs="12" sm="6" className="pb-3 mt-sm-2">
            <Label>Ingrediente</Label>
            <SelezionaListaIngredienti onChange={setIngredienti}/>
        </Col>
        <Col xs="12">
            <Loading loading={loading}>
                {ricette && <ListaRicettaView lista={ricette}/>}
            </Loading>

        </Col>
    </Layout>
}