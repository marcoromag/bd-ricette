import * as React from 'react';
import { useLogin, useConfig } from '../GlobalContext';
import { Nav, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Collapse } from 'reactstrap';
import { RoutedDropdownItem } from './RoutedNav';
import LoginAPI from '../api/LoginAPI';
import logo from './logo-verdezafferano.svg';
import styles from './Header.module.scss';


export const Header : React.FC = () => {
    const [login,setLogin] = useLogin();
    const {tipologie} = useConfig();
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const logoutClick = React.useCallback( async ()=>{    
        try {
            await LoginAPI.logout();
        } finally 
        {
            setLogin({isLoggedIn:false});
        }
    },[setLogin])

    const isAdmin = login.isLoggedIn && login.user && login.user.tipo === 'DIRIGENTE';
    const isOper = login.isLoggedIn && login.user;

    return <Navbar color="light" light expand="md" sticky="top">
        <NavbarBrand>
          <img src={logo} className={styles.logo}/>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
       <Collapse isOpen={isOpen} navbar className={styles.menubar}>
          <Nav className="mr-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>Ricette</DropdownToggle>
              <DropdownMenu left>
                {tipologie.map (t => <RoutedDropdownItem href={`/tipologia/${t.id}`}>{t.nome}</RoutedDropdownItem>)}
              </DropdownMenu>
            </UncontrolledDropdown>
           {isOper && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Cliente
              </DropdownToggle>
              <DropdownMenu left>
                <RoutedDropdownItem href="/nuovo-cliente">Nuovo cliente</RoutedDropdownItem>
                <DropdownItem divider/>
                <RoutedDropdownItem href="/ricerca/cliente">Ricerca cliente</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
            {isOper && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Noleggio
              </DropdownToggle>
              <DropdownMenu left>
                <RoutedDropdownItem href="/prenotazione">Prenota un video</RoutedDropdownItem>
                <DropdownItem divider/>
                <RoutedDropdownItem href="/noleggio/attiva">Crea contratto di noleggio</RoutedDropdownItem>
                <DropdownItem divider/>
                <RoutedDropdownItem href="/noleggio/termina">Termina contratto di noleggio</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
            {isAdmin && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Batch</DropdownToggle>
              <DropdownMenu left>
                <RoutedDropdownItem href="/batch-carico">Carico</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/batch-scarico">Scarico</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/batch">Lista esecuzioni batch</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
            {isAdmin && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Statistiche</DropdownToggle>
              <DropdownMenu left>
                <RoutedDropdownItem href="/statistiche/dipendente">Per dipendente</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/statistiche/punto-vendita">Per tutti i punti vendita</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
          </Nav>
          {isOper && 
          <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
            <i className="far fa-user-circle"></i>{login.user!.nome} {login.user!.cognome}
            </DropdownToggle>
            <DropdownMenu right>
            <DropdownItem onClick={logoutClick}>Log out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </Nav>
          }
        </Collapse>
      </Navbar>
}