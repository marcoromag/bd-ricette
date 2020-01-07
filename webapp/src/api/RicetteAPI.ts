import apifetch from "./api-fetch"
import { Ingrediente } from "./ConfigAPI"

export interface IngredienteRicetta extends Ingrediente{
    quantita: string;
}
export interface Ricetta {
    id: number
    nome: string
    tipologia: number
    autore: string
    tempo_cottura: number
    calorie: number
    numero_porzioni: number
    difficolta: number
    stato: number
    modalita_preparazione: string
    note: string
    nome_autore: string
    cognome_autore: string
    autore_email: string
    nome_stato: string
    nome_tipologia: string,
    ingredienti?: IngredienteRicetta[]
}

export interface RicercaRicettaParam {
    tipologia?: number,
    ingredienti?: number[],
    autore?: number,
    tempo_cottura_min?: number,
    tempo_cottura_max?: number,
    calorie_min?: number,
    calorie_max?: number,
    difficolta?: number
}

const ricerca = async (query:RicercaRicettaParam ) => {
    const response = await apifetch('/public/ricerca-ricette',{
        method:'POST',
        body: JSON.stringify(query)
    })
    return response.json() as Promise<Ricetta[]>
}

const ultimeRicette = async () => {
    const response = await apifetch('/public/ultime-ricette')
    return response.json() as Promise<Ricetta[]>
}

export default {
    ricerca,
    ultimeRicette
}