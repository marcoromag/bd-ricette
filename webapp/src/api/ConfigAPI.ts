import apifetch from "./api-fetch"

export interface Tipologia {
    id: number,
    nome: string
}

export interface IngredienteParziale {
    id?: number,
    nome: string
}
export interface Ingrediente extends IngredienteParziale{
    id: number
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