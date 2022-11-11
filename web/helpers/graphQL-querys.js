const CREATE_DRAFT_ORDER_QUERY = ( staff, cash, credit, customerEmail, lineItems, location ) => {
    /* 
        // RETURN DATA
        body{
            data{
                draftOrderCreate {
                    draftOrder {
                        id
                    }
                }
            }
        }

        console.log( draftOrderId.body.data.draftOrderCreate.draftOrder.id );
    */

    return {
        data: {
            query: `mutation draftOrderCreate($input: DraftOrderInput!) {
                draftOrderCreate(input: $input) {
                    draftOrder {
                        id
                    }
                }
            }`,
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
                            key: 'staff',
                            value: staff
                        },
                    ],
                    note: `Punto de venta: ${ location }`,
                    shippingLine: {
                        price: 0,
                        title: `Retiro en punto de venta`
                    },
                },
            },
        },
    }
}

const CREATE_ORDER_QUERY = ( draftOrderId ) => {
    /* 
        // RETURN DATA
        body{
            data{
                draftOrderComplete {
                    draftOrder {
                        id
                        order {
                            id
                        }
                    }
                }
            }
        }

        console.log( orderId.body.data.draftOrderComplete.draftOrder.order.id );
    */

    return {
        data: {
            query: `mutation draftOrderComplete($id: ID!) {
                draftOrderComplete(id: $id) {
                    draftOrder {
                        id
                        order {
                            id
                        }
                    }
                }
            }`,
            variables: {
                id: draftOrderId
            }
        }
    };
}

const GET_FULFILLORDERID_AND_SELECTEDMOVABLEID_QUERY = ( orderID ) => {
    /* 
        // RETURN DATA
        body{
            data{
                order {
                    fulfillmentOrders {
                        edges [ {   <---- Array
                            node {
                                id
                                locationsForMove {
                                    edges [ {   <---- Array
                                        node {
                                            location {
                                                id
                                                name
                                            }
                                            movable
                                        }
                                    } ]
                                }
                            }
                        } ]
                    }
                }
            }
        }

        List of locations
        fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.locationsForMove.edges.map( node => console.log(node.node));
        
        Fulfill order id
        console.log( fulfillOrder.body.data.order.fulfillmentOrders.edges[0].node.id );

        Designed movable location ID
        console.log( locationID.node.location.id );

    */

    return {
        data: `{
            order(id:"${ orderID }") {
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
    };
}

const SET_FULFILLORDER_IN_LOCATIONID_QUERY = ( fulFillOrderID,  locationID ) => {

    /* 
        // RETURN DATA
        body{
            data{
                fulfillmentOrderMove {
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
            }
        }

        console.log(moveFulfillOrder.body.data.fulfillmentOrderMove.movedFulfillmentOrder.id);
    */

    return {
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
                id: fulFillOrderID,
                newLocationId: locationID
            }
        } 
    };
}

const FULFILL_ORDER_QUERY = ( fulFillmentID ) => {

    /* 
        // RETURN DATA
        body{
            data{
                fulfillmentCreateV2 {
                    fulfillment {
                        id
                        createdAt
                    }
                }
            }
        }

        console.log(createdFulFillmentOrder.body.data.fulfillmentCreateV2.fulfillment.id);
    */

    return {
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
                            fulfillmentOrderId: fulFillmentID
                        }
                    ],
                    notifyCustomer: false,
                }
            }
        } 
    }
}

const GET_INVENTORY_QTY_BY_LOCATION = ( inventoryItemId, fulFillLocationId ) => {

    /* 
    
        // RETURN DATA
        {
        "body": {
                "data": {
                    "inventoryItem": {
                        "inventoryLevel": {
                            "available": 3
                        }
                    }
                },
            },
        }
    
    
    */

    return {
        data: `
            query {
                inventoryItem(id: "${ inventoryItemId }") {
                    inventoryLevel(locationId: "${ fulFillLocationId }"){
                        available
                    }
                }
            }`,
    }
}

export {
    CREATE_DRAFT_ORDER_QUERY,
    CREATE_ORDER_QUERY,
    GET_FULFILLORDERID_AND_SELECTEDMOVABLEID_QUERY,
    SET_FULFILLORDER_IN_LOCATIONID_QUERY,
    FULFILL_ORDER_QUERY,

    GET_INVENTORY_QTY_BY_LOCATION,
}