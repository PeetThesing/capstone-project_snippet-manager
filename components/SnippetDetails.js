import React, { useEffect } from 'react';
import from 'prismjs';
import 'prismjs/themes/prism-dark-name.css'; // Stelle sicher, dass du das richtige Theme verwendest
import 'prismjs/components/prism-javascript'; // Beispiel: Für JavaScript-Syntaxhervorhebung



import Link from "next/link";
import { useRouter } from "next/router";

import styled from "styled-components";
import useSWR, { mutate } from "swr";

function SnippetDetails({ onDelete }) {
  const router = useRouter();

  const { id } = router.query;

  const { data, isLoading, error } = useSWR(`/api/snippets/${id}`);
  const response = {};

  if (response.ok) {
    mutate();
  }

  if (error) {
    return <div>Failed to load Details View 🥺</div>;
  }
  if (isLoading) {
    return <div>Loading Details View 🤓</div>;
  }

  const { name, code, description, link, tags } = data;

  return (
    <section>
      <Title>{name}</Title>
      <Heading>Code</Heading>
      <code>{code}</code>
      <Heading>Description</Heading>
      <p>{description}</p>
      <Heading>Link</Heading>
      <Link href={link}>Further information</Link>
      <Heading>Tag</Heading>
      <p>{tags}</p>

      <Link href={`/${id}/edit`}>
        <span aria-label="hidden">✏️ </span> Edit
      </Link>

      <button onClick={onDelete}>
        <span aria-label="hidden">❌ </span>Delete
      </button>
    </section>
  );
}
const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const Heading = styled.h3`
  color: var(--primary-color);
`;

export default SnippetDetails;
