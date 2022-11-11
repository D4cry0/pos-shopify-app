import { useCallback, useEffect, useState } from 'react';

import { useField,
         useForm,
         useDynamicList } from '@shopify/react-form';

import { useAuthenticatedFetch } from './useAuthenticatedFetch';

const REGEX_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g

export const useCreateOrder = () => {
    
    // Is needed to use the authenticated fetch
    const fetch = useAuthenticatedFetch();

    const productFieldsFactory = ({
        image,
        title,
        variantId,
        inventoryQty,
        qtyToBuy,
        price,
        sku,
        amountDiscount,
        inventoryItemId,
    }) => {

        return [
            {
                image: image || {
                    originalSrc: '',
                    altText: '',
                },
                title: title || '',
                variantId: variantId || '',
                inventoryQty: inventoryQty || 0,
                qtyToBuy: qtyToBuy || 1,
                price: price || '',
                sku: sku || '',
                amountDiscount: amountDiscount || 0,
                inventoryItemId: inventoryItemId || '',
            }
        ]
    }

    const cartList = useDynamicList( [], productFieldsFactory );

    // TODO: Encrypt email
    const customerEmail = useField({
        value: '',
        validates: ( value ) => {
            if( value.length > 0 && !value.match(REGEX_EMAIL) )
                return 'Invalid email address';
        }
    });

    const uid = useField({
        value: ''
    });

    const staff = useField({
        value: ''
    });

    const cash = useField({
        value: ''
    });

    const credit = useField({
        value: ''
    });

    const fulFillLocationId = useField({
        value: ''
    });

    const fulFillLocationName = useField({
        value: ''
    });

    const handleCreateNewOrder = async(fieldValues) => {
        console.log( fieldValues );

        // Use this partial JSON only for query purposes
        const lineItems = fieldValues.cartList.map( item => {
            return {
                variantId: item.variantId,
                quantity: item.qtyToBuy,
                amountDiscount: item.amountDiscount,
            };
        });

        const data = {
            staff: fieldValues.staff,
            cash: fieldValues.cash,
            credit: fieldValues.credit,
            customerEmail: fieldValues.customerEmail,
            lineItems: lineItems,
        }
        // Use this partial JSON only for query purposes

        const response = await fetch( '/api/posorder/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( data )
        });

        

        if( !response.ok ){

            const error = await response.json();
            return { 
                status: 'fail', 
                errors: [{ message: `Failed in: ${ JSON.parse(error.error).line }, contact admin` }] 
            };                    
        } 
        
        setOnSubmitSuccess( true );
        return { status: 'success' };
    }

    const { submit,
            submitting,
            dirty,
            reset,
            submitErrors,
            makeClean
    } = useForm({
        fields: {
            cash,
            credit,
            customerEmail,
            uid,
            staff,
            fulFillLocationId,
            fulFillLocationName,
        },
        dynamicLists: {
            cartList
        },
        onSubmit: handleCreateNewOrder,
    });
    
    const [ updating, setUpdating ] = useState( false );
    const [ orderTotal, setOrderTotal ] = useState( 0 );
    const [ cartItemCount, setCartItemCount ] = useState( 0 );
    const [ onSubmitSuccess, setOnSubmitSuccess ] = useState( false );

    const isCheckoutOk = () => {
        return dirty && typeof uid.value !== 'object' && uid.value.length == 6 && orderTotal > 0 && typeof cash.value !== 'object' && typeof credit.value !== 'object';
    }

    const setCashValue = ( numberValue ) => {
        cash.onChange( numberValue.toString() );
    }
    
    const onCash = () => {
        cash.onChange( orderTotal.toString() );
        credit.onChange( '0' );
    }
    
    const setCreditValue = ( numberValue ) => {
        credit.onChange( numberValue.toString() );
    }

    const onCredit = () => {
        cash.onChange( '0' );
        credit.onChange( orderTotal.toString() );
    }

    const onBoth = () => {
        cash.onChange( (orderTotal-1).toString() );
        credit.onChange( '1' );
    }
    
    const addProduct = async ( newProduct ) => {

        /* 

        Product doesnt exists in list
        Product exists in list with same discount (even 0 discount)
        Product exists with different discount
        
        */
        const response = await fetch( '/api/inventory/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inventoryItemId: newProduct.inventoryItemId,
                fulFillLocationId: fulFillLocationId.value,
            }),
        });

        const data = await response.json();

        // Check inventory qty vs all the same items in cart
        let foundProduct = null;
        let countItem = 0;
        cartList.fields.forEach( item => {
            if( item.sku.value === newProduct.sku ){
                countItem += item.qtyToBuy.value;
                if( item.amountDiscount.value == newProduct.amountDiscount ){
                    foundProduct = item;
                }
            }
        });

        console.log('found...',foundProduct);
        console.log('new...',newProduct);
        console.log('count...',countItem);
        
        if( response.ok ){
            console.log('datainv...', data.inventoryLevel);
            
            if( data.inventoryLevel < countItem+1 ) return true;
            
            // No undefined
            if( foundProduct && newProduct.amountDiscount == foundProduct.amountDiscount.value ) {
                foundProduct.inventoryQty.onChange( data.inventoryLevel );
                
                foundProduct.qtyToBuy.onChange( foundProduct.qtyToBuy.value+1 );
    
            } else {
                cartList.addItem(newProduct);
            }

        } else {   
            return data.error;
        }

        cash.reset();
        credit.reset();
        setUpdating( true );
        // No error
        return false;
    }
    
    const deleteProduct = ( index ) => {
        cartList.removeItem(index);
        cash.reset();
        credit.reset();
        setUpdating( true );
    }
    
    const resetForm = () => {
        reset();
        setUpdating( true );
    }
    
    useEffect(() => {
        let amount = 0;
        let itemSum = 0;
        
        cartList.fields.forEach( item => {
            
            itemSum += item.qtyToBuy.value;
            amount += parseFloat(item.qtyToBuy.value) * ( parseFloat(item.price.value) - item.amountDiscount.value );
            
        });

        if(cartList.fields.length < 1) reset();
        
        setCartItemCount( itemSum );
        setOrderTotal( amount );
        
        setUpdating( false );
        
    }, [ updating ]);
    
    useEffect(() => {
        
        makeClean();
        // TODO: dudar de este updating
        setUpdating( true );

    }, [ onSubmitSuccess ]);

    useEffect( async() => {

        if( uid.value.length > 5 ){
            const response = await fetch( '/api/staff/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: uid.value,
                })
            });

            const data = await response.json();
            if ( response.ok ){
                staff.onChange( data.name );
                fulFillLocationId.onChange( data.fulFillLocationId );
                fulFillLocationName.onChange( data.fulFillLocationName );
                uid.setError( '' );
            } else {
                reset();
                uid.setError( data.error );
            }
                
        }
        
    }, [ uid ])
    
    
    // TODO: Implementar cuando el VAT no esta incluido
    // total = subtotal + vatValue
    // TODO: Acomodar el formatter para que quede global
    return {
        retailLocation: typeof fulFillLocationName.value === 'object' 
                                ? ''
                                : fulFillLocationName.value,

        cashVal: typeof cash.value === 'object' ? '0' : cash.value,
        creditVal: typeof credit.value === 'object' ? '0' : credit.value,
        setCashValue,
        onCash,
        setCreditValue,
        onCredit,
        onBoth,
        cartList: cartList.fields,
        showCartList: cartList.dirty, 
        cartItemCount,
        subTotalCart: orderTotal,
        vatCart: orderTotal*0.16,
        totalCart: orderTotal,
        addProduct,
        deleteProduct,
        resetForm,
        staffUid: typeof uid.value === 'object' ? '' : uid.value,
        handleStaffUid: uid.onChange,
        handleStaffUidError: uid.setError,
        staffUidError: uid.error,
        handleCustomerEmail: customerEmail.onChange,
        handleCustomerEmailError: customerEmail.error,
        customerEmail: typeof customerEmail.value === 'object' ? '' : customerEmail.value,
        submit,
        submitting,
        submitErrors,
        isCheckoutOk,
    }

}