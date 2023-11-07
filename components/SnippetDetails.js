import Link from "next/link";
import { useRouter } from "next/router";

import styled from "styled-components";
import useSWR from "swr";

function SnippetDetails({ onDelete }) {
  const router = useRouter();

  const { id } = router.query;

  const { data, isLoading, error } = useSWR(`/api/snippets/${id}`);

  if (error) {
    return <div>Failed to load Details View 🥺</div>;
  }
  if (isLoading) {
    return <div>Loading Details View 🤓</div>;
  }

  const { name, code, description, link, tags, links } = data;

  console.log("data: ", data);
  console.log("link: ", link);
  console.log("links: ", links);

  return (
    <section>
      <Title>{name}</Title>
      <Heading>Code</Heading>
      <code>{code}</code>
      <Heading>Description</Heading>
      <p>{description}</p>
      <Heading>Further Resources</Heading>
      {links?.map((horst, index) => (
        <div key={index}>
          <a
            href={`https://${horst}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {horst}
          </a>
        </div>
      ))}
      <Heading>Tag</Heading>
      <p>{tags}</p>

      <Link href={`/${id}/edit`}>
        <span role="img" aria-label="hidden">
          ✏️{" "}
        </span>{" "}
        Edit
      </Link>

      <button onClick={onDelete}>
        <span role="img" aria-label="hidden">
          ❌{" "}
        </span>
        Delete
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
