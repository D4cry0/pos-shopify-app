import { ResourcePicker } from '@shopify/app-bridge-react';
import { InlineError,
         TextField, } from '@shopify/polaris';

import { useCallback, useState, useEffect, useRef } from 'react';

import '../styles.css';

export const ScannerPicker = ({ addProduct, disabled }) => {
    const [ searchValue, setSearchValue ] = useState( '' );

    const [ selectedProduct, setSelectedProduct ] = useState( null );

    const [ showResourcePicker, setShowResourcePicker ] = useState( false );
    const [ showInError, setShowInError ] = useState( false );
    const [ msgInError, setInError ] = useState( '' );
    const [ discountAmount, setDiscountAmount ] = useState( 0 );

    const textFieldRef = useRef();

    const handleShowResourcePicker = useCallback(
        ( value ) => {
            setShowResourcePicker( value );
            if( !value ) {
                setSearchValue( '' );
                textFieldRef.current.focus();
            }
        },
        [ showResourcePicker ],
    );

    const toggleInError = useCallback(
        () => {
            setShowInError( !showInError );
        },
        [ showInError ],
    )
    
    let keyTimer;
    const handleKeyDown = ( event ) => {
        
        if( searchValue.length > 1 ){
            keyTimer = setTimeout(() => {
                handleShowResourcePicker( true );
            }, 400 );
        }

        // Key: Enter
        if ( event.keyCode === 13 ) {
            const buff = searchValue.split("'");

            if ( buff.length > 1 ){
                setSearchValue(buff[0]);

                // We split the barcode to apply individual discounts for damage articles
                // TODO: we need to useContext for this rule
                buff[1].slice(0, 3) === 'DMG' 
                    && setDiscountAmount( 
                        (parseFloat( buff[1].slice(3) ) / 100).toFixed(2)
                    );
            } else {
                setDiscountAmount( 0 );
            }
            clearTimeout( keyTimer );
            handleShowResourcePicker( true );
        }
        
        if ( event.keyCode === 17 ){
            keyTimer = setTimeout(() => {
                handleSearchChange( '' );
            }, 200 );
        }
    }

    const handlePaste = ( event ) => {
        event.preventDefault();
        handleSearchChange( '' );
        event.currentTarget.value = '';
    } 

    const handleFocus = ( event ) => {
        event.currentTarget.select();
    }

    const handleProductSelect = ({ selection }) => {


        // id: selection[0].id,
        setSelectedProduct({
            image:          {
                                originalSrc: selection[0].images[0]?.originalSrc || '', 
                                altText: selection[0].images[0]?.altText || ''
                            },
            title:          selection[0].title,
            variantId:      selection[0].variants[0].id,
            inventoryQty:   selection[0].variants[0].inventoryQuantity,
            qtyToBuy:       1,
            price:          selection[0].variants[0].price,
            sku:            selection[0].variants[0].sku,
            amountDiscount: discountAmount * parseFloat(selection[0].variants[0].price),
            inventoryItemId: selection[0].variants[0].inventoryItem.id,
        });
    };
    
    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    useEffect(async () => {

        if( selectedProduct ){
            // TODO: Logica para validar la info

            if ( searchValue.toUpperCase().normalize() === selectedProduct.sku.normalize() ){
                const err = await addProduct( selectedProduct );
                
                if( err ) {
                    setInError( err?.length > 2 ? err : 'Insufficient inventory' );
                    toggleInError( true );
                }

            } else {
                setInError( 'Invalid item' );
                toggleInError( true );
            }
            
            setSelectedProduct( null );
            setSearchValue( '' );
            
            handleShowResourcePicker( false );
        }

    }, [ selectedProduct ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            showInError && toggleInError( false );
        }, 3000 );
        
        return () => {
            clearTimeout( timer );
        }
    }, [ showInError ]);

    useEffect(() => {

        clearTimeout( keyTimer );
    
    }, [ showResourcePicker ]);
    
    return (
        <>
            <ResourcePicker
                resourceType='Product'
                showVariants={false}
                selectMultiple={false}
                onCancel={ () => handleShowResourcePicker( false ) }
                onSelection={ handleProductSelect }
                initialQuery={ searchValue }
                open={ showResourcePicker }
                showArchived={false}
            />
            <div 
                ref={ textFieldRef } 
                onKeyDown={ handleKeyDown } 
                onPaste={ handlePaste } 
                onDrop={ handlePaste }
            >
                <TextField
                    label='Search Items'
                    value={ searchValue }
                    onChange={ handleSearchChange }
                    placeholder='Search by SKU ...'
                    helpText='Barcode Scanner'
                    autoComplete='off'
                    onFocus={ handleFocus }
                    focused='true'
                    disabled={ disabled }
                />
            </div>
            { 
                showInError && <InlineError message={ msgInError } />
            }
        </>
    );
}
