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
        [showResourcePicker],
    );

    const handleKeyDown = ( event ) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            toggleResourcePicker(true);
            
        }
    }

    const handleKeyDownPicker = ( event ) => {
        event.preventDefault();
        console.log(event.target);
        console.log('Block key');
    }

    const handleChange = useCallback (
        (value) => {
            setSearchValue(value);
        },
        [],
    );

    useEffect(() => {
        
        
        if( showResourcePicker ) {

            console.log('cambio sv');
            setTimeout(function(){
                document.addEventListener('keydown', handleKeyDownPicker);
            }, 30);
            console.log(rpicker.current);
            console.log(document.querySelector("input[type=text]"));
            console.log(rpicker.current.querySelector("input[type=text]")?.value);
        } else {
            console.log('borrar addevent');
            setSearchValue('');
            // document.removeEventListener('keydown', handleKeyDownPicker);
        }

        return () => {
            console.log('desmondado');
            document.removeEventListener('keydown', handleKeyDownPicker);
        }
    }, [showResourcePicker]);
    
    

    return (
        <>
        <ResourcePicker
                    resourceType="Product"
                    showVariants={false}
                    selectMultiple={true}
                    onCancel={ toggleResourcePicker }
                    onSelection={ toggleResourcePicker }
                    initialQuery={ searchValue }
                    open={ showResourcePicker }
                />
        { showResourcePicker && (
            <div ref={ rpicker }>
                
            </div>
        )}
        <div onKeyDown={ handleKeyDown }>
            <TextField
                label="Buscar productos"
                value={ searchValue }
                onChange={ handleChange }
                placeholder="Ingresa el SKU ..."
                helpText="Solo funciona con el lector Scanner"
                autoComplete="off"
            />
        </div>
        <TextContainer>
            <p>Scan: { searchValue }</p>
        </TextContainer>
        </>
    );
}
