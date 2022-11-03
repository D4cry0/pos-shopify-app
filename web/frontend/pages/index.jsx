import { useCallback, useEffect, useState } from 'react';

import {
  Page,
  EmptyState,
  Card,
  FullscreenBar,
  DisplayText,
} from '@shopify/polaris';
import { useNavigate, useAppBridge } from '@shopify/app-bridge-react';
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
            <DisplayText size="small"> vsys POS - point of sale </DisplayText>
          </div>
        </div>
      </FullscreenBar> }
      <Page 
          narrowWidth
          title="Welcome"
          primaryAction={{
            content: "Fullscreen",
            onAction: () => goFullscreen(),
            disabled: ( isFullscreen )
          }}
      >
        <Card sectioned>
          <EmptyState
            heading="POS"
            action={{
              content: 'New Order',
              onAction: () => navigate("/CreateOrder"),
            }}
            secondaryAction={{
              content: 'Sales',
              onAction: () => navigate("/"),
            }}
            image={ posImg }
          >
            <p>NIP is required</p>
          </EmptyState>
        </Card>
      </Page>
      
    </>
  );
}
