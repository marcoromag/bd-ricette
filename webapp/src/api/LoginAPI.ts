import apifetch from "./api-fetch"

export type TipoUtente = 'autore' | 'redattore' | 'caporedattore'
export interface User {
    nome: string,
    cognome: string,
    tipo: TipoUtente
}

export interface RegistrazioneAutore {
	username: string,
	password: string,
    email: string,
    nome: string,
    cognome: string,
    consenso_liberatoria: number
    indirizzo?: string,
    data_nascita?: string,
    citta?: string,
    cap?: string,
    telefono_abitazione?: string,
    telefono_cellulare?: string,
}

export type LoginFunction =  (utente: string, password: string) => Promise<User>

const loginAutore : LoginFunction = async (utente: string, password: string) => {
    const response = await apifetch('/autore/login', {
        method:'POST',
        body:JSON.stringify({utente,password})
    })

    return response.json() as Promise<User>;
}

const loginRedattore : LoginFunction = async (utente: string, password: string) => {
    const response = await apifetch('/redattore/login', {
        method:'POST',
        body:JSON.stringify({utente,password})
    })

    return response.json() as Promise<User>;
}

const registrazioneAutore = async (autore: RegistrazioneAutore) => {
    const response = await apifetch('/autore', {
        method:'POST',
        body: JSON.stringify(autore)
    });
    const data = await response.json();
    return {
        tipo: 'autore',
        nome: data.nome,
        cognome: data.cognome
    } as User
}

const logout = async () => {
    await apifetch('/logout', {
        method:'POST'
    });
}

const user = async () => {
    const response = await apifetch('/me', {
        method:'GET'
    })
    return response.json() as Promise<User>;
}


export default {
    loginAutore,
    loginRedattore,
    logout,
    user,
    registrazioneAutore
}