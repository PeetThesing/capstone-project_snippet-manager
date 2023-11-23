import SnippetCardList from "@/components/SnippetCardList";
import useSWR from "swr";
import Fuse from "fuse.js";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import useLocalStorageState from "use-local-storage-state";

const fuseOptions = {
  threshold: 0.3,
  keys: ["name", "code", "description", "links", "tag"],
};

export default function HomePage() {
  const { data, error, isLoading } = useSWR("api/snippets");
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearches, setLastSearches] = useLocalStorageState("lastSearches", {
    defaultValue: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);

  const fuse = new Fuse(data, fuseOptions);

  const inputRef = useRef(null);

  function globalSearch(event) {
    handleSearchChange(event);
    handleSearch(event);
  }

  function handleClick() {
    inputRef.current.focus();
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function updateLastSearches(newTerm) {
    if (newTerm !== "" && newTerm !== lastSearches[0]) {
      setLastSearches((prevSearches) =>
        [newTerm, ...prevSearches.filter((term) => term !== newTerm)].slice(
          0,
          5
        )
      );
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      updateLastSearches(searchTerm);
    }
  }

  function handleBlur() {
    updateLastSearches(searchTerm);
    // setIsDropdown(false);
  }

  function handleSearch(event) {
    if (!fuse) {
      return;
    }

    const searchPattern = event.target.value;
    const searchResult = fuse.search(searchPattern).slice(0, 10);
    setResults(searchResult.map((result) => result.item));

    searchPattern !== "" ? setIsSearching(true) : setIsSearching(false);
  }

  console.log("results: ", results);
  console.log("lastSearches:", lastSearches);

  if (error) return <p>failed to load...🥶😵‍💫😨😩😢</p>;
  if (isLoading) return <p>wait....wait...wait... still loading...🤓</p>;

  return (
    <>
      <StyledLastSearchContainer>
        <StyledSearchBarContainer tabIndex={0} $isDropdown={isDropdown}>
          <StyledSearchBarForm onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="search"></label>
            <StyledSearchBarInput
              ref={inputRef}
              type="text"
              id="search"
              name="search"
              placeholder="Search"
              onChange={globalSearch}
              onKeyDown={handleKeyPress}
              onBlur={handleBlur}
              onFocus={() => setIsDropdown(true)}
            />
          </StyledSearchBarForm>
          <StyledButton onClick={handleClick}>
            <Icon
              icon="line-md:search"
              height="2rem"
              color="var(--primary-color)"
            />
          </StyledButton>
        </StyledSearchBarContainer>
        {isDropdown && (
          <StyledDropdown>
            {/* <strong>Last Searches:</strong> */}
            <StyledList>
              {lastSearches?.map((search, index) => (
                <li key={index}>{search}</li>
              ))}
            </StyledList>
          </StyledDropdown>
        )}
      </StyledLastSearchContainer>
      <SnippetCardList data={isSearching ? results : data} />
    </>
  );
}

const StyledLastSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:focus-within {
    outline: 2px solid var(--primary-color);

    transition: outline 0.3s ease;
  }
`;

const StyledSearchBarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3rem;
  grid-template-rows: 100%;
  justify-items: center;
  align-items: center;

  /* border: solid red 1px; */

  margin: 1.5rem 1.5rem 0 1.5rem;

  border-radius: 0.5rem;
  background-color: #c1d2d7;

  /* &:focus-within {
    outline: 2px solid var(--primary-color);

    transition: outline 0.3s ease;
  } */
`;
const StyledSearchBarForm = styled.form`
  height: 100%;
  width: 100%;
`;
const StyledSearchBarInput = styled.input`
  outline: none;
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  padding: 1rem 0.5rem;
  font-size: 1.2rem;
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
`;

const StyledDropdown = styled.div`
  margin: 0 24px;
  padding: 0;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
`;
