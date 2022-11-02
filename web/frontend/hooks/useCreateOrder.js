import { useEffect, useState } from "react";

import { useField,
         useForm,
         useDynamicList,
         notEmpty,
         lengthLessThan,
         positiveNumericString } from '@shopify/react-form';

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
    
    const itemCount = useField({
        value: 0
    });

    const orderAmount = useField({
        value: 0
    });

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

    
    const [ isBothPayments, setIsBothPayments ] = useState( false );
    const [ updating, setUpdating ] = useState( false );
    const [ orderTotal, setOrderTotal ] = useState( 0 );
    const [ cartItemCount, setCartItemCount ] = useState( 0 );
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    
    const handleCash = () => {
        cash.onChange( orderTotal.toString() );
        credit.onChange( '0' );
    }

    const handleCredit = () => {
        cash.onChange( '0' );
        credit.onChange( orderTotal.toString() );
    }

    const handleBoth = () => {
        setIsBothPayments( !isBothPayments );
    }

    const isCheckoutOk = () => {
        return dirty && typeof nip.value !== 'object' && orderTotal > 0;
        // return dirty && nip.value;
    }

    const addProduct = ( newProduct ) => {
        cartList.addItem(newProduct);
        setUpdating( true );
    }

    const updateProduct = ( event ) => {

        // usar currentTarget siempre
        const [ id, op ] = event.currentTarget.id.split( "-" );

        cartList.fields.some( item => {
            
            if( item.id.value === id ){
                const sum = item.qtyToBuy.value + ( op === 'plus' ? 1 : -1 );
                // TODO: Verificar el Inventario de la locacion
                item.qtyToBuy.onChange( 
                    ( sum >= item.inventoryQty.value ) 
                    ? item.inventoryQty.value
                    : ( sum <= 0 ? 1 : sum ) 
                );

                return true;
            }

            // esto para retornarlo sin cambios
            return false;
        });
        
        setUpdating( true );
    }

    const deleteProduct = ( index ) => {
        cartList.removeItem(index);
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
        cash,
        credit,
        cartList,
        cartItemCount,
        formatter,
        subTotalCart: formatter.format(orderTotal),
        vatCart: formatter.format((orderTotal*0.16)),
        totalCart: formatter.format(orderTotal),
        totalCartNumber: orderTotal,
        addProduct,
        updateProduct,
        deleteProduct,
        handleCash,
        handleCredit,
        handleBoth,
        isBothPayments,
        handleNip: nip.onChange,
        submit,
        submitting,
        isCheckoutOk,
        reset,
    }

}