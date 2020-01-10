import * as React from 'react'
import Autosuggest, { SuggestionsFetchRequestedParams, ChangeEvent, SuggestionSelectedEventData, InputProps } from 'react-autosuggest';
import { useConfig } from '../GlobalContext';
import { Ingrediente, IngredienteParziale } from '../api/ConfigAPI';
import { Row, Col, Badge } from 'reactstrap';
import theme from './SelezionaIngrediente.module.css'

const myTheme: any = {
    suggestionsContainer: `dropdown-menu ${theme.suggestionsContainer}`,
    suggestionsContainerOpen: 'show',
    suggestionsList: theme.suggestionsList,
    suggestion: 'dropdown-item',
    container: theme.container,
    input: 'form-control'
}

const getSuggestionValue = (suggestion:IngredienteParziale) => suggestion.nome;

const renderSuggestion = (suggestion: Ingrediente) => (
    <div key={suggestion.id}>
      {suggestion.nome}
    </div>
);

export interface SelezionaIngredienteProps {
    ingrediente?: IngredienteParziale
    onSelezioneIngrediente?: (ingrediente: Ingrediente | undefined) => void
    onParziale?: (nome: string) => void
}

export const SelezionaIngrediente : React.FC<SelezionaIngredienteProps> = ({ingrediente, onSelezioneIngrediente, onParziale}) => {
    const {ingredienti} = useConfig();
    const [selezione,setSelezione] = React.useState<Ingrediente>();
    const [value,setValue] = React.useState<string>('');
    const [suggestions,setSuggestions] = React.useState<Ingrediente[]>([]);
    const getSuggestions = React.useCallback ((value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : ingredienti.filter(v =>
          v.nome.toLowerCase().slice(0, inputLength) === inputValue
        );
    },[ingredienti]);

    React.useEffect( () => {
        if (!ingrediente) {
            setSelezione(undefined);
            setValue('');
        }
        setSelezione((ingrediente && ingrediente.id) ? ingrediente as Ingrediente: undefined);
        setValue(ingrediente ? getSuggestionValue(ingrediente): '');

    },[ingrediente])

    const onSuggestionsFetchRequested = React.useCallback ( (req: SuggestionsFetchRequestedParams) => {
        setSuggestions(getSuggestions(req.value));
    },[getSuggestions])

    const onSuggestionsClearRequested = React.useCallback ( () => {
        setSuggestions([]);
    },[])

    const onChange = React.useCallback ((event: React.FormEvent<any>, params: ChangeEvent) => {
        setValue(params.newValue);
        setSelezione(undefined);
        onSelezioneIngrediente && onSelezioneIngrediente(undefined);
    },[onSelezioneIngrediente])

    const onSuggestionSelected = React.useCallback ( (event: React.FormEvent<any>,
        data: SuggestionSelectedEventData<Ingrediente>) => {
        setSelezione(data.suggestion);
        onSelezioneIngrediente && onSelezioneIngrediente(data.suggestion);
    },[onSelezioneIngrediente])

    const inputProps = React.useMemo<InputProps<Ingrediente>> ( () => ({
        placeholder:'ingrediente',
        value: value,
        onChange: onChange,
        
        onBlur: (e,p) => {
            if (selezione && getSuggestionValue(selezione) === value) return;
            const newIng = ingredienti.find(i => i.nome === value);
            if (newIng) {
                setSelezione(newIng);
                onSelezioneIngrediente && onSelezioneIngrediente(newIng);
            } else {
                onParziale && onParziale(e.target.value);
            }

        }
    }), [value, onChange, selezione, onParziale, ingredienti,onSelezioneIngrediente])


    return <Autosuggest
        theme={myTheme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps= {inputProps}
        />

}

export interface SelezionaListaIngredientiProps {
    onChange?: (lista:Ingrediente[])  => void;
}
export const SelezionaListaIngredienti : React.FC<SelezionaListaIngredientiProps>= ({onChange}) => {
    const [lista, setLista] = React.useState<Ingrediente[]>([]);

    const onSelezioneIngrediente = React.useCallback( (ingrediente?: Ingrediente) => {
        ingrediente && setLista (l => {
            if (l.includes(ingrediente)) 
                return l;
            const data = [...l, ingrediente];
            onChange && onChange(data);
            return data;
        })
    },[onChange])

    const cancellaIngrediente = React.useCallback( (ingrediente?: Ingrediente) => {
        setLista (l => l.filter(i => i !== ingrediente));
    },[])
    
    return <Row>
        <Col xs="12">
            <SelezionaIngrediente onSelezioneIngrediente={onSelezioneIngrediente}/>
        </Col>
        <Col xs="12">
            {lista.map(i => <Badge pill className="p-2 mr-2 mt-2" onClick={()=>cancellaIngrediente(i)}>{i.nome}<i className="fas fa-minus-circle ml-2"/></Badge>)}
        </Col>
    </Row>
}