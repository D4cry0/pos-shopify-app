import { useCallback, useEffect, useState } from 'react';

import {
  Page,
  EmptyState,
  Card,
  FullscreenBar,
  DisplayText,
} from '@shopify/polaris';
import { useNavigate, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { Fullscreen } from '@shopify/app-bridge/actions';

import { posImg } from '../assets';

export default function HomePage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const app = useAppBridge();
  const fullscreen = Fullscreen.create( app );
  const navigate = useNavigate();

  const goFullscreen = () => {
      
      fullscreen.dispatch( Fullscreen.Action.ENTER );
      setIsFullscreen(true);
  }

  const exitFullscreen = () => {
      
      fullscreen.dispatch( Fullscreen.Action.EXIT );
      setIsFullscreen(false);
  }

  return (
    <>
      { isFullscreen && <FullscreenBar onAction={ exitFullscreen }>
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
            <DisplayText size="small"> vsys POS - punto de venta </DisplayText>
          </div>
        </div>
      </FullscreenBar> }
      <Page 
          narrowWidth
          title="Bienvenido"
          primaryAction={{
            content: "Pantalla completa",
            onAction: () => goFullscreen(),
            disabled: ( isFullscreen )
          }}
      >
        <Card sectioned>
          <EmptyState
            heading="POS - Punto de Venta"
            action={{
              content: 'Crear un pedido',
              onAction: () => navigate("/CreateOrder"),
            }}
            secondaryAction={{
              content: 'Ver ventas',
              onAction: () => navigate("/"),
            }}
            image={ posImg }
          >
            <p>Ten a la mano tu NIP para usar el sistema.</p>
          </EmptyState>
        </Card>
      </Page>
      
    </>
  );
}
