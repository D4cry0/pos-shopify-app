import { TextField } from "@shopify/polaris"

import { useState, useCallback } from 'react';

export const PassField = ({ label }) => {

    let buff = '';
    const [value, setValue] = useState('');

    const handleTextChange = useCallback(
      (newValue) => {
        if( buff.length > newValue.length ){
            buff = buff.slice( 0, buff.length-1 );
        } else {
            buff += newValue[ newValue.length-1 ];
        }
        setValue( '*'.repeat(buff.length) );
      },
      [],
    );

    return (
        <>
            <TextField 
                label={label} 
                placeholder="****" 
                value={ value } 
                onChange={ handleTextChange } 
                autoComplete="off"
            />
        </>
    );
}
