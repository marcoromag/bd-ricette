import * as React from 'react'
import { Ricetta } from '../api/RicetteAPI'
import { Row, Col, ColProps, Button } from 'reactstrap'

import styles from './RicettaView.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { Difficolta } from './Difficolta'
import { useConfig, useLogin } from '../GlobalContext'
import InfiniteScroll from 'react-infinite-scroller'


const colors = [
    'text-primary', 'text-success','text-danger','text-warning','text-info'
];
export const RicettaView : React.FC<{ricetta:Ricetta}> = ({ricetta}) => {
    const {tipologie} = useConfig();
    const {push} = useHistory();
    const tipologia = React.useMemo ( () => tipologie.find(t => t.id === ricetta.tipologia), [tipologie, ricetta.tipologia]);
    return <Row className={styles.contenitore} noGutters>
            <Col xs className={styles.titolo}>{ricetta.nome}</Col>
            <Col xs="auto"><Button color="info" outline onClick={() => push(`/public/ricetta/${ricetta.id}`,{ricetta})}>Guarda</Button></Col>
            <Col xs="12" className={styles.autore}>Una ricetta di <Link to={`/public/ricette/per-autore/${ricetta.autore}`}>{ricetta.nome_autore} {ricetta.cognome_autore}</Link></Col>
            {tipologia && 
            <Col xs="12" className={styles.autore}>Tipologia: <Link to={`/public/ricette/per-tipologia/${tipologia.id}`} className={colors[tipologia.id % 5]}>{tipologia.nome}</Link></Col>
            }
            <Col xs="12" className={styles.banner}>
                <Row>
                    <Col className={styles.tempo}>
                        <i className="far fa-clock"></i>
                        <span>{ricetta.tempo_cottura} minuti</span></Col>
                    <Col className={styles.difficolta}>
                        <span>Difficoltà</span>
                        <Difficolta livello={ricetta.difficolta}/>
                    </Col>
                    <Col className={styles.calorie}>
                        <i className="fas fa-fire-alt"></i>
                        <span>{ricetta.calorie} kCal</span>
                    </Col>
                </Row>
            </Col>
            {ricetta.ingredienti && 
            <Col xs="12" className={styles.ingredienti}>
                <span>Ingredienti: </span>
                <span>{ricetta.ingredienti.map( (i,n) => <span><Link to={`/public/ricette/per-ingrediente/${i.id}`}>{i.nome}</Link>{n<ricetta.ingredienti!.length-1 && ', '}</span>)}</span>
                
            </Col>
            }
        </Row>
}

export const RicettaIntera : React.FC<{ricetta:Ricetta}> = ({ricetta}) => {
    const {tipologie} = useConfig();
    const [{user}] = useLogin();
    
    const tipologia = React.useMemo ( () => tipologie.find(t => t.id === ricetta.tipologia), [tipologie, ricetta.tipologia]);
    return <Row className={styles.contenitore} noGutters>
            <Col xs="12" className={styles.titolo}>{ricetta.nome}</Col>
            <Col xs="12" className={styles.autore}>Una ricetta di <Link to={`/public/ricette/per-autore/${ricetta.autore}`}>{ricetta.nome_autore} {ricetta.cognome_autore}</Link></Col>
            {tipologia && 
            <Col xs="12" className={styles.autore}>Tipologia: <Link to={`/public/ricette/per-tipologia/${tipologia.id}`} className={colors[tipologia.id % 5]}>{tipologia.nome}</Link></Col>
            }
            {user && (user.tipo === 'redattore' || user.tipo === 'caporedattore') &&
            <Col xs="12" className={styles.autore}>Stato: {ricetta.nome_stato}</Col>
            }
            <Col xs="12" className={styles.banner}>
                <Row>
                    <Col className={styles.tempo}>
                        <i className="far fa-clock"></i>
                        <span>{ricetta.tempo_cottura} minuti</span></Col>
                    <Col className={styles.difficolta}>
                        <span>Difficoltà</span>
                        <Difficolta livello={ricetta.difficolta}/>
                    </Col>
                    <Col className={styles.calorie}>
                        <i className="fas fa-fire-alt"></i>
                        <span>{ricetta.calorie} kCal</span>
                    </Col>
                </Row>
            </Col>
            <Col xs="12">
                {ricetta.ingredienti && 
                    <ul>
                        {ricetta.ingredienti.map((i) => 
                            <li key={i.id}><strong>{i.nome}</strong>: {i.quantita}</li>
                        )}
                    </ul>
                }   
            </Col>
            <Col xs="12" className="mt-4">
                <h4>Preparazione</h4>
                <div dangerouslySetInnerHTML={{__html:ricetta.modalita_preparazione}}/>
            </Col>
            <Col xs="12" className="mt-4">
                <h4>Note</h4>
                <div dangerouslySetInnerHTML={{__html:ricetta.note}}/>
            </Col>
        </Row>
}


export const ListaRicettaView: React.FC<{lista: Ricetta[]} & ColProps>= ({lista, ...colProps}) => {
    const [curr, setCurr] = React.useState(20);


    const items = React.useMemo (() => lista.slice(0,curr).map(r => 
        //@ts-ignore
        <Col {...colProps} key={r.id} >
            <RicettaView ricetta={r}/>
        </Col>
    ),[curr,lista, colProps]);
        
    const loadFunc = React.useCallback ( () => {
        setCurr(c=>c+20);
    },[]);


    return <InfiniteScroll
        className="row"
        pageStart={0}
        loadMore={loadFunc}
        hasMore={curr < lista.length}
    >
        {items} 
    </InfiniteScroll>
}