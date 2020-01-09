import * as React from 'react'
import { Route, RouteProps, Redirect } from 'react-router'
import { useLogin } from '../GlobalContext'
import { TipoUtente } from '../api/LoginAPI'
import { HomepageCapoRedattore } from '../pages/HomepageCaporedattore'

export const PrivateRoute : React.FC<RouteProps & {tipo: TipoUtente}> = ({ tipo, children, render, component, ...rest }) => {
    const [login] = useLogin();
    const userTipo = (login.isLoggedIn && login.user && login.user.tipo)

    const isLoggedIn = 
      userTipo && (
        ( tipo === 'autore' && userTipo === 'autore')
        || (tipo === 'caporedattore' && userTipo === 'caporedattore')
        || (tipo === 'redattore' && ['redattore','caporedattore'].includes(userTipo))
      );

    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn ? (
            (render &&  render(props))
            || (component && React.createElement(component))  
            ||children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )
}