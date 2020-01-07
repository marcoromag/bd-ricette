import * as React from 'react';
import LoginAPI, { User } from './api/LoginAPI';
import { Loading } from './components/Loading';
import { Layout } from './components/Layout';
import ConfigAPI, { Tipologia, Ingrediente } from './api/ConfigAPI';

export interface LoginContext {
    isLoggedIn: boolean,
    user?: User
}

export interface GlobalContext {
    login: LoginContext;
    ingredienti: Ingrediente[];
    tipologie: Tipologia[];
    setLogin: (login: LoginContext) => void;
}
const initialState = {
    login: {
        isLoggedIn:false
    },
    ingredienti:[],
    tipologie:[],
    setLogin: () => {}
}

const GlobalContext = React.createContext<GlobalContext>(initialState);

export const useConfig= () => {
    const ctx = React.useContext(GlobalContext);
    return {
        tipologie: ctx.tipologie,
        ingredienti: ctx.ingredienti,
    } 
}

export const useLogin = () => {
    const ctx = React.useContext(GlobalContext);
    return [ctx.login, ctx.setLogin] as [LoginContext,(v : LoginContext) => void]
}

export const GlobalContextProvider : React.FC = ({children}) => {
    const [isLoading, setLoading] = React.useState(true);
    const [state, setState] = React.useState<GlobalContext>({
        ...initialState,
        setLogin: (login) => {
            setState({...state,login})
        }
    })

    React.useEffect( () => {
        Promise.all ([
            ConfigAPI.listaIngredienti().catch( () => Promise.resolve([] as Ingrediente[])),
            ConfigAPI.listaTipologie().catch( () => Promise.resolve([] as Tipologia[])),
            LoginAPI.user().catch( () => Promise.resolve(null))
        ]).then (([ingredienti,tipologie, user]) => {
            const t = tipologie as Tipologia[]
            const i = ingredienti as Ingrediente[]
            setState( s=> ({
                ...s,
                tipologie : t,
                ingredienti: ingredienti as Ingrediente[],
                login: {
                    isLoggedIn: !!user,
                    user: !!user ? user : undefined 
                }
            }));
            setLoading(false);
        });

    },[])

    return <GlobalContext.Provider value={state}>
        {isLoading ? <Layout><Loading/></Layout> : children}
    </GlobalContext.Provider>
}
