import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  ButtonGroup,
  Button,
  TextField,
} from "@shopify/polaris";
import { useNavigate, TitleBar } from "@shopify/app-bridge-react";

import { ProductsCard, PassField, OrdersList } from "../components";

export default function HomePage() {

  const navigate = useNavigate();

  return (
    <Page fullWidth>
      <TitleBar 
          title="vsys POS" 
          primaryAction={{
            content: "Crear nuevo pedido",
            onAction: () => navigate("/CreateOrder"),
          }} 
      />
      <Layout>

        <Layout.Section>
          
        </Layout.Section>

      </Layout>
    </Page>
  );
}
