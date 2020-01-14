import apifetch from "./api-fetch"

export interface ConteggioPerRedattore {
    matricola: string,
    nome: string,
    cognome: string,
    conteggio: number

}

export interface ReportRicetta {
    nome_redattore?: string,
    cognome_redattore?: string,
    ricetta?: string,
    data_ora?: string,
    stato?: number,
    nome?: string,
    tempo_cottura?: number,
    note?: string,
    calorie?: number,
    numero_porzioni?: number,
    difficolta?: number,
    modalita_preparazione?: string,
    tipologia?: number
}

export type ReportCampiSelezionabili =  Array<keyof ReportRicetta>


const conteggioPerRedattore = async () => {
    const response = await apifetch(`/statistiche/conteggio-approvazioni`)
    return response.json() as Promise<ConteggioPerRedattore[]>     
} 

const reportPerMatricola = async (matricola: string, campi: ReportCampiSelezionabili) => {
    const response = await apifetch(`/statistiche/approvazioni/${matricola}?${campi.join('&')}`);
    return response.json() as Promise<ReportRicetta[]>   
}
export default {
    conteggioPerRedattore,
    reportPerMatricola
}