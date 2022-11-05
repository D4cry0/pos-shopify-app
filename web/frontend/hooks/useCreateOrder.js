import { useEffect, useState } from "react";

import { useField,
         useForm,
         useDynamicList } from '@shopify/react-form';

export const useCreateOrder = () => {
    
    const productFieldsFactory = ({
        id,
        image,
        title,
        variantId,
        inventoryItem,
        inventoryQty,
        qtyToBuy,
        price,
        sku,
    }) => {

        return [
            {
                id: id || '',
                image: image || {
                    originalSrc: '',
                    altText: '',
                },
                title: title || '',
                variantId: variantId || '',
                inventoryItem: inventoryItem || '',
                inventoryQty: inventoryQty || 0,
                qtyToBuy: qtyToBuy || 1,
                price: price || '',
                sku: sku || '',
            }
        ]
    }

    const cartList = useDynamicList( [], productFieldsFactory );

    const customerEmail = useField({
        value: '',
        validates: ( value ) => {
            if( value.length > 0 && !value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g) )
                return 'Invalid email address';
        }
    });

    const nip = useField({
        value: ''
    });

    const cash = useField({
        value: ''
    });

    const credit = useField({
        value: ''
    });

    const { submit,
            submitting,
            dirty,
            reset,
            submitErrors,
            makeClean 
    } = useForm({
        fields: {
            nip,
            cash,
            credit,
            customerEmail,
        },
        dynamicLists: {
            cartList
        },
        onSubmit: async (fieldValues) => {
            console.log(fieldValues);
            return { status: 'success' };
        },
    });
    
    
    const [ updating, setUpdating ] = useState( false );
    const [ orderTotal, setOrderTotal ] = useState( 0 );
    const [ cartItemCount, setCartItemCount ] = useState( 0 );
    
    const isCheckoutOk = () => {
        return dirty && typeof nip.value !== 'object' && nip.value.length == 6 && orderTotal > 0 && typeof cash.value !== 'object' && typeof credit.value !== 'object';
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
    
    const addProduct = ( newProduct ) => {
        cartList.addItem(newProduct);
        cash.reset();
        credit.reset();
        setUpdating( true );
    }
    
    const updateProduct = ( event ) => {
        
        // usar currentTarget siempre
        const [ index, op ] = event.currentTarget.id.split( "-" );
        
        const item = cartList.fields[index];
        
        const sum = item.qtyToBuy.value + ( op === 'plus' ? 1 : -1 );
        
        item.qtyToBuy.onChange( 
            ( sum >= item.inventoryQty.value ) 
            ? item.inventoryQty.value
            : ( sum <= 0 ? 1 : sum ) 
            );
            
            cash.onChange( {} );
            credit.onChange( {} );
            setUpdating( true );
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
            amount += parseFloat(item.qtyToBuy.value) * parseFloat(item.price.value);
            
        });

        if(cartList.fields.length < 1) reset();
        
        setCartItemCount( itemSum );
        setOrderTotal( amount );
        
        setUpdating( false );
        
    }, [updating]);
    

    
    // TODO: Implementar cuando el VAT no esta incluido
    // total = subtotal + vatValue
    // TODO: Acomodar el formatter para que quede global
    return {
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
        updateProduct,
        deleteProduct,
        resetForm,
        handleNip: nip.onChange,
        handleNipError: nip.setError,
        nipError: nip.error,
        handleCustomerEmail: customerEmail.onChange,
        handleCustomerEmailError: customerEmail.error,
        customerEmail: typeof customerEmail.value === 'object' ? '' : customerEmail.value,
        submit,
        submitting,
        isCheckoutOk,
        reset,
    }

}