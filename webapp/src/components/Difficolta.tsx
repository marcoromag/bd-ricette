import * as React from 'react';
import styles from './Difficolta.module.scss'


export const Difficolta : React.FC<{livello:number}> = ({livello}) => {
    return <div className={`${styles.contenitore} ${styles['sel'+(livello||0)]}`}>
        <div className={styles.l1}/>
        <div className={styles.l2}/>
        <div className={styles.l3}/>
        <div className={styles.l4}/>
        <div className={styles.l5}/>
    </div>
}