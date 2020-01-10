import apifetch from "./api-fetch"

export interface ConteggioPerRedattore {
    matricola: string,
    nome: string,
    cognome: string,
    conteggio: number

}


const conteggioPerRedattore = async () => {
    const response = await apifetch(`/statistiche/conteggio-approvazioni`)
    return response.json() as Promise<ConteggioPerRedattore[]>     
} 
export default {
    conteggioPerRedattore
}