import { TitleBar, useAppBridge, useNavigate } from '@shopify/app-bridge-react';
import { Fullscreen } from '@shopify/app-bridge/actions';
import { Button, Card, Form, FormLayout, Heading, Layout, Modal, Page, PageActions, Stack, TextContainer } from '@shopify/polaris';
import { useCallback, useRef, useState } from 'react';

import { PassField, ScannerPicker } from '../components';

export default function CreateOrder() {
    const [activeModal, setActiveModal] = useState(false);
    const [isOrderEdit, setIsOrderEdit] = useState(true);

    const navigate = useNavigate();

    const toggleEditOrder = () => {
        setIsOrderEdit( !isOrderEdit );
    }

    const handleChange = useCallback(
        () => setActiveModal(!activeModal), 
        [activeModal]
    );

    const regresarMenu = useRef();

    return (
        <>
            <Modal
                activator={regresarMenu}
                open={activeModal}
                onClose={handleChange}
                title="Salir"
                primaryAction={{
                    content: 'Salir',
                    onAction: () => navigate("/"),
                }}
                secondaryActions={[
                {
                    content: 'Cancelar',
                    onAction: handleChange,
                },
                ]}
            >
                <Modal.Section>
                <TextContainer>
                    <p>
                    ¿Estas seguro de salir y cancelar el pedido?
                    </p>
                </TextContainer>
                </Modal.Section>
            </Modal>

            <Page 
                
                title="Crear un pedido"
            >
                
                        <Layout>
                            <Layout.Section>

                            <Card sectioned>
                                <Heading>Lista de productos</Heading>
                                {
                                    isOrderEdit && <ScannerPicker />
                                }

                                {
                                    isOrderEdit && <Button onClick={ toggleEditOrder }>
                                        Cerrar pedido
                                    </Button>
                                }

                                {
                                    !isOrderEdit && <Button onClick={ toggleEditOrder }>
                                        Editar pedido
                                    </Button>
                                }

                            </Card>
                            

                            </Layout.Section>
                            <Layout.Section secondary>

                            <Card sectioned>

                                <Heading>Menu</Heading>
                                <div ref={regresarMenu}>
                                    <Button onClick={ handleChange }>
                                        Cancelar
                                    </Button>
                                </div>
                                
                            </Card>

                            <Card sectioned>
                                <Heading>Resumen de la venta</Heading>
                                <PassField label="Ingresa el NIP" />
                               
                                
                                    <Stack distribution='fillEvenly'>
                                        <Stack.Item>
                                            
                                            <TextContainer>
                                            <p>Sub total: </p>
                                            </TextContainer>
                                            <TextContainer>
                                            <p>IVA: </p>
                                            </TextContainer>
                                            <TextContainer>
                                            <p>Total:</p>
                                            </TextContainer>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <TextContainer>
                                            <p>$ 0.00</p>
                                            </TextContainer>
                                            <TextContainer>
                                            <p>$ 0.00</p>
                                            </TextContainer>
                                            <TextContainer>
                                            <p>$ 0.00</p>
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
