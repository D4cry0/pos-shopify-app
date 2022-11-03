import { TextField } from '@shopify/polaris'

import { useEffect, useState } from 'react'


export const BothPaymentFields = ({ cash, setCashValue, credit, setCreditValue, orderTotal }) => {

    const handleCashChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCashValue( orderTotal - 1 );
            setCreditValue( '1' );
            return;
        }

        if( valueFloat < 0 || !value || !valueFloat ){
            setCashValue( '1' );
            setCreditValue( orderTotal-1 );
            return;
        }

        setCashValue( valueFloat );
        setCreditValue( (orderTotal - valueFloat).toString() );
    }

    const handleCreditChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCreditValue( orderTotal-1 );
            setCashValue( '1' );
            return;
        }

        if( valueFloat < 0 || !value || !valueFloat ){
            setCreditValue( '1' );
            setCashValue( orderTotal-1 );
            return;
        }

        setCreditValue( valueFloat );
        setCashValue( orderTotal - valueFloat );
    }

    // useEffect(() => {
    //     setCashField( cash );
    //     setCreditField( credit );
    // }, [isBothPayments]);
    

    return (
        <>
            <TextField 
                label='Cash'
                value={ cash }
                onChange={ handleCashChange }
                autoComplete='off'
            />
            <TextField 
                label='Credit'
                value={ credit }
                onChange={ handleCreditChange }
                autoComplete='off'
            /> 
        </>
    )
}
