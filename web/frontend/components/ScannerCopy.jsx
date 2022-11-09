import { ResourcePicker } from "@shopify/app-bridge-react";
import { InlineError,
         TextField,
        } from "@shopify/polaris";

import { useCallback, useState, useEffect, useRef } from "react";

import '../styles.css';

export const ScannerPicker = ({ addProduct }) => {
    const [searchValue, setSearchValue] = useState( '' );

    const [selectedProduct, setSelectedProduct] = useState( null );

    const [showResourcePicker, setShowResourcePicker] = useState( false );
    const [showInError, setShowInError] = useState( false );
    const [msgInError, setInError] = useState( '' );

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

        if ( event.keyCode === 13 ) {
            handleShowResourcePicker( true );
            clearTimeout( keyTimer );
        }
    }

    const handleFocus = ( event ) => {
        event.currentTarget.select();
    }

    const handleProductSelect = ({ selection }) => {
        setSelectedProduct({
            id:             selection[0].id,
            image:          {
                                originalSrc: selection[0].images[0]?.originalSrc || '', 
                                altText: selection[0].images[0]?.altText || ''
                            },
            title:          selection[0].title,
            variantId:      selection[0].variants[0].id,
            inventoryItem:  selection[0].variants[0].product.id,
            inventoryQty:   selection[0].variants[0].inventoryQuantity,
            qtyToBuy:       1,
            price:          selection[0].variants[0].price,
            sku:            selection[0].variants[0].sku,
        });
        
    };
    
    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    useEffect(() => {

        if( selectedProduct ){
            // TODO: Logica para validar la info

            if ( searchValue.toUpperCase().normalize() === selectedProduct.sku.normalize() ){
                addProduct( selectedProduct );
                
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
    
    }, [showResourcePicker]);
    
    return (
        <>
            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                selectMultiple={false}
                onCancel={ () => handleShowResourcePicker( false ) }
                onSelection={ handleProductSelect }
                initialQuery={ searchValue }
                open={ showResourcePicker }
            />
            <div ref={ textFieldRef } onKeyDown={ handleKeyDown }>
                <TextField
                    label="Search Items"
                    value={ searchValue }
                    onChange={ handleSearchChange }
                    placeholder="Search by SKU ..."
                    helpText="Barcode Scanner"
                    autoComplete="off"
                    onFocus={ handleFocus }
                    focused='true'
                />
            </div>
            { showInError && <InlineError message={ msgInError } />}
        </>
    );
}