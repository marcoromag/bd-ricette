import apifetch from "./api-fetch"

export type TipoUtente = 'autore' | 'redattore' | 'caporedattore'
export interface User {
    nome: string,
    cognome: string,
    tipo: TipoUtente
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
    user
}