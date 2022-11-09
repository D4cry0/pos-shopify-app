import { Shopify } from "@shopify/shopify-api";


import { CREATE_DRAFT_ORDER_QUERY,
         CREATE_ORDER_QUERY,
         GET_FULFILLORDERID_AND_SELECTEDMOVABLEID_QUERY,
         SET_FULFILLORDER_IN_LOCATIONID_QUERY,
         FULFILL_ORDER_QUERY } from './graphQL-querys.js';

/* 
    {
      pin: '123456',
      cash: '100',
      credit: '100',
      customerEmail: '',
      lineItems: [
        {
          variantId: 'gid://shopify/ProductVariant/00000001614569',
          quantity: 1
        },
        {
          variantId: 'gid://shopify/ProductVariant/00000003949161',
          quantity: 1
        }
      ]
    }
*/

export default async function createDraftOrder( session, orderData ) {
    // TODO: Establish location by admin input
    const location = "RetailGDL-P738";

    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    
    const { pin, cash, credit, customerEmail, lineItems } = orderData;

    let draftOrderId;
    let orderId;
    let fulfillOrder;
    let locationID;
    let moveFulfillOrder;
    let createdFulFillmentOrder;

    try {
        // Create a new Draft Order
        draftOrderId = await client.query(
            CREATE_DRAFT_ORDER_QUERY( pin, cash, credit, customerEmail, lineItems, location )
        );

    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'create draft order',
                msg: err.message,
                response: err.response
            }, null, 2) );
    }

    try {
        // Create a new Order with the draft order ID
        orderId = await client.query(
            CREATE_ORDER_QUERY( draftOrderId.body.data.draftOrderCreate.draftOrder.id )
        );

    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'create order',
                msg: err.message,
                response: err.response
            }, null, 2) );
    }

    try {
        // Get the fulfill order ID and the movable location ID with the order ID
        fulfillOrder = await client.query(
            GET_FULFILLORDERID_AND_SELECTEDMOVABLEID_QUERY( orderId.body.data.draftOrderComplete.draftOrder.order.id )
        );

        if( ! fulfillOrder.body.data.order ) throw new Error( 'Order ID Not valid or was not generated' );
    
        // - Get de movableLocationID
        locationID = fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.locationsForMove.edges.find( ( node ) => 
            node.node.location.name.normalize() === location.normalize() && node.node.movable 
        );

        if( ! locationID ) throw new Error( ' Field: Designed Location ID not valid ID or not movable' );
    
    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'get the fulfill order and movable',
                msg: err.message,
            }, null, 2) );
    }
    

    try {
        // Move order to the designated locationID
        moveFulfillOrder = await client.query(
            SET_FULFILLORDER_IN_LOCATIONID_QUERY( 
                fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.id,
                locationID.node.location.id
            )
        );

    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'set fulfill order in location',
                msg: err.message,
                response: err.response
            }, null, 2) );
    }

    try {
        // Fulfill order once the items are in the designed location
        createdFulFillmentOrder = await client.query(
            FULFILL_ORDER_QUERY( moveFulfillOrder.body.data.fulfillmentOrderMove.movedFulfillmentOrder.id )
        );

    } catch ( err ) {
        throw new Error( JSON.stringify({
                line: 'fulfill order',
                msg: err.message,
                response: err.response
            }, null, 2) );
    }


    // TODO: If is needed a return value
    return '';
}