import { Shopify } from '@shopify/shopify-api';
import { request, response } from 'express';

import { getInventoryQtyByLocation } from '../helpers/pos-inventory.js';



export default function posInventoryApiEndpoints( app ){

    app.post("/api/inventory/location", async (req = request, res = response) => {
        const session = await Shopify.Utils.loadCurrentSession(
            req,
            res,
            false
        );
    
        try {
            const invQty = await getInventoryQtyByLocation(session, req.body);

            res.json({
                inventoryLevel: invQty.body.data.inventoryItem.inventoryLevel.available
            });
        } catch ( err ) {
            console.log(`Failed to get inventory data: ${err.message}`);
            res.status(500).json({
                error: 'Contact admin: err 1202 ',
            });
        }
    });
}