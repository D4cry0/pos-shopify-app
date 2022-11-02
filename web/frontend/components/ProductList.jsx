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
import { ProductListItem } from "./";


export const ProductList = ({ cartList, updateProduct, deleteProduct, cartItemCount, currencyFormat }) => {

    return (
        
        <>
            {
                cartList.dirty && cartList.fields.map(( field, index ) => (
                    <ProductListItem 
                        field={ field }
                        index={ index }
                        updateProduct={ updateProduct }
                        deleteProduct={ deleteProduct }
                        currencyFormat={ currencyFormat }
                    />
                ))
            }
            <TextContainer>
                <div className="cart-totalitems">
                    <p>Total { cartItemCount > 1 ? "items" : "item" }: { cartItemCount }</p>
                </div>
            </TextContainer>
        </>
    );
}
