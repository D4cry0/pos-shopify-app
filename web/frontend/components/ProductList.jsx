import { TextContainer } from "@shopify/polaris"
import { useEffect, useState } from "react"

import { ProductListItem } from "./ProductListItem"


export const ProductList = ({ products, updateList }) => {

    const [count, setCount] = useState(0);

    useEffect(() => {
      
        console.log("LI");
        console.log(products);
      return () => {
        
      }
    }, [])
    
    

    return (
        
        <>
        <TextContainer>
            <p>
                Mostrando {count} producto{ count > 1 ? "s" : "" }
            </p>
        </TextContainer>
        <hr />
        {
            products.map( (item) => (
                <ProductListItem product={ item } updateList={ updateList } />
            ))
        }
        </>
    )
}
