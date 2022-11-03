import { useNavigate } from '@shopify/app-bridge-react';
import { Button,
         ButtonGroup,
         Card,
         Form,
         Layout,
         Modal,
         Page,
         Stack,
         TextContainer,
         TextField, } from '@shopify/polaris';
import { CheckoutMajor,
         CashDollarMajor,
         CreditCardMajor,
         TransactionMajor } from '@shopify/polaris-icons';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BothPaymentFields, PassField, ProductList, ScannerPicker } from '../components';

import { useCreateOrder } from '../hooks';

import '../styles.css';

export default function CreateOrder() {

    const { 
            cashVal,
            creditVal,
            setCashValue,
            onCash,
            setCreditValue,
            onCredit,
            onBoth,
            cartList,
            showCartList,
            cartItemCount,
            subTotalCart,
            vatCart,
            totalCart,
            addProduct,
            updateProduct,
            deleteProduct,
            resetForm,
            handleNip,
            isCheckoutOk,
            submit,
            submitting,
            reset, } = useCreateOrder();

    const [ activeModal, setActiveModal ] = useState( false );
    const [ isCash, setIsCash ] = useState( false );
    const [ isCredit, setIsCredit ] = useState( false );
    const [ isBoth, setIsBoth ] = useState( false );

    const navigate = useNavigate();
    const returnMainMenu = useRef();

    const currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const handleChange = useCallback(
        () => setActiveModal( !activeModal ), 
        [ activeModal ]
    );

    const handleCash = () => {
        onCash();
    }

    const handleCredit = () => {
        onCredit();
    }

    const handleBoth = () => {
        onBoth();
    }

    useEffect(() => {

        setIsCash( cashVal == subTotalCart && subTotalCart > 0 );
        setIsCredit( creditVal ==  subTotalCart && subTotalCart > 0 );
        setIsBoth( creditVal > 0 && cashVal > 0 );

    }, [cashVal, creditVal]);
    

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
                                {
                                    showCartList && <ProductList 
                                        cartList={ cartList } 
                                        updateProduct={ updateProduct }
                                        deleteProduct={ deleteProduct }
                                        cartItemCount={ cartItemCount }
                                    />
                                }
                            </Card.Section>
                        </Card>
                    </Layout.Section>

                    <Layout.Section secondary>
                        <Card sectioned title="Order Menu">
                            <Stack>
                                {
                                    showCartList && <Button 
                                        onClick={ resetForm } 
                                        primary
                                    >
                                        Clear
                                    </Button>
                                }
                                <div ref={ returnMainMenu }>
                                    <Button onClick={ handleChange }>
                                        Cancel
                                    </Button>
                                </div>
                            </Stack>
                        </Card>

                        <Card sectioned title="Customer">
                            <TextField
                                label='Email'
                                type='email'
                                autoComplete='off'  
                            />
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
                                            <p>{ currencyFormat.format( subTotalCart ) }</p>
                                            <p>{ currencyFormat.format( vatCart ) }</p>
                                            <p>{ currencyFormat.format( totalCart ) }</p>
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
                                    <div style={{color: 'rgba(16, 50, 98, 1)'}}> 
                                        <ButtonGroup>                                        
                                            <Button 
                                                onClick={ handleCash } 
                                                icon={CashDollarMajor}
                                                monochrome={ isCash }
                                                outline={ isCash }
                                            >
                                                Cash&nbsp;
                                            </Button>
                                            <Button 
                                                onClick={ handleCredit } 
                                                icon={CreditCardMajor}
                                                monochrome={ isCredit }
                                                outline={ isCredit }
                                            >
                                                Credit
                                            </Button>
                                            <Button 
                                                onClick={ handleBoth } 
                                                icon={TransactionMajor}
                                                monochrome={ isBoth }
                                                outline={ isBoth }
                                            >
                                                Both&nbsp;&nbsp;
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                    
                                    <div style={{height: 30}}></div>

                                    {
                                        isBoth && <BothPaymentFields  
                                            cash={ cashVal }
                                            credit={ creditVal }
                                            setCashValue={ setCashValue }
                                            setCreditValue={ setCreditValue }
                                            orderTotal={ subTotalCart }
                                        />
                                    }
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
