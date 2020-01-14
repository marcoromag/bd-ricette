import * as React from 'react'
import { Layout } from '../components/Layout'
import StatisticheAPI, { ReportRicetta, ReportCampiSelezionabili } from '../api/StatisticheAPI'
import { Input, FormGroup, Label, Col, Row } from 'reactstrap'
import { useError } from '../GlobalContext'
import { Loading } from '../components/Loading'
import styles from './ReportApprovazioniPerRedattore.module.css'



const useToggle = (field: keyof ReportRicetta, campi: ReportCampiSelezionabili, setCampi: (c:ReportCampiSelezionabili)=>void) => {
    const toggle = React.useCallback( (event: React.ChangeEvent<HTMLInputElement>) => {
        if (campi.includes(field)) setCampi (campi.filter(c => c !== field))
        else setCampi([...campi, field]);
    },[campi, field])
    const checked = campi.includes(field);
    return (<Input type="checkbox" onChange={toggle} checked={checked}/>)
}

const ColReport : React.FC<{xs?:string, sm?: string, nome:string, valore?:any}> = ({xs,sm,nome,valore}) => {
    return valore ? <Col xs={xs} sm={sm} className="mt-1">
        <small className="d-block">{nome}</small>
        <span className="d-block">{valore}</span>
    </Col>
    : null
}

const MostraReport: React.FC<{report: ReportRicetta[]}> = ({report}) => {
    return <>
        {report.map( r => <Row className={styles.row}>
            <ColReport xs="6" sm="2" nome="Nome redattore" valore={r.nome_redattore}/>
            <ColReport xs="6" sm="2" nome="Cognome redattore" valore={r.cognome_redattore}/>
            <ColReport xs="6" sm="2" nome="ID Ricetta" valore={r.ricetta}/>
            <ColReport xs="6" sm="2" nome="Data ultimo stato" valore={r.data_ora}/>
            <ColReport xs="6" sm="2" nome="Stato" valore={r.stato}/>
            <ColReport xs="6" sm="2" nome="Difficoltà" valore={r.difficolta}/>
            <ColReport xs="6" sm="2" nome="Tipologia" valore={r.tipologia}/>
            <ColReport xs="6" sm="2" nome="Nome ricetta" valore={r.nome}/>
            <ColReport xs="6" sm="2" nome="Tempo cottura" valore={r.tempo_cottura}/>
            <ColReport xs="6" sm="2" nome="Calorie" valore={r.calorie}/>
            <ColReport xs="6" sm="2" nome="Porzioni" valore={r.numero_porzioni}/>
            <ColReport xs="6" sm="6" nome="Preparazione" valore={r.modalita_preparazione && <div dangerouslySetInnerHTML={{__html:r.modalita_preparazione}}/> }/>
            <ColReport xs="6" sm="6" nome="Note" valore={r.note && <div dangerouslySetInnerHTML={{__html:r.note}}/>}/>

        </Row>)} 
    </>
}

const SelezionaCampi: React.FC<{campi: ReportCampiSelezionabili, setCampi: (c:ReportCampiSelezionabili) => void}> = ({campi, setCampi}) =>

{  
    const toggles = {
        nomeRedattore : useToggle('nome_redattore',campi,setCampi),
        cognomeRedattore : useToggle('cognome_redattore',campi,setCampi),
        idRicetta: useToggle('ricetta',campi,setCampi),
        dataOra: useToggle('data_ora',campi,setCampi),
        difficolta: useToggle('difficolta',campi,setCampi),
        stato: useToggle('stato',campi,setCampi),
        nome: useToggle('nome',campi,setCampi),
        tempoCottura: useToggle('tempo_cottura',campi,setCampi),
        note: useToggle('note',campi,setCampi),
        calorie: useToggle('calorie',campi,setCampi),
        numeroPorzioni: useToggle('numero_porzioni',campi,setCampi),
        modalita_preparazione: useToggle('modalita_preparazione',campi,setCampi),
        tipologia: useToggle('tipologia',campi,setCampi)
    }

    return  <FormGroup check >
        <Label check className="mx-3">{toggles.nomeRedattore} Nome Redattore</Label>
        <Label check className="mx-3">{toggles.cognomeRedattore} Cognome redattore</Label>        
        <Label check className="mx-3">{toggles.idRicetta} ID Ricetta</Label>
        <Label check className="mx-3">{toggles.tipologia} Tipologia</Label>
        <Label check className="mx-3">{toggles.nome} Nome ricetta</Label>
        <Label check className="mx-3">{toggles.dataOra} Data ultimo stato</Label>
        <Label check className="mx-3">{toggles.difficolta} Difficoltà</Label>
        <Label check className="mx-3">{toggles.stato} Stato</Label>
        <Label check className="mx-3">{toggles.tempoCottura} Tempo cottura</Label>
        <Label check className="mx-3">{toggles.calorie} Calorie</Label>
        <Label check className="mx-3">{toggles.modalita_preparazione} Preparazione</Label>
        <Label check className="mx-3">{toggles.note} Note</Label>
        <Label check className="mx-3">{toggles.numeroPorzioni} Numero porzioni</Label>
    </FormGroup>
}


export const ReportApprovazioniPerRedattore : React.FC<{matricola: string}> = ({matricola}) => {
    const [campiSelezionati, setCampiSelezionati] = React.useState<ReportCampiSelezionabili>([
        'nome','nome_redattore','cognome_redattore','data_ora','stato'
    ]);
    const [listaReport, setListaReport] = React.useState<ReportRicetta[]>();
    const [loading,setLoading] = React.useState(false);
    const [,setError] = useError();

    React.useEffect( () => {
        if (campiSelezionati.length === 0) {
            setListaReport(undefined);
            return;
        }
        setLoading(true);
        StatisticheAPI.reportPerMatricola(matricola, campiSelezionati)
        .then (setListaReport)
        .catch (setError)
        .finally(() => setLoading(false));
    },[campiSelezionati])





    return <Layout titolo={`Report approvazioni per matricola ${matricola}`}>
        <Col xs="12">
            <SelezionaCampi campi={campiSelezionati} setCampi={setCampiSelezionati}/>
        </Col>
        <Col xs="12">
            <Loading loading={loading}>
                {listaReport && <MostraReport report={listaReport}/>}
            </Loading>
        </Col>


    </Layout>
}