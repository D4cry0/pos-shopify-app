import { ResourcePicker } from "@shopify/app-bridge-react";
import { InlineError,
         TextField,
        } from "@shopify/polaris";

import { useCallback, useState, useEffect } from "react";

import '../styles.css';

export const ScannerPicker = ({ addProducts }) => {
    const [searchValue, setSearchValue] = useState( '' );

    const [selectedProduct, setSelectedProduct] = useState( null );

    const [showResourcePicker, setShowResourcePicker] = useState( false );
    const [showInError, setShowInError] = useState( false );
    const [msgInError, setInError] = useState( '' );

    const toggleResourcePicker = useCallback(
        () => {
            setShowResourcePicker( !showResourcePicker );
        },
        [ showResourcePicker ],
    );

    const toggleInError = useCallback(
        () => {
            setShowInError( !showInError );
        },
        [ showInError ],
    )
    

    const handleKeyDown = ( event ) => {
        if ( event.keyCode === 13 ) {
            toggleResourcePicker( true );  
        }
    }

    const handleProductSelect = ({ selection }) => {
        setSelectedProduct({
            id:             selection[0].id,
            images:         selection[0].images,
            title:          selection[0].title,
            variantId:      selection[0].variants[0].id,
            inventoryItem:  selection[0].variants[0].product.id,
            inventoryQty:   selection[0].variants[0].inventoryQuantity,
            qtyToBuy:       1,
            price:          selection[0].variants[0].price,
            sku:            selection[0].variants[0].sku,
        });
        
    };
    

    // TODO: Implementar el bloqueo para el teclado manual
    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    useEffect(() => {

        if( selectedProduct ){
            // TODO: Logica para validar la info

            if ( searchValue === selectedProduct.sku ){
                addProducts( selectedProduct );
                
            } else {
                setInError( 'Invalid item' );
                toggleInError( true );
            }
            
            setSelectedProduct( null );
            setSearchValue( '' );
            toggleResourcePicker( false );
        }

        return () => {
            // console.log('desmondado');
            // document.removeEventListener('keydown', handleKeyDownPicker);
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

    return (
        <>
        <ResourcePicker
            resourceType="Product"
            showVariants={false}
            selectMultiple={false}
            onCancel={ toggleResourcePicker }
            onSelection={ handleProductSelect }
            initialQuery={ searchValue }
            open={ showResourcePicker }
        />
        <div onKeyDown={ handleKeyDown }>
            <TextField
                label="Search Items"
                value={ searchValue }
                onChange={ handleSearchChange }
                placeholder="Search by SKU ..."
                helpText="Barcode Scanner"
                autoComplete="off"
            />
        </div>
        { showInError && <InlineError message={ msgInError } />}
        </>
    );
}
