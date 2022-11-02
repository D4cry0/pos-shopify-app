import { TextField } from "@shopify/polaris"
import { useState } from "react"


export const BothPaymentFields = ({ isBothPayments, cash, credit, orderTotal }) => {

    const [ cashField, setCashField ] = useState( typeof cash.value === 'object'? 0 : cash.value );
    const [ creditField, setCreditField ] = useState( typeof credit.value === 'object'? 0 : credit.value );

    const handleCashChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCashField( orderTotal );
            cash.onChange( orderTotal );
            setCreditField( '0' );
            credit.onChange( '0' );
            return;
        }

        if( valueFloat < 0 || !value ){
            setCashField( '0' );
            cash.onChange( '0' );
            setCreditField( orderTotal);
            credit.onChange( orderTotal );
            return;
        }

        setCashField( valueFloat );
        cash.onChange( valueFloat );
        setCreditField( orderTotal - valueFloat );
        credit.onChange( orderTotal - valueFloat );
    }

    const handleCreditChange = ( value ) => {

        const valueFloat = parseFloat(value);

        if( valueFloat > orderTotal ){
            setCreditField( orderTotal );
            credit.onChange( orderTotal );
            setCashField( '0' );
            cash.onChange( '0' );
            return;
        }

        if( valueFloat < 0 || !value  ){
            setCreditField( '0' );
            credit.onChange( '0' );
            setCashField( orderTotal );
            cash.onChange( orderTotal );
            return;
        }

        setCreditField( value );
        credit.onChange( value );
        setCashField( orderTotal - valueFloat );
        cash.onChange( orderTotal - valueFloat );
    }

    

    return (
        <>
            {
                isBothPayments && <TextField 
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
