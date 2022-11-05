import { TextField } from '@shopify/polaris'

import { useState, useCallback } from 'react';

export const NIPField = ({ onChange, onError, error }) => {

    let buff = '';
    const [mask, setMask] = useState('');

    const handleTextChange = useCallback(
      (newValue) => {
        
        if( buff.length > newValue.length ){
            buff = newValue.length < 1 ? '' : buff.slice( 0, buff.length-1 );
        } else { 
            const digit = newValue[ newValue.length-1 ];
            if( buff.length > 5 ) return;

            if( !Number.isInteger( parseInt( digit ) ) ) {
                onError( 'Only numbers' );
                return;
            }

            buff += digit;
        }

        onError( '' );
        onChange( buff );
        setMask( '*'.repeat( buff.length ) );

      },
      [],
    );

    return (
        <>
            <TextField 
                label='NIP'
                value={ mask } 
                onChange={ handleTextChange } 
                error= { error } 
                autoComplete='off'
            />
        </>
    );
}
