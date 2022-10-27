import { Button,
         ButtonGroup,
         ResourceItem,
         ResourceList,
         Stack,
         TextContainer,
         TextStyle,
         Thumbnail } from "@shopify/polaris"

import { useCallback,
         useEffect,
         useState } from "react"


export const ProductList = ({ products, updateProducts, currencyFormat }) => {

    // Control Data
    const [ selectedItems, setSelectedItems ] = useState( [] );
    
    // Display Data
    const [ isProductListActive, setIsProductListActive ] = useState( false );
    const [ productTQty, setProductTQty ] = useState( 0 );


    const resourceName = {
        singular: 'item',
        plural: 'items',
    };

    const promotedBulkActions = [
        {
            content: 'Delete',
            onAction: () => console.log( 'Todo: implement bulk delete' ),
        }
    ];

    const toggleProductList = useCallback(
        () => {
            setIsProductListActive( !isProductListActive );
        },
        [ isProductListActive ],
    )

    const updateProductCount = () => {
        let sum = 0;
        products.map( item => {
            sum += item.qtyToBuy;
        });
        setProductTQty( sum );
    }

    const handleChangeQty = ( event ) => {
        // usar currentTarget siempre
        const [ id, op ] = event.currentTarget.id.split( "-" );

        const updatedProducts = products.map( item => {
            
            if( item.id === id ){
                const sum = item.qtyToBuy + ( op === 'plus' ? 1 : -1 );
                // TODO: Verificar el Inventario de la locacion
                if( sum >= item.inventoryQty ) return { ...item, qtyToBuy: item.inventoryQty };

                return { ...item, qtyToBuy: ( sum <= 0 ? 1 : sum ) };
            }

            // esto para retornarlo sin cambios
            return item;
        });

        updateProducts( updatedProducts );
    };


    useEffect(() => {
      
        setIsProductListActive( products.length > 0 );

        updateProductCount();
        
        return () => {
            
        }
    }, [products])
    
    

    return (
        
        <>
            {isProductListActive && <ResourceList
                resourceName={ resourceName }
                items={ products }
                renderItem={ renderItem }
                selectedItems={ selectedItems }
                onSelectionChange={ setSelectedItems }
                promotedBulkActions={ promotedBulkActions }
            />}
            <TextContainer>
                <div className="cart-totalitems">
                    <p>Total { productTQty > 1 ? "items" : "item" }: { productTQty }</p>
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
                        <div>SKU: { sku }</div>
                        <div>{ currencyFormat.format(price) }</div>
                    </Stack.Item>

                    <ButtonGroup>
                        <Button id={id+'-minus'} size="slim" onClick={ handleChangeQty }>-</Button>
                        <Button size="slim" disabled="true">{ qtyToBuy }</Button>
                        <Button id={id+'-plus'} size="slim" onClick={ handleChangeQty }>+</Button>
                    </ButtonGroup>
                    
                    <div> { currencyFormat.format((parseFloat(price)*qtyToBuy)) } </div>
                </Stack>
                
            </ResourceItem>
        );
    }
}
