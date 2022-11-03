import { TextField } from '@shopify/polaris'

import { useState, useCallback } from 'react';

export const PassField = ({ label, setNip }) => {

    let buff = '';
    const [mask, setMask] = useState('');

    const handleTextChange = useCallback(
      (newValue) => {
        
        if( buff.length > newValue.length ){
            buff = buff.slice( 0, buff.length-1 );
        } else {
            buff += newValue[ newValue.length-1 ];
        }
        setNip(parseInt(buff));
        setMask( '*'.repeat(buff.length) );
      },
      [],
    );

    return (
        <>
            <TextField 
                label={label} 
                value={ mask } 
                onChange={ handleTextChange } 
                autoComplete='off'
            />
        </>
    );
}
