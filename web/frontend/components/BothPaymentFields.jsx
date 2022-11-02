import { TextField } from "@shopify/polaris"
import { useEffect, useState } from "react"


export const BothPaymentFields = ({ isBothPayments, cash, credit, orderTotal }) => {

    const [ cashField, setCashField ] = useState( typeof cash.value === 'object'? 0 : cash.value );
    const [ creditField, setCreditField ] = useState( typeof credit.value === 'object'? 0 : credit.value );

    const handleCashChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCashField( orderTotal );
            cash.onChange( orderTotal.toString() );
            setCreditField( '0' );
            credit.onChange( '0' );
            return;
        }

        if( valueFloat < 0 || !value || !valueFloat ){
            setCashField( '0' );
            cash.onChange( '0' );
            setCreditField( orderTotal);
            credit.onChange( orderTotal.toString() );
            return;
        }

        setCashField( valueFloat );
        cash.onChange( value );
        setCreditField( orderTotal - valueFloat );
        credit.onChange( (orderTotal - valueFloat).toString() );
    }

    const handleCreditChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCreditField( orderTotal );
            credit.onChange( orderTotal.toString() );
            setCashField( '0' );
            cash.onChange( '0' );
            return;
        }

        if( valueFloat < 0 || !value || !valueFloat ){
            setCreditField( '0' );
            credit.onChange( '0' );
            setCashField( orderTotal );
            cash.onChange( orderTotal.toString() );
            return;
        }

        setCreditField( valueFloat );
        credit.onChange( value );
        setCashField( orderTotal - valueFloat );
        cash.onChange( (orderTotal - valueFloat).toString() );
    }

    useEffect(() => {
        setCashField( typeof cash.value === 'object'? 0 : cash.value );
        setCreditField( typeof credit.value === 'object'? 0 : credit.value );
    }, [isBothPayments]);
    

    return (
        <>
            {
                isBothPayments && <TextField 
                    disabled={ !isBothPayments }
                    label="Cash"
                    value={ cashField }
                    onChange={ handleCashChange }
                    placeholder="Cash"
                    autoComplete="off"
                />
            }

            {
                isBothPayments && <TextField 
                    label="Credit"
                    value={ creditField }
                    onChange={ handleCreditChange }
                    placeholder="Credit"
                    autoComplete="off"
                />
            }  
        </>
    )
}
