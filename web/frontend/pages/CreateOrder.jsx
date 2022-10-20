import { ResourcePicker, TitleBar, useAppBridge, useNavigate } from '@shopify/app-bridge-react';
import { Button, Card, Form, FormLayout, Page, Stack, TextContainer } from '@shopify/polaris';
import { useCallback, useState } from 'react';

import { PassField } from '../components';
import { useScanner } from '../hooks'

export default function CreateOrder() {
    const [showResourcePicket, setShowResourcePicket] = useState(false);

    const navigate = useNavigate();

    const toggleResourcePicker = useCallback(
      () => {
        setShowResourcePicket(!showResourcePicket);
      },
      [showResourcePicket],
    );

    const { barCode, launchScanner } = useScanner();

    return (
        <Page narrowWidth>
            <TitleBar
                title="Crear un pedido"
                primaryAction={{
                    content: "Historial de pedidos",
                    onAction: () => navigate("/"),
                }}
            />
            <Form>
                <FormLayout>
                    <Card title="Registro del vendedor">
                        <Card.Section>
                            <Stack>
                                <PassField label="Ingresa el NIP" />
                            </Stack>
                        </Card.Section>
                    </Card>
                    <Card title="Lista de productos">
                        <Card.Section >
                            { showResourcePicket && (
                                <ResourcePicker
                                    resourceType="Product"
                                    showVariants={false}
                                    selectMultiple={true}
                                    onCancel={ toggleResourcePicker }
                                    onSelection={ null }
                                    initialQuery="0002"
                                    open
                                />
                            )}
                            <Button onClick={ launchScanner }>
                                Buscar Producto
                            </Button>
                            <TextContainer>
                                <p>Scan: { barCode }</p>
                            </TextContainer>
                        </Card.Section>
                    </Card>
                    <Card title="Resumen de la venta">
                        <Card.Section>
                            <TextContainer>
                                <h1>Holaaaa Formulario de venta</h1>
                            </TextContainer>
                        </Card.Section>
                    </Card>
                </FormLayout>
            </Form>
        </Page>
    );
}
