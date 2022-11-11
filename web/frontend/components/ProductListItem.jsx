import { Button,
         ButtonGroup,
         Stack,
         TextStyle, 
         Thumbnail} from '@shopify/polaris'
import { CircleCancelMajor } from '@shopify/polaris-icons';         

export const ProductListItem = ({ field, index, deleteProduct }) => {

    const { image, title, qtyToBuy, price, sku, amountDiscount } = field;

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

                <Stack.Item alignment='vertical'>
                    {
                        amountDiscount.value != 0 && <Stack.Item>
                            <p> { currencyFormat.format(( ( parseFloat( price.value ) - amountDiscount.value ) *qtyToBuy.value )) } </p>
                        </Stack.Item>
                    }
                    <Stack.Item>
                        <p style={{ textDecoration: amountDiscount.value == 0 ? null : 'line-through' }}> { currencyFormat.format(( parseFloat( price.value )*qtyToBuy.value )) } </p>
                    </Stack.Item>
                </Stack.Item>
                    
                <Stack.Item>
                    <Button onClick={ () => deleteProduct( index ) } icon={ CircleCancelMajor } plain></Button>
                </Stack.Item>
            </Stack>

        </div>
    );
}
