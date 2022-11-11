import { Shopify } from '@shopify/shopify-api';
import { request, response } from 'express';

import { createOrder } from '../helpers/pos-order.js';


export default function posOrderApiEndpoints( app ){

    app.post("/api/posorder/create", async (req = request, res = response) => {
        const session = await Shopify.Utils.loadCurrentSession(
            req,
            res,
            false
        );
        let status = 200;
        let error = null;
    
        try {
            await createOrder(session, req.body);
        } catch ( err ) {
            console.log(`Failed to create order: ${err.message}`);
            status = 500;
            error = err.message;
        }
        res.status(status).send({ success: status === 200, error });
    });

}
