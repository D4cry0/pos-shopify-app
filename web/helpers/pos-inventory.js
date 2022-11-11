import { Shopify } from '@shopify/shopify-api';

import { GET_INVENTORY_QTY_BY_LOCATION } from './graphQL-querys.js';

const getInventoryQtyByLocation = async ( session, data ) => {

    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

    const { inventoryItemId, fulFillLocationId } = data;

    try {

        const inventoryQty = await client.query(
            GET_INVENTORY_QTY_BY_LOCATION( inventoryItemId, fulFillLocationId )
        );
        
        return inventoryQty;
    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'err 1201',
                msg: err.message,
                response: err.response
            }, null, 2) );
    }

}

export {
    getInventoryQtyByLocation
}