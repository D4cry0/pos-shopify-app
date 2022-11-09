import { Button,
         ButtonGroup,
         Card,
         Form,
         InlineError,
         Layout,
         Page,
         Spinner,
         Stack,
         TextContainer,
         TextField, } from '@shopify/polaris';
import { CheckoutMajor,
         CashDollarMajor,
         CreditCardMajor,
         TransactionMajor } from '@shopify/polaris-icons';

import { useEffect, useState } from 'react';

import { BothPaymentFields, ProductList, ScannerPicker, PINField } from '../components';

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
            handleStaffPin,
            handleStaffPinError,
            staffPinError,
            handleCustomerEmail,
            handleCustomerEmailError,
            customerEmail,
            isCheckoutOk,
            submit,
            submitting,
            submitErrors, } = useCreateOrder();

    
    const [ isCash, setIsCash ] = useState( false );
    const [ isCredit, setIsCredit ] = useState( false );
    const [ isBoth, setIsBoth ] = useState( false );

    const currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

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

        <Page 
            title="New Order"
        >
            <Layout>

                <Layout.Section>
                    <Card sectioned title="Cart">
                        <Card.Section>
                            <Stack alignment='center'>
                                <Stack.Item fill >
                                    <ScannerPicker addProduct={ addProduct } />
                                </Stack.Item>
                                <Stack.Item>
                                    {
                                        showCartList && <Button 
                                            onClick={ resetForm } 
                                            primary
                                        >
                                            Clear
                                        </Button>
                                    }
                                </Stack.Item>
                            </Stack>
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

                    <Card sectioned title="Customer">
                        <TextField
                            label='Email'
                            autoComplete='off'
                            value={ customerEmail }
                            onChange={ handleCustomerEmail }
                            error={ handleCustomerEmailError }
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
                                <PINField 
                                    onChange={ handleStaffPin }
                                    onError={ handleStaffPinError }
                                    error={ staffPinError }
                                />
                        
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
                                
                                <div style={{height: 20}}></div>

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
                                    {
                                        ! submitting 
                                        ?   <Button submit primary icon={CheckoutMajor}>
                                                Checkout
                                            </Button> 
                                        :   <Spinner accessibilityLabel="Spinner Submit" size="large" />
                                    }
                                    <div style={{height: 20}}></div>
                                    {
                                        submitErrors.length > 0 && submitErrors.map( ( error, index ) => (
                                            <InlineError key={ index } message={ error.message } />
                                        ))
                                    }
                                </Form>
                            </Card.Section>
                        }
                    </Card>
                </Layout.Section>

            </Layout>
        </Page>
    );
}
