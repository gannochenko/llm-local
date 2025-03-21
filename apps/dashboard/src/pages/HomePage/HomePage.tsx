import React, { useEffect } from "react";
import { PageLayout } from "../../components";
import { Container } from "@mui/joy";
import ChatComponent from "@/components/ChatComponent/ChatComponent";

export function HomePage() {
  return (
    <PageLayout title="Home" displayPageTitle>
      <Container>
        <ChatComponent />
      </Container>
    </PageLayout>
  );
}
