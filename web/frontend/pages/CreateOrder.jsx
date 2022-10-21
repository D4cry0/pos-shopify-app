import { TitleBar, useAppBridge, useNavigate } from '@shopify/app-bridge-react';
import { Fullscreen } from '@shopify/app-bridge/actions';
import { Button, Card, Form, FormLayout, Heading, Layout, Modal, Page, PageActions, Stack, TextContainer } from '@shopify/polaris';
import { useCallback, useRef, useState } from 'react';

import { PassField, ScannerPicker } from '../components';

export default function CreateOrder() {
    const [activeModal, setActiveModal] = useState(false);
    const [isOrderEdit, setIsOrderEdit] = useState(true);

    const app = useAppBridge();
    const fullscreen = Fullscreen.create(app);
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
                <Form>
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
                                <hr />
                                <TextContainer>
                                    <Stack distribution='fillEvenly'>
                                        <Stack.Item>
                                            <p>Sub total: </p>
                                            <p>IVA: </p>
                                            <p>Total:</p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <p><b>$ 0.00</b></p>
                                            <p><b>$ 0.00</b></p>
                                            <p><b>$ 0.00</b></p>
                                        </Stack.Item>
                                    </Stack>
                                    
                                </TextContainer>
                            </Card>

                            </Layout.Section>
                        </Layout>
                </Form>
            </Page>
            
        </>
    );
}
