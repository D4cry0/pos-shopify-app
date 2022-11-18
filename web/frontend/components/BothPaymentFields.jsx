import { TextField } from '@shopify/polaris';

export const BothPaymentFields = ({ cash, setCashValue, credit, setCreditValue, orderTotal }) => {

    const handleFocus = ( event ) => {
        event.currentTarget.select();
    }

    const handleCashChange = ( value ) => {

        const valueFloat = parseFloat(value);
        const roundUpAdjust = ( orderTotal - orderTotal.toFixed() ) < 0 ? -0.5 : 0;
        const decimals = parseFloat( ( orderTotal - ( orderTotal + roundUpAdjust ).toFixed() ).toFixed(2) );
        
        if( valueFloat >= orderTotal - decimals ){
            setCashValue( ( orderTotal + roundUpAdjust - 1 ).toFixed() );
            setCreditValue( 1 + decimals );
            return;
        }
        
        if( valueFloat < 0 || !value || !valueFloat ){
            setCashValue( '1' );
            setCreditValue( orderTotal - 1 );
            return;
        }
        
        setCashValue( valueFloat );
        setCreditValue( (orderTotal - valueFloat).toFixed(2) );
    }
    
    const handleCreditChange = ( value ) => {
        
        const valueFloat = parseFloat(value);
        const roundUpAdjust = ( orderTotal - orderTotal.toFixed() ) < 0 ? -0.5 : 0;
        const decimals = parseFloat( ( orderTotal - ( orderTotal + roundUpAdjust ).toFixed() ).toFixed(2) );

        if( valueFloat > orderTotal ){
            setCreditValue( orderTotal-1 );
            setCashValue( '1' );
            return;
        }

        if( valueFloat < 0 || !value || !valueFloat ){
            setCreditValue( 1 + decimals );
            setCashValue( orderTotal - 1 - decimals );
            return;
        }

        setCreditValue( valueFloat );
        setCashValue( (orderTotal - valueFloat - decimals) );

    }

    return (
        <>
            <TextField 
                label='Cash'
                value={ cash }
                onChange={ handleCashChange }
                onFocus={ handleFocus }
                autoComplete='off'
            />
            <TextField 
                label='Credit'
                value={ credit }
                autoComplete='off'
            /> 
        </>
    )
}
