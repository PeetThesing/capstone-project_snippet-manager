import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ Component, pageProps }) {
  const [editState, setEditState] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  async function editSnippet(event, snippetData) {
    const response = await fetch(`/api/snippets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snippetData),
    });

    if (response.ok) {
      setEditState(true);
      router.push(`/${id}`);
    }
  }

  const resetState = (value) => {
    // Reset the state
    setEditState(value);
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStyle />
      <Header />
      <Component
        {...pageProps}
        editSnippet={editSnippet}
        editState={editState}
        resetState={resetState}
      />
      <Footer />
    </SWRConfig>
  );
}
