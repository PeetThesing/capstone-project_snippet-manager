import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { useState } from "react";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ Component, pageProps }) {
  const [edit, setEdit] = useState(false);
  const router = useRouter();

  async function editSnippet(event, snippetData) {
    const { id } = router.query;
    const response = await fetch(`/api/snippets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snippetData),
    });

    if (response.ok) {
      setEdit(true);
      router.push(`/${id}`);
    }
  }

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} editSnippet={editSnippet} editState={edit} />
      <Footer />
    </SWRConfig>
  );
}
