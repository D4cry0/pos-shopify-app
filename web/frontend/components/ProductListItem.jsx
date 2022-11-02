import { Button,
         ButtonGroup,
         ResourceItem,
         Stack,
         TextStyle, 
         Thumbnail} from "@shopify/polaris"
import { PlusMinor,
         MinusMinor,
         CircleCancelMajor } from '@shopify/polaris-icons';         

export const ProductListItem = ({ field, index, updateProduct, deleteProduct, currencyFormat }) => {

    const { id, image, title, qtyToBuy, price, sku } = field;

    const media = image.value 
            ? <Thumbnail source={ image.value?.originalSrc } alt={ image.value?.altText } size='large'/> 
            : <Thumbnail source='' alt='' />;

    return (
        <div key={ id.value } style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Stack distribution="fillEvenly" alignment="center">
                <Stack.Item>
                    <h3>
                        <TextStyle variation="strong">{ title.value }</TextStyle>
                    </h3>
                    { media }
                </Stack.Item>

                <Stack.Item >               
                        <p>SKU: { sku.value }</p>
                        <ButtonGroup segmented>
                            <Button id={ id.value+'-minus' } size="slim" onClick={ updateProduct } outline>-</Button>
                            <Button size="slim" outline disabled>{ qtyToBuy.value }</Button>
                            <Button id={ id.value+'-plus' } size="slim" onClick={ updateProduct } outline>+</Button>
                        </ButtonGroup>
                        
                        <small>{ currencyFormat.format( price.value ) }</small>


                    
                </Stack.Item>

                <Stack.Item>
                    <div> { currencyFormat.format((parseFloat(price.value)*qtyToBuy.value)) } </div>
                </Stack.Item>
                    
                <Stack.Item>
                    <Button onClick={ () => deleteProduct( index ) } icon={ CircleCancelMajor } plain></Button>
                </Stack.Item>
            </Stack>

        </div>
    );
}
