import * as React from 'react'
import { Layout } from '../components/Layout'
import { useHistory } from 'react-router';
import LoginAPI from '../api/LoginAPI';
import { useError, useInfobox } from '../GlobalContext';
import { isodate } from '../api/utils';
import { Col, Card, CardHeader, CardBody, Row, FormGroup, Input, Label } from 'reactstrap';
import DatePicker from 'react-date-picker';
import { CardButton } from '../components/CardButton';


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

const useInput = (field: keyof RegistrazioneAutore, c: RegistrazioneAutore, setC: (c: RegistrazioneAutore)=>void) => ({
    value: c[field],
    onChange: React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setC ({...c, [field]:e.target.value});
    },[c, field, setC])
})

export const Registrazione : React.FC = () => {


    const history = useHistory();
    const [,setInfoBox] = useInfobox()
    const [, setErrore] = useError();
    const [cliente, setCliente] = React.useState<RegistrazioneAutore>({consenso_liberatoria:0} as RegistrazioneAutore);
    const inputUsername = useInput('username',cliente, setCliente)
    const inputPassword = useInput('password',cliente, setCliente)
    const inputNome = useInput('nome',cliente, setCliente)
    const inputCognome = useInput('cognome',cliente, setCliente)
    const inputEmail = useInput('email',cliente, setCliente)
    const inputIndirizzo = useInput('indirizzo',cliente, setCliente)
    const inputCitta = useInput('citta',cliente, setCliente)
    const inputCap = useInput('cap',cliente, setCliente)
    const inputTelAbitazione = useInput('telefono_abitazione',cliente, setCliente)
    const inputTelCellulare = useInput('telefono_cellulare',cliente, setCliente)

    const allInput = cliente.nome && cliente.cognome &&  cliente.email && cliente.username && cliente.password;

    const toggleConsenso = React.useCallback( () => setCliente(c => ({
        ...c, 
        consenso_liberatoria: c.consenso_liberatoria === 0 ? 1:0
    })),[]);
    

    const creaCliente = React.useCallback ( async () => {
        try {
            await LoginAPI.registrazioneAutore(cliente);
            setInfoBox("Sei stato registrato con successo!");
            setErrore(undefined);
            history.push(`/`)
        } catch (e) {
            setErrore(e)
        }            
    },[cliente, history, setErrore, setInfoBox])

    const changeDataNascita = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setCliente(c => ({...c, data_nascita:isodate(d)}));
    },[])


    return <Layout titolo="Nuovo cliente">
        <Col xs="12">
            <Card>
                <CardHeader>
                    <h3>Dati di login</h3>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12" sm="6">
                            <FormGroup>
                                <Label>Nome utente*</Label>
                                <Input {...inputUsername} type="text" />
                            </FormGroup>
                        </Col>
                        <Col xs="12" sm="6">
                            <FormGroup>
                                <Label>Password*</Label>
                                <Input {...inputPassword} type="password" />
                            </FormGroup>
                        </Col>
                     </Row>
                </CardBody>
            </Card>
        </Col>

        <Col xs="12" className="mt-4">
            <Card>
                <CardHeader>
                    <h3>I tuoi dati</h3>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12" sm="4">
                            <FormGroup>
                                <Label>Nome*</Label>
                                <Input {...inputNome} type="text" />
                            </FormGroup>
                        </Col>
                        <Col xs="12" sm="4">
                            <FormGroup>
                                <Label>Cognome*</Label>
                                <Input {...inputCognome} type="password" />
                            </FormGroup>
                        </Col>
                        <Col xs="12" sm="4">
                            <FormGroup>
                                <Label>Data di nascita</Label>
                                <DatePicker className="form-control datepicker_cust" onChange={changeDataNascita} value={cliente.data_nascita ? new Date(cliente.data_nascita) : undefined} />
                            </FormGroup>
                        </Col>
                        <Col xs="12">
                            <FormGroup>
                                <Label>E-mail*</Label>
                                <Input {...inputEmail} type="email" />
                            </FormGroup>
                        </Col>
                     </Row>
                </CardBody>
            </Card>
        </Col>

        <Col xs="12" className="mt-4">
            <Card>
                <CardHeader>
                    <h3>Consenso alla liberatoria</h3>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12">
                            <span>Per creare nuove ricette, dovrai dare il consenso al trattamento dei dati personali ed accettare i termini e le condizioni del sito. 
                                La mancata accettazione dei termini non ti permetterà di creare nuove ricette</span>
                            <FormGroup check inline className="text-center mt-3">
                                <Label check className="mr-3">
                                    <Input type="checkbox" onChange={toggleConsenso} checked={cliente.consenso_liberatoria === 1}/>Accetto i termini e le condizioni
                                </Label>
                            </FormGroup>
                        </Col>
                     </Row>
                </CardBody>
            </Card>
        </Col>

        <Col xs="12" className="mt-4">
            <Card>
                <CardHeader>
                    <h3>Indirizzo</h3>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label>Indirizzo</Label>
                                <Input {...inputIndirizzo} type="text" />
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label>Città</Label>
                                <Input {...inputCitta} type="text" />
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label>CAP</Label>
                                <Input {...inputCap} type="text" />
                            </FormGroup>
                        </Col>
                     </Row>
                </CardBody>
            </Card>
        </Col>

        <Col xs="12" className="mt-4">
            <Card>
                <CardHeader>
                    <h3>Recapiti telefonici</h3>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="6">
                            <FormGroup>
                                <Label>Telefono Abitazione</Label>
                                <Input {...inputTelAbitazione} type="text" />
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label>Telefono Cellulare</Label>
                                <Input {...inputTelCellulare} type="text" />
                            </FormGroup>
                        </Col>
                     </Row>
                </CardBody>
            </Card>
        </Col>

        <Col xs="12" className="mt-4">
            <CardButton disabled={!allInput} onClick={creaCliente} testo="Crea cliente"></CardButton>
        </Col>
    </Layout>
}