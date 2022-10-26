import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button,
         ButtonGroup,
         Icon,
         InlineError,
         ResourceItem,
         ResourceList,
         Stack,
         TextContainer,
         TextField,
         TextStyle,
         Thumbnail, 
        } from "@shopify/polaris";
import {
         ListMajor,
        } from '@shopify/polaris-icons';
import { useCallback, useState, useEffect } from "react";

import '../styles.css';

export const ScannerPicker = () => {
    const [searchValue, setSearchValue] = useState('');
    const [productTQty, setProductTQty] = useState(0);

    const [selectedProduct, setSelectedProduct] = useState(null);
    // Retirar la lista de prouducts a otro componente
    const [isAProductList, setIsAProductList] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [showResourcePicker, setShowResourcePicker] = useState(false);
    const [showInError, setShowInError] = useState(false);
    const [msgInError, setInError] = useState('');

    const resourceName = {
        singular: 'producto',
        plural: 'productos',
    };

    const promotedBulkActions = [
        {
            content: 'Borrar productos',
            onAction: () => console.log('Todo: implement bulk delete'),
        }
      ];

    const toggleResourcePicker = useCallback(
        () => {
            setShowResourcePicker(!showResourcePicker);
        },
        [showResourcePicker],
    );

    const toggleInError = useCallback(
        () => {
            setShowInError(!showInError);
        },
        [showInError],
    )
    
    const toggleProductList = useCallback(
        () => {
            setIsAProductList(!isAProductList);
        },
        [isAProductList],
    )
    

    const handleKeyDown = ( event ) => {
        if (event.keyCode === 13) {
            toggleResourcePicker(true);  
        }
    }

    const handleProductSelect = ({ selection }) => {
        setSelectedProduct({
            id: selection[0].id,
            images: selection[0].images,
            title: selection[0].title,
            variantId: selection[0].variants[0].id,
            inventoryItem: selection[0].variants[0].product.id,
            inventoryQty: selection[0].variants[0].inventoryQuantity,
            qtyToBuy: 1,
            price: selection[0].variants[0].price,
            sku: selection[0].variants[0].sku,
        });
        
    };
    

    const handleChange = (value) => {
        setSearchValue(value);
    };

    const handleChangeQty = (event) => {
            // usar currentTarget siempre
            const [id, op] = event.currentTarget.id.split("-");

            const updatedProducts = products.map( item => {
                const sum = 0;

                if(item.id === id){
                    const sum = item.qtyToBuy + (op === 'plus' ? 1 : -1);
                    // TODO: Verificar el Inventario de la locacion
                    if(sum >= item.inventoryQty) return { ...item, qtyToBuy: item.inventoryQty};

                    return { ...item, qtyToBuy: (sum <= 0 ? 1 : sum) };
                }

                // esto para retornarlo sin cambios
                return item;
            });

            setProducts(updatedProducts);
    };
    

    useEffect(() => {

        if( selectedProduct ){
            // TODO: Logica para validar la info

            if (searchValue === selectedProduct.sku){
                setProducts([ ...products, selectedProduct]);
    
                console.log(products);
    
                setIsAProductList(true);
                
                setProductTQty(productTQty+1);
            } else {
                setInError('El producto no corresponde a la busqueda');
                toggleInError(true);
            }
            
            setSelectedProduct(null);
            toggleResourcePicker(false);
            setSearchValue('');
        }

        return () => {
            // console.log('desmondado');
            // document.removeEventListener('keydown', handleKeyDownPicker);
        }
    }, [selectedProduct]);

    useEffect(() => {
        const timer = setTimeout(() => {
            showInError && toggleInError(false);
        }, 3000 );
        
        return () => {
            clearTimeout(timer);
        }
    }, [showInError]);

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
                label="Buscar productos"
                value={ searchValue }
                onChange={ handleChange }
                placeholder="Ingresa el SKU ..."
                helpText="Solo funciona con el lector Scanner"
                autoComplete="off"
            />
        </div>
        { showInError && <InlineError message={ msgInError } />}
        {isAProductList && <ResourceList
            resourceName={resourceName}
            items={products}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            promotedBulkActions={promotedBulkActions}
        />}
        <TextContainer>
            <div className="cart-totalitems">
                <p>Total { productTQty > 1 ? "items" : "item"}: { productTQty }</p>
            </div>
        </TextContainer>
        </>
    );

    function renderItem(item) {
        const {id, images, title, qtyToBuy, price, sku} = item;
        const media = images[0] 
                ? <Thumbnail source={ images[0]?.originalSrc } alt={ images[0]?.altText } /> 
                : <Thumbnail source="" alt="" />;

        return (
            <ResourceItem
                id={id}
                media={media}
                name={title}
            >
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <Stack distribution="fillEvenly" alignment="center">
                    <Stack.Item>
                        <div>SKU: {sku}</div>
                        <div>${price}</div>
                    </Stack.Item>

                    <ButtonGroup>
                        <Button id={id+'-minus'} size="slim" onClick={handleChangeQty}>-</Button>
                        <Button size="slim" disabled="true">{qtyToBuy}</Button>
                        <Button id={id+'-plus'} size="slim" onClick={handleChangeQty}>+</Button>
                    </ButtonGroup>
                    
                    <div> ${(parseFloat(price)*qtyToBuy).toFixed(2)} </div>
                </Stack>
                
            </ResourceItem>
        );
    }
}
