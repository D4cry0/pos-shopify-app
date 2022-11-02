import { ContextualSaveBar, useNavigate } from '@shopify/app-bridge-react';
import { Button,
         ButtonGroup,
         Card,
         Form,
         FormLayout,
         Layout,
         Modal,
         Page,
         Spinner,
         Stack,
         TextContainer, 
         TextField} from '@shopify/polaris';
import { CheckoutMajor,
         CashDollarMajor,
         CreditCardMajor,
         TransactionMajor } from '@shopify/polaris-icons';

import { useCallback, useRef, useState } from 'react';

import { BothPaymentFields, PassField, ProductList, ScannerPicker } from '../components';

import { useCreateOrder } from '../hooks';

import '../styles.css';

export default function CreateOrder() {

    const { 
            cash,
            credit,
            cartList,
            cartItemCount,
            formatter,
            subTotalCart,
            vatCart,
            totalCart,
            totalCartNumber,
            addProduct,
            updateProduct,
            deleteProduct,
            handleCash,
            handleCredit,
            handleBoth,
            isBothPayments,
            handleNip,
            isCheckoutOk,
            submit,
            submitting,
            reset, } = useCreateOrder();

    const [ activeModal, setActiveModal ] = useState( false );

    const navigate = useNavigate();
    const returnMainMenu = useRef();

    const handleChange = useCallback(
        () => setActiveModal( !activeModal ), 
        [ activeModal ]
    );

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

                                <Card sectioned title="Cart">
                                    <Card.Section>
                                        <ScannerPicker addProduct={ addProduct } />
                                    </Card.Section>

                                    <Card.Section>
                                        <ProductList 
                                            cartList={ cartList } 
                                            updateProduct={ updateProduct }
                                            deleteProduct={ deleteProduct }
                                            currencyFormat={ formatter }
                                            cartItemCount={ cartItemCount }
                                        />
                                    </Card.Section>
                                </Card>
                            

                            </Layout.Section>
                            <Layout.Section secondary>
                                
                                <Card sectioned title="Menu">
                                    <div ref={ returnMainMenu }>
                                        <Button onClick={ handleChange }>
                                            Cancel
                                        </Button>
                                    </div>
                                    
                                </Card>

                                <Card sectioned title="Order Summary">
                                    <Card.Section>
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
                                                    <p>{ subTotalCart }</p>
                                                    <p>{ vatCart }</p>
                                                    <p>{ totalCart }</p>
                                                </TextContainer>
                                                
                                            </Stack.Item>
                                        </Stack>

                                    </Card.Section>
                                        
                                    {
                                        cartItemCount > 0 && 
                                        <Card.Section>
                                            <PassField label="Enter NIP" setNip={ handleNip } />
                                    
                                            <div style={{height: 30}}></div>
                                            
                                            <TextContainer>Payment</TextContainer>
                                            <ButtonGroup>                                               
                                                <Button onClick={ handleCash} icon={CashDollarMajor}>Cash</Button>
                                                <Button onClick={ handleCredit } icon={CreditCardMajor}>Credit</Button>
                                                <Button onClick={ handleBoth } icon={TransactionMajor}>Both</Button>
                                            </ButtonGroup>
                                            
                                            <div style={{height: 30}}></div>

                                            <BothPaymentFields  
                                                isBothPayments={ isBothPayments }
                                                cash={ cash }
                                                credit={ credit }
                                                orderTotal={ totalCartNumber }
                                            />
                                        </Card.Section>
                                    }

                                    {
                                        isCheckoutOk() &&
                                        <Card.Section>
                                            <Form onSubmit={ submit }>
                                                <Button submit primary icon={CheckoutMajor}>
                                                    Checkout
                                                </Button>
                                            </Form>
                                        </Card.Section>
                                    }
                                            

                                </Card>

                            </Layout.Section>
                        </Layout>
            </Page>
            
        </>
    );
}
