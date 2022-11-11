import { Button,
         ButtonGroup,
         Stack,
         TextStyle, 
         Thumbnail} from '@shopify/polaris'
import { CircleCancelMajor } from '@shopify/polaris-icons';         

export const ProductListItem = ({ field, index, deleteProduct }) => {

    const { image, title, qtyToBuy, price, sku } = field;

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
        <div key={ sku.value } style={{ paddingTop: 10, paddingBottom: 10 }}>
            
            <TextStyle variation='strong'>{ title.value }</TextStyle>
                    
            <Stack distribution='fillEvenly' alignment='center'>
                <Stack.Item>
                    
                    { media }
                </Stack.Item>

                <Stack.Item >               
                        <p>SKU: { sku.value }</p>
                        <ButtonGroup segmented>
                            <Button size='slim' outline disabled>{ qtyToBuy.value }</Button>
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
