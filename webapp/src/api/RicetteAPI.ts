import apifetch from "./api-fetch"
import { Ingrediente } from "./ConfigAPI"


export interface IngredienteRicetta {
    id?: number;
    nome: string,
    quantita: string;
}

export interface StoricoStato {
    stato: number,
    nome_stato: string,
    data_ora: string,
    id_utente: number,
    nome: string,
    cognome: string
}

export interface NuovaRicetta {
    nome: string
    tipologia: number
    tempo_cottura: number
    calorie: number
    numero_porzioni: number
    difficolta: number
    modalita_preparazione: string
    note: string
    ingredienti?: IngredienteRicetta[]
}
export interface Ricetta extends NuovaRicetta{
    id: number
    autore: string
    stato: number
    nome_autore: string
    cognome_autore: string
    autore_email: string
    nome_stato: string
    nome_tipologia: string,
    storico?: StoricoStato[]
}

export interface RicercaRicettaParam {
    stato?: number,
    tipologia?: number,
    ingredienti?: number[],
    autore?: number,
    tempo_cottura_min?: number,
    tempo_cottura_max?: number,
    calorie_min?: number,
    calorie_max?: number,
    difficolta?: number
}

const ricetta = async (id: number) => {
    const response = await apifetch(`/ricetta/${id}`)
    return response.json() as Promise<Ricetta>
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

const inserisci = async (ricetta: NuovaRicetta) => {
    const response = await apifetch('/ricette',{
        method:'POST',
        body: JSON.stringify(ricetta)
    })
    return response.json() as Promise<Ricetta[]>
}

const ricetteNonPubblicatePerAutore = async () => {
    const response = await apifetch('/private/mie-ricette-non-pubblicate')
    return response.json() as Promise<Ricetta[]>
}

const ricetteInLavorazione = async () => {
    const response = await apifetch('/private/ricette-in-lavorazione')
    return response.json() as Promise<Ricetta[]>
}

const setInserita = async (ricetta: Ricetta) => {
    const response = await apifetch(`/ricette/${ricetta.id}/stato/1`,{method:'POST'})
}

const setInLavorazione = async (ricetta: Ricetta) => {
    const response = await apifetch(`/ricette/${ricetta.id}/stato/2`,{method:'POST'})
}

const setValidata = async (ricetta: Ricetta) => {
    const response = await apifetch(`/ricette/${ricetta.id}/stato/3`,{method:'POST'})
}

const setPubblicata = async (ricetta: Ricetta) => {
    const response = await apifetch(`/ricette/${ricetta.id}/stato/4`,{method:'POST'})
}

const setRigettata = async (ricetta: Ricetta) => {
    const response = await apifetch(`/ricette/${ricetta.id}/stato/4`,{method:'POST'})
}

export default {
    ricetta,
    ricerca,
    inserisci,
    ultimeRicette,
    ricetteInLavorazione,
    setInserita,
    setInLavorazione,
    setValidata,
    setPubblicata,
    setRigettata,
    ricetteNonPubblicatePerAutore
}