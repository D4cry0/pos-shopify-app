import { Stack,
         TextField,
         TextStyle, 
         Thumbnail} from "@shopify/polaris"
import { useEffect } from "react";



export const ProductListItem = ({ product, updateList }) => {


    const {id, images, title, qtyToBuy, price, sku} = product;

    const media = images[0] 
                ? <Thumbnail source={ images[0]?.originalSrc } alt={ images[0]?.altText } /> 
                : <Thumbnail source="" alt="" />;

    useEffect(() => {
        console.log("EN el item");
        return () => {
        
        }
    }, [])
    

    return (
        <>
            <Stack alignment="center">
                <Stack.Item>
                    <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                    {media}

                </Stack.Item>
                <Stack alignment="center" >
                    <Stack.Item alignment="center">
                        
                    </Stack.Item>
                    <div>SKU: {sku}</div>
                        <TextField 
                            id={id}
                            label=""
                            type="number"
                            value={qtyToBuy}
                            onChange={ updateList }
                            autoComplete="off"
                        />
                    <div>${price} MXN</div>
                    
                </Stack>
            </Stack>
        </>
    )
}
