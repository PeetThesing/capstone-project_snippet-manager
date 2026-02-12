import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import useSWR from "swr";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import { Montserrat } from "next/font/google";
const montserratFont = Montserrat({ subsets: ["latin"] });

const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const { data, error, isLoading } = useSWR("/api/snippets", fetcher);

  const [favorites, setFavorites] = useLocalStorageState("favorites", {
    defaultValue: [],
  });

  function handleToggleFavorite(snippetId) {
    if (favorites.includes(snippetId)) {
      setFavorites(favorites?.filter((favorite) => favorite !== snippetId));
    } else {
      setFavorites([...favorites, snippetId]);
    }
  }

  if (error)
    return (
      <StyledText tabIndex={0}>
        Failed to load...<span aria-hidden="true">🥶 😵‍💫 😨 😩 😢</span>
      </StyledText>
    );
  if (isLoading)
    return (
      <StyledText tabIndex={0}>
        Wait....wait...wait... still loading...
        <span aria-hidden="true">🤓</span>
      </StyledText>
    );

  const defaultTags = data?.reduce((tagsArray, item) => {
    item.tags?.forEach((tag) => {
      const existingTag = tagsArray.find(
        (singleTag) => singleTag.label === tag.label
      );
      if (!existingTag) {
        tagsArray.push(tag);
      }
    });
    return tagsArray;
  }, []);

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStyle />
      <Header />
      <StyledBackground>
        <Component
          {...pageProps}
          data={data}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          defaultTags={defaultTags}
        />
      </StyledBackground>
      <Footer />
    </SWRConfig>
  );
}

const StyledText = styled.p`
  color: white;
  font-family: ${montserratFont.style.fontFamily};
  background: linear-gradient(89deg, #9b2fc4 0.91%, #0045e8 99.91%);
  border-radius: 5rem;
  font-size: 2rem;
  font-weight: 600;
  padding: 3rem 2rem;
  text-align: center;
`;

const StyledBackground = styled.section`
  background: white;
  width: 100%;
  border-radius: 2rem;
  z-index: 50;
  padding: 1rem 0;
`;
