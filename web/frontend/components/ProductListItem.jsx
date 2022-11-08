import { Button,
         ButtonGroup,
         Stack,
         TextStyle, 
         Thumbnail} from "@shopify/polaris"
import { CircleCancelMajor } from '@shopify/polaris-icons';         

export const ProductListItem = ({ field, index, updateProduct, deleteProduct }) => {

    const { id, image, title, qtyToBuy, price, sku } = field;

    const currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const media = image.value 
            ? <Thumbnail source={ image.value?.originalSrc } alt={ image.value?.altText } size='large'/> 
            : <Thumbnail source='' alt='' />;

    return (
        <div key={ id.value } style={{ paddingTop: 10, paddingBottom: 10 }}>
            
            <TextStyle variation="strong">{ title.value }</TextStyle>
                    
            <Stack distribution="fillEvenly" alignment="center">
                <Stack.Item>
                    
                    { media }
                </Stack.Item>

                <Stack.Item >               
                        <p>SKU: { sku.value }</p>
                        <ButtonGroup segmented>
                            <Button id={ index+'-minus' } size="slim" onClick={ updateProduct } outline>-</Button>
                            <Button size="slim" outline disabled>{ qtyToBuy.value }</Button>
                            <Button id={ index+'-plus' } size="slim" onClick={ updateProduct } outline>+</Button>
                        </ButtonGroup>
                        
                        <small>{ currencyFormat.format( price.value ) }</small>


                    
                </Stack.Item>

                <Stack.Item>
                    <div> { currencyFormat.format(( parseFloat( price.value )*qtyToBuy.value )) } </div>
                </Stack.Item>
                    
                <Stack.Item>
                    <Button onClick={ () => deleteProduct( index ) } icon={ CircleCancelMajor } plain></Button>
                </Stack.Item>
            </Stack>

        </div>
    );
}
