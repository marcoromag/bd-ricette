import * as React from 'react'
import InputRange, { InputRangeProps } from 'react-input-range'

export const Slider : React.FC<InputRangeProps> = ({value,onChange,...props}) => {
    const [editingValue, setEditingValue] = React.useState(value);

    React.useEffect( () => {
        setEditingValue(value)
    },[value])

    return <InputRange {...props} value={editingValue} onChange={setEditingValue} onChangeComplete={onChange} />


} 