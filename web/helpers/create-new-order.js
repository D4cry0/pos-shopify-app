import { Shopify } from "@shopify/shopify-api";

const CREATE_DRAFT_ORDER_MUTATION = `mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
        draftOrder {
            id
        }
    }
}`

const CREATE_ORDER_MUTATION = `mutation draftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id) {
        draftOrder {
            id
            order {
                id
            }
        }
    }
}`


// TODO: Update de input example
/* 
    {
        "pin": "123456",
        "cash": "500",
        "credit": "0",
        "customerEmail": "",
        "cartList": [
            {
                "id": "gid://shopify/Product/7767942070509",
                "image": {
                    "originalSrc": "https://cdn.shopify.com/s/files/1/0647/0857/5469/products/pic4134779.png?v=1654014080",
                    "altText": ""
                },
                "title": "Prueba3",
                "variantId": "gid://shopify/ProductVariant/42865078239469",
                "inventoryItem": "gid://shopify/Product/7767942070509",
                "inventoryQty": 4,
                "qtyToBuy": 1,
                "price": "500.00",
                "sku": "SG95518"
            }
        ]
    }

*/

export default async function createDraftOrder( session, orderData ) {
    // TODO: Establish location by admin input
    const location = "RetailGDL-P738";

    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    
    const { pin, cash, credit, customerEmail, lineItems } = orderData;

    try {
        const draftOrderId = await client.query({
            data: {
                query: CREATE_DRAFT_ORDER_MUTATION,
                variables: {
                    input: {
                        email: customerEmail,
                        lineItems: lineItems,
                        customAttributes: [
                            {
                                key: 'cash',
                                value: cash
                            },
                            {
                                key: 'credit',
                                value: credit
                            },
                            {
                                key: 'pin',
                                value: pin
                            },
                        ],
                        note: 'Punto de venta Prisciliano',
                        shippingLine: {
                            price: 0,
                            title: 'Entrega persona Prisciliano'
                        },
                    },
                },
            },
        });
        console.log(draftOrderId.body.data.draftOrderCreate.draftOrder.id);

        const orderId = await client.query({
            data: {
                query: CREATE_ORDER_MUTATION,
                variables: {
                    id: draftOrderId.body.data.draftOrderCreate.draftOrder.id
                }
            }
        });

        // GET THE FULFILL ORDER AND CHECK IF CAN BE MOVED
        console.log(orderId.body.data.draftOrderComplete.draftOrder.order.id);
        
        const fulfillOrder = await client.query({
            data: `{
                order(id:"${ orderId.body.data.draftOrderComplete.draftOrder.order.id }") {
                    fulfillmentOrders (first:1) {
                        edges {
                            node {
                                id
                                locationsForMove (first:10) {
                                    edges {
                                        node {
                                            location {
                                                id
                                                name
                                            }
                                            movable
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`
        });

        // console.log(fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.locationsForMove.edges[0].node);
        
        console.log(fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.id);
        
        const locationID = fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.locationsForMove.edges.find( (node) => 
            node.node.location.name.normalize() === location.normalize() && node.node.movable 
        );

        console.log(locationID.node.location.id);
        

        const moveFulfillOrder = await client.query({
            data: {
                query: `mutation fulfillmentOrderMove($id: ID!, $newLocationId: ID!) {
                        fulfillmentOrderMove(id: $id, newLocationId: $newLocationId) {
                            movedFulfillmentOrder {
                                id
                            }
                            originalFulfillmentOrder {
                                id
                            }
                            remainingFulfillmentOrder {
                                id
                            }
                        }
                  }`,
                variables: {
                    id:fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.id,
                    newLocationId:locationID.node.location.id
                }
            } 
        });

        console.log(moveFulfillOrder.body.data.fulfillmentOrderMove.movedFulfillmentOrder.id);
        


        // FULFILL THE ORDER ONCE THE ITEMS ARE MOVED TO NEW LOCATION
        const createdFulFillmentOrder = await client.query({
            data: {
                query: `mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
                    fulfillmentCreateV2(fulfillment: $fulfillment) {
                        fulfillment {
                            id
                            createdAt
                        }
                    }
                  }`,
                variables: {
                    fulfillment: {
                        lineItemsByFulfillmentOrder: [
                            {
                                fulfillmentOrderId: moveFulfillOrder.body.data.fulfillmentOrderMove.movedFulfillmentOrder.id
                            }
                        ],
                        notifyCustomer: false,
                    }
                }
            } 
        });

        console.log(createdFulFillmentOrder.body.data.fulfillmentCreateV2.fulfillment.id);
        



        return '';
    } catch ( err ) {
        // TODO: Handle errors in a right way
        throw new Error( `${err.message}\n${JSON.stringify(err.response, null, 2)}` );

        // if (err instanceof ShopifyErrors.GraphqlQueryError) {
        //     throw new Error( `${err.message}\n${JSON.stringify(err.response, null, 2)}` );
        // } else {
        //     throw err;
        // }
    }
}