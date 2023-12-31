import LinkLayout from "@/components/LinkLayout";
import SnippetForm from "@/components/SnippetForm";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import StyledToaster from "@/components/StyledToaster";

const notify = () =>
  toast.success("Added snippet successfully.", {
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });

function FormPage({ defaultTags }) {
  const [error, setError] = useState(null);
  const { mutate } = useSWR("/api/snippets");
  const router = useRouter();

  async function createSnippet(event, snippetData) {
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(snippetData),
      });
      if (response.ok) {
        notify();
        setError(null);
        mutate();
        event.target.reset();
        event.target.elements.name.focus();
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      response.status(500).json({ error: "😵‍💫 Something went wrong" });
    }
  }

  return (
    <StyledCreatePage>
      <StyledToaster />
      <LinkLayout
        url={"/"}
        linkName={"Go Back"}
        linkIcon="line-md:arrow-left"
      />
      <SnippetForm onSubmit={createSnippet} defaultTags={defaultTags} />
    </StyledCreatePage>
  );
}

export default FormPage;

const StyledSuccessfullyMessage = styled.div`
  color: var(--primary-color);
  display: flex;
  flex-direction: column;

  align-items: center;
  font-size: large;
  margin-bottom: 1rem;
`;

const StyledCreatePage = styled.div`
  margin: 2rem 2rem 6rem 2rem;
  color: var(--primary-color);
`;
