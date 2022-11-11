import { Shopify } from '@shopify/shopify-api';
import { response, request } from 'express';

import { Staff } from '../models/staff.js';


const getShopUrlFromSession = async ( req, res ) => {
    const session = await Shopify.Utils.loadCurrentSession( req, res, false );
    return `https://${session.shop}`;
}


export default function posStaffApiEndpoints( app ){

    app.post("/api/staff/location", async (req = request, res = response) => {

        
        try {
            const shopDomain = await getShopUrlFromSession( req, res );
            
            const { uid } = req.body;
            const staff = await Staff.findOne({ uid, shopDomain });
            
            if( !staff ){
                return res.status(400).json({
                    error: 'Invalid UID',
                });
            }
    
            res.json({
                fulFillLocationId: staff.fulFillLocationId,
                fulFillLocationName: staff.fulFillLocationName,
                name: staff.name,
            });
        } catch ( err ) {
            console.log( err );
            res.status(500).json({
                error: 'Contact admin: err 1301',
            });
        }

    });
}