import * as React from 'react'
import { FormGroup, Label, Input, Button, Card, CardBody, CardTitle} from 'reactstrap'
import { LoginFunction } from '../api/LoginAPI';
import { useLogin } from '../GlobalContext';
import { useHistory } from 'react-router';
import { DisplayError } from '../components/DisplayError';
import { InfoMessage } from './Info';



export const LoginView: React.FC<{fn: LoginFunction, to?:string, titolo?: string,  messaggio?: string}> = ({fn, to, messaggio, titolo}) => {
    const [login, setLogin] = React.useState<{utente:string,password:string}>({utente:'', password:''});
    const [error, setError] = React.useState<string>();
    const [, setLoginCtx] = useLogin();
    const history = useHistory();

    const runLogin = React.useCallback(  async () => {
        try {
            const user = await fn(login.utente, login.password);
            setLoginCtx({isLoggedIn:true, user});
            history.push(to ? to : "/");
        } catch (e) {
            setLoginCtx({isLoggedIn:false});
            setError (e.message);
        } 
    },[login, history, setLoginCtx, fn, to]);

    const changeUser = React.useCallback(  (e : React.ChangeEvent<HTMLInputElement>) => {
        setLogin({...login, utente: e.target.value})
        setError(undefined);
    },[login]);

    const changePassword = React.useCallback(  (e : React.ChangeEvent<HTMLInputElement>) => {
        setLogin({...login, password: e.target.value})
        setError(undefined);
    },[login]);

    const buttonDisabled = !login.utente || !login.password;


    return (
        <Card>
            <CardBody>
                <CardTitle className="text-center mb-4"><h5>{titolo? titolo : "Login"}</h5></CardTitle>
                <DisplayError error={error}/>
                <FormGroup >
                    <Label for="nomeUtente">Nome utente</Label>
                    <Input type="email" name="user" id="nomeUtente" onChange={changeUser}/>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" onChange={changePassword}/>
                </FormGroup>
                <FormGroup className="text-center">
                    <Button disabled={buttonDisabled} color="primary" outline onClick={runLogin}>Accedi</Button>
                </FormGroup>

                <FormGroup className="text-center">
                    {messaggio && <InfoMessage>{messaggio}</InfoMessage>}
                </FormGroup>
            </CardBody>
        </Card>
    )
}