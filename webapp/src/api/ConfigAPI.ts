import apifetch from "./api-fetch"

export interface Tipologia {
    id: number,
    nome: string
}

export interface Ingrediente {
    id: number,
    nome: number,
    unita_misura: number
}


const listaTipologie = async () => {
    const response = await apifetch('/public/tipologie')
    return response.json() as Promise<Tipologia[]>
}

const listaIngredienti = async () => {
    const response = await apifetch('/public/ingredienti')
    return response.json() as Promise<Ingrediente[]>
}

export default {
    listaTipologie,
    listaIngredienti,
}