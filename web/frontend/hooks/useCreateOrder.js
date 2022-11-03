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

    const nip = useField({
        value: 0
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

    const isCheckoutOk = () => {
        return dirty && typeof nip.value !== 'object' && orderTotal > 0 && typeof cash.value !== 'object' && typeof credit.value !== 'object';
        // return dirty && nip.value;
    }

    const addProduct = ( newProduct ) => {
        cartList.addItem(newProduct);
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
        cash.onChange( {} );
        credit.onChange( {} );
        setUpdating( true );
    }

    const resetForm = () => {
        cartList.reset();
        cash.onChange( {} );
        credit.onChange( {} );
        nip.onChange( {} );
        setUpdating( true );
    }

    useEffect(() => {
        let amount = 0;
        let itemSum = 0;

        cartList.fields.forEach( item => {

            itemSum += item.qtyToBuy.value;
            amount += parseFloat(item.qtyToBuy.value) * parseFloat(item.price.value);

        });
        
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
        submit,
        submitting,
        isCheckoutOk,
        reset,
    }

}