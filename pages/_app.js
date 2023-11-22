import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import useSWR from "swr";
import styled from "styled-components";
import { useState } from "react";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const { data, error, isLoading } = useSWR("api/snippets", fetcher);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snippetInfo, setSnippetInfo] = [];

  function handleToggleFavorite(idbrokkoli) {
    setIsFavorite(!isFavorite);
    console.log("handle Favorite");
  }

  if (error) return <StyledText>Failed to load...🥶 😵‍💫 😨 😩 😢</StyledText>;
  if (isLoading)
    return <StyledText>Wait....wait...wait... still loading...🤓</StyledText>;

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStyle />
      <Header />
      <Component
        {...pageProps}
        data={data}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />
      <Footer />
    </SWRConfig>
  );
}

const StyledText = styled.p`
  color: var(--primary-color);
  font-size: 2rem;
  padding: 3rem 2rem;
`;
