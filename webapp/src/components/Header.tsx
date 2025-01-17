import * as React from 'react';
import { useLogin, useConfig } from '../GlobalContext';
import { Nav, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Collapse } from 'reactstrap';
import { RoutedDropdownItem, RoutedNavLink } from './RoutedNav';
import LoginAPI from '../api/LoginAPI';
import logo from './logo-verdezafferano.svg';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';


export const Header : React.FC = () => {
    const [login,setLogin] = useLogin();
    const {tipologie} = useConfig();
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const logoutClick = React.useCallback(  ()=>{    
      setLogin({isLoggedIn:false});
      LoginAPI.logout(); 
    },[setLogin])

    const isCapo = login.isLoggedIn && login.user && login.user.tipo === 'caporedattore';
    const isRedattore = login.isLoggedIn && login.user && (login.user.tipo === 'redattore');
    const isAutore = login.isLoggedIn && login.user && login.user.tipo === 'autore';

    return <Navbar color="light" light expand="sm" className="col">
        <NavbarBrand>
          <Link to="/"><img alt="logo" src={logo} className={styles.logo}/></Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
       <Collapse isOpen={isOpen} navbar className={styles.menubar}>
          <Nav className="mr-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>Ricette</DropdownToggle>
              <DropdownMenu left>
                {tipologie.map (t => <RoutedDropdownItem href={`/public/ricette/per-tipologia/${t.id}`}>{t.nome}</RoutedDropdownItem>)}
              </DropdownMenu>
            </UncontrolledDropdown>
            <RoutedNavLink href="/public/ricette/ricerca">Ricerca</RoutedNavLink>
            {isAutore && <RoutedNavLink href="/autore/nuova-ricetta">Nuova ricetta</RoutedNavLink>}
            {(isRedattore || isCapo)&& 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>Funzioni redazione</DropdownToggle>
              <DropdownMenu left>
                {isRedattore && <RoutedDropdownItem href="/redazione/redattore">Cassetto Approvazioni</RoutedDropdownItem>}
                {isCapo && <RoutedDropdownItem href="/redazione/caporedattore">Cassetto Pubblicazioni</RoutedDropdownItem>}
                {isCapo && <RoutedDropdownItem href="/redazione/stat-approvazioni">Statistiche approvazioni</RoutedDropdownItem>}
              </DropdownMenu>
            </UncontrolledDropdown>
            }
          </Nav>
          {login.isLoggedIn && 
          <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
            <i className="far fa-user-circle mr-2"></i>{login.user!.nome} {login.user!.cognome}
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