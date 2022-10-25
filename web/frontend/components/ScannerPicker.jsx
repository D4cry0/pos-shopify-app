import { ResourcePicker } from "@shopify/app-bridge-react";
import { TextContainer, TextField } from "@shopify/polaris";
import { useCallback, useState, useEffect, useRef } from "react";



export const ScannerPicker = () => {
    const [searchValue, setSearchValue] = useState('');

    const [showResourcePicker, setShowResourcePicker] = useState(false);

    const rpicker = useRef();

    const toggleResourcePicker = useCallback(
        () => {
            setShowResourcePicker(!showResourcePicker);
        },
        [],
    );

    const onChange = useCallback (
        (value) => {
            setSearchValue(value);
            toggleResourcePicker(true);
        },
        [],
    )

    useEffect(() => {
        if( showResourcePicker ) {


            console.log('cambio sv');
        } else {
            console.log('borrar addevent');
        }

        return () => {
            
        }
    }, [showResourcePicker])
    
    

    return (
        <>
        { showResourcePicker && (
            <div ref={ rpicker }>
                <ResourcePicker
                    resourceType="Product"
                    showVariants={false}
                    selectMultiple={true}
                    onCancel={ toggleResourcePicker }
                    onSelection={ null }
                    initialQuery={ searchValue }
                    open
                />
            </div>
        )}
        <TextField
            label="Buscar productos"
            value=""
            onChange={ onChange }
            placeholder="Ingresa el SKU ..."
            helpText="Solo funciona con el lector Scanner"
            autoComplete="off"
        />
        <TextContainer>
            <p>Scan: { searchValue }</p>
        </TextContainer>
        </>
    );
}
