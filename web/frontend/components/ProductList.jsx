import { TextContainer } from "@shopify/polaris"

import { ProductListItem } from "./";

export const ProductList = ({ cartList, updateProduct, deleteProduct, cartItemCount }) => {

    return (
        
        <>
            {
                cartList.map(( field, index ) => (
                    <ProductListItem 
                        field={ field }
                        index={ index }
                        updateProduct={ updateProduct }
                        deleteProduct={ deleteProduct }
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
