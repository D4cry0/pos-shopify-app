import { ResourcePicker } from "@shopify/app-bridge-react";
import { TextContainer, TextField } from "@shopify/polaris";
import { useCallback, useState, useEffect, useRef } from "react";



export const ScannerPicker = () => {
    const [searchValue, setSearchValue] = useState('');

    const [showResourcePicker, setShowResourcePicker] = useState(false);

    const toggleResourcePicker = useCallback(
        () => {
            setShowResourcePicker(!showResourcePicker);
        },
        [showResourcePicker],
    );

    const onChange = useCallback (
        (value) => {
            setSearchValue(value);
            toggleResourcePicker(true);
        },
        [],
    )

    useEffect(() => {
        const handleKeyPress = (event) => {
            
        }

        return () => {
            
        }
    }, [searchValue])
    
    

    return (
        <>
        { showResourcePicker && (
            
                <ResourcePicker
                    resourceType="Product"
                    showVariants={false}
                    selectMultiple={true}
                    onCancel={ toggleResourcePicker }
                    onSelection={ null }
                    initialQuery={ searchValue }
                    open
                />
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
