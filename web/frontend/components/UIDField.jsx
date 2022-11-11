import { TextField } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';

export const UIDField = ({ staffUid, onStaffUidChange, onError, error, disabled }) => {

    let buff = '';
    const [ mask, setMask ] = useState( '' );

    const handleTextChange = useCallback(
      (newValue) => {
        
        // reset the delay
        if( newValue.length == 1 && buff.length == 6) buff='';

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
        onStaffUidChange( buff );
        setMask( '*'.repeat( buff.length ) );

      },
      [],
    );
    
    useEffect(() => {
        if( staffUid.length < 1 ) {
            setMask('');
        }
    }, [ staffUid ])
    

    return (
        <>
            <TextField 
                label='Staff UID'
                value={ mask } 
                onChange={ handleTextChange } 
                error= { error } 
                autoComplete='off'
                disabled={ disabled }
            />
        </>
    );
}
