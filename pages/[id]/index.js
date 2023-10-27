import BackLink from "@/components/BackLink";
import SnippetDetails from "@/components/SnippetDetails";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useEffect } from "react";

function SnippetDetailsPage({ editState, resetState }) {
  const router = useRouter();
  const { id } = router.query;

  async function handleDelete() {
    await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    mutate(`/api/snippets`);
    router.push("/");
  }

  // Listen for route changes and reset the state when leaving the page
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.includes(id)) {
        // Communicate with the _app.js to reset the state
        resetState(false);
      }
    };

    // Subscribe to the router events
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      // Unsubscribe from the router events when the component unmounts
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <>
      <BackLink url={"/"} />
      {editState && <p>Edited successfully</p>}
      <SnippetDetails onDelete={handleDelete} />
    </>
  );
}

export default SnippetDetailsPage;
