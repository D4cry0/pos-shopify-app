import { TitleBar,
         useAppBridge,
         useNavigate } from '@shopify/app-bridge-react';
import { Fullscreen } from '@shopify/app-bridge/actions';
import { Button,
         Card,
         Form,
         FormLayout,
         Heading,
         Layout,
         Modal,
         Page,
         PageActions,
         Stack,
         TextContainer } from '@shopify/polaris';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PassField, ProductList, ScannerPicker } from '../components';

export default function CreateOrder() {
    const [ activeModal, setActiveModal ] = useState( false );
    const [ isOrderEdit, setIsOrderEdit ] = useState( true );

    const [ products, setProducts ] = useState( [] );
    const [ orderTotal, setOrderTotal ] = useState( 0 );

    const navigate = useNavigate();
    const returnMainMenu = useRef();

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const addProducts = ( newProduct ) => {
        setProducts([ ...products, newProduct ]);
    }

    const updateProducts = ( updatedProductsList ) => {
        setProducts( updatedProductsList );
    }


    const toggleEditOrder = useCallback(
        () => {
            setIsOrderEdit( !isOrderEdit );
        },
        [ isOrderEdit ],
    )

    const handleChange = useCallback(
        () => setActiveModal( !activeModal ), 
        [ activeModal ]
    );

    useEffect(() => {
        let sum = 0;

        products.map( item => {
            sum += parseFloat(item.qtyToBuy) * parseFloat(item.price);
        });

        setOrderTotal( sum );
        
        return () => {
            
        }
    }, [products])
    

    return (
        <>
            <Modal
                activator={ returnMainMenu }
                open={ activeModal }
                onClose={ handleChange }
                title="Exit"
                primaryAction={{
                    content: 'Exit',
                    onAction: () => navigate( "/" ),
                }}
                secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: handleChange,
                },
                ]}
            >
                <Modal.Section>
                <TextContainer>
                    <p>
                        Are you sure you want to exit?
                    </p>
                </TextContainer>
                </Modal.Section>
            </Modal>

            <Page 
                
                title="New Order"
            >
                
                        <Layout>
                            <Layout.Section>

                            <Card sectioned>
                                <Heading>Cart</Heading>
                                {
                                    isOrderEdit && <ScannerPicker addProducts={ addProducts } />
                                }

                                {
                                    isOrderEdit && <ProductList 
                                        products={ products } 
                                        updateProducts={ updateProducts }
                                        currencyFormat={ formatter }
                                    />
                                }

                                {
                                    isOrderEdit && <Button onClick={ toggleEditOrder }>
                                        Checkout
                                    </Button>
                                }

                                {
                                    !isOrderEdit && <Button onClick={ toggleEditOrder }>
                                        Edit Order
                                    </Button>
                                }

                            </Card>
                            

                            </Layout.Section>
                            <Layout.Section secondary>

                            <Card sectioned>

                                <Heading>Menu</Heading>
                                <div ref={ returnMainMenu }>
                                    <Button onClick={ handleChange }>
                                        Cancel
                                    </Button>
                                </div>
                                
                            </Card>

                            <Card sectioned>
                                <Heading>Order Summary</Heading>
                                <PassField label="Enter NIP" />
                               
                                    <hr />
                                    <Stack distribution='fillEvenly'>
                                        <Stack.Item>
                                            
                                            <TextContainer>
                                            <p>Subtotal:</p>
                                            <p>VAT:</p>
                                            <p>Total:</p>
                                            </TextContainer>
                                            
                                        </Stack.Item>
                                        <Stack.Item>

                                            <TextContainer>
                                            <p>{ formatter.format(orderTotal) }</p>
                                            <p>{ formatter.format((orderTotal*0.16)) }</p>
                                            <p>{ formatter.format(orderTotal) }</p>
                                            </TextContainer>
                                            
                                        </Stack.Item>
                                    </Stack>
                                    
                                
                            </Card>

                            </Layout.Section>
                        </Layout>
            </Page>
            
        </>
    );
}
