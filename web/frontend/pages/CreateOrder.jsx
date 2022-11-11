import { Badge, Button,
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

import { BothPaymentFields, ProductList, ScannerPicker, UIDField } from '../components';

import { useCreateOrder } from '../hooks';

import '../styles.css';

export default function CreateOrder() {

    const { 
            retailLocation,
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
            deleteProduct,
            resetForm,
            staffUid,
            handleStaffUid,
            handleStaffUidError,
            staffUidError,
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
    const [ isLocation, setIsLocation] = useState( false );

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

        setIsCash( cashVal == totalCart && totalCart > 0 );
        setIsCredit( creditVal ==  totalCart && totalCart > 0 );
        setIsBoth( creditVal > 0 && cashVal > 0 );

    }, [cashVal, creditVal]);

    useEffect(() => {

        setIsLocation( staffUid.length > 5 && retailLocation.length > 1 );

    }, [ staffUid, retailLocation ])
    
    
    return (

        <Page 
            title='New Order'
        >
            <Layout>

                <Layout.Section>
                    <Card sectioned title='Cart'>
                        <Card.Section>
                            <Stack alignment='center'>
                                <Stack.Item fill >
                                    <ScannerPicker addProduct={ addProduct } disabled={ !isLocation } />
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
                                    deleteProduct={ deleteProduct }
                                    cartItemCount={ cartItemCount }
                                />
                            }
                        </Card.Section>
                    </Card>
                </Layout.Section>

                <Layout.Section secondary>

                    <Card sectioned title='Location'>
                        <Stack vertical>
                            <Stack.Item>
                                <UIDField 
                                    staffUid = { staffUid }
                                    onStaffUidChange={ handleStaffUid }
                                    onError={ handleStaffUidError }
                                    error={ staffUidError }
                                    disabled={ isLocation }
                                />
                            </Stack.Item>
                            <Stack.Item>
                                {
                                    staffUid.length < 6 
                                        && <Badge status='info'>{ 'Location Off' }</Badge>
                                }
                                {
                                    staffUid.length == 6 && retailLocation.length < 1
                                        && <Badge status='attention'>{ 'Loading ...' }</Badge>
                                }
                                {
                                    staffUid.length > 5 && retailLocation.length > 1 
                                        && <Badge status='success'>{ retailLocation }</Badge>
                                }
                            </Stack.Item>
                        </Stack>
                    </Card>

                    <Card sectioned title={`Total: ${ currencyFormat.format( totalCart ) }`}>
                        <Card.Section>
                            <TextField
                                label='Customer email'
                                autoComplete='off'
                                value={ customerEmail }
                                onChange={ handleCustomerEmail }
                                error={ handleCustomerEmailError }
                            />
                        </Card.Section>
                        {
                            cartItemCount > 0 && 
                            <Card.Section>
                                
                        
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
                                        orderTotal={ totalCart }
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
                                        :   <Spinner accessibilityLabel='Spinner Submit' size='large' />
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
