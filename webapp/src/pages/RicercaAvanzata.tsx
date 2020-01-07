import * as React from 'react'
import { Layout } from '../components/Layout'
import RicetteAPI, { Ricetta, RicercaRicettaParam } from '../api/RicetteAPI';
import { Ingrediente } from '../api/ConfigAPI';

interface Range {
    min?: number,
    max?: number
}

export const RicercaAvanzata : React.FC = () => {
    const [ricette,setRicette] = React.useState<Ricetta[]>()
    const [loading, setLoading] = React.useState(true);
    const [error,setError] = React.useState<string>();
    const [ingredienti, setIngredienti] = React.useState<Ingrediente[]>()
    const [tipologia, setTipologia] = React.useState<number>()
    const [difficolta, setDifficolta] = React.useState<number>()
    const [calorieRng, setCalorieRng] = React.useState<Range>()
    const [cotturaRng, setCotturaRng] = React.useState<Range>()

    React.useEffect( () => {
        const query : RicercaRicettaParam = {
            ingredienti: (ingredienti && ingredienti.length) ? ingredienti.map(i => i.id) : undefined,
            tipologia: tipologia ? tipologia : undefined,
            calorie_min: (calorieRng && calorieRng.min) ? calorieRng.min : undefined,
            calorie_max: (calorieRng && calorieRng.max) ? calorieRng.max : undefined,
            tempo_cottura_min: (cotturaRng && cotturaRng.min) ? cotturaRng.min : undefined,
            tempo_cottura_min: (cotturaRng && cotturaRng.max) ? cotturaRng.max : undefined,
        }

        


        RicetteAPI.ricerca(query)
        .then (setRicette)
        .then (() => setLoading(false))
        .catch (e => setError(e.message))
    },[id])
    

    return <Layout
    ></Layout>
}