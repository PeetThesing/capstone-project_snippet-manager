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
  const [relevantLastSearches, setRelevantLastSearches] = useState([]);

  const fuse = new Fuse(data, fuseOptions);

  const inputRef = useRef(null);

  // function globalSearch(event) {
  //   handleSearchChange(event);
  //   handleSearch(event);
  // }

  function handleClick() {
    inputRef.current.focus();
  }

  // function handleSearchChange(event) {
  //   setSearchTerm(event.target.value);
  // }

  function updateLastSearches(newTerm) {
    if (newTerm !== "" && newTerm !== lastSearches[0]) {
      setLastSearches((prevSearches) => [
        newTerm,
        ...prevSearches.filter((term) => term !== newTerm),
      ]);
    }
    if (newTerm === "") {
      const zwischenvariable = lastSearches.slice(0, 5);
      setRelevantLastSearches(zwischenvariable);
    } else {
      const zwischenvariable = lastSearches
        .filter((lastSearch) => {
          return lastSearch.startsWith(newTerm);
        })
        .slice(0, 5);
      setRelevantLastSearches(zwischenvariable);
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

    setSearchTerm(event.target.value);
    const searchResult = fuse.search(searchTerm).slice(0, 10);
    setResults(searchResult.map((result) => result.item));

    searchTerm !== "" ? setIsSearching(true) : setIsSearching(false);
  }

  function handleLastSearchClick(lastSearchTerm) {
    if (inputRef.current) {
      inputRef.current.value = lastSearchTerm;
      updateLastSearches(lastSearchTerm);
      const searchResult = fuse.search(lastSearchTerm).slice(0, 10);
      setResults(searchResult.map((result) => result.item));
      setIsSearching(true);
      console.log("lastSearchTerm: ", lastSearchTerm);
    }
  }

  // function handleOuterClick(event) {
  //   if (event.target !== event.currentTarget) {
  //     setIsDropdown(false)
  //   }
  // }

  if (error) return <p>failed to load...🥶😵‍💫😨😩😢</p>;
  if (isLoading) return <p>wait....wait...wait... still loading...🤓</p>;

  return (
    <>
      <StyledLastSearchContainer onBlur={handleBlur}>
        <StyledSearchBarContainer tabIndex={0}>
          <StyledSearchBarForm onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="search"></label>
            <StyledSearchBarInput
              ref={inputRef}
              type="text"
              id="search"
              name="search"
              placeholder="Search"
              autoComplete="off"
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
              // onBlur={handleBlur}
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
            <StyledLine></StyledLine>
            <StyledList>
              {relevantLastSearches?.map((search, index) => (
                <StyledListItem
                  key={index}
                  onClick={() => handleLastSearchClick(search)}
                  onKeyDown={() => handleLastSearchClick(search)}
                >
                  {" "}
                  <Icon icon="mdi:recent" height="1.3rem" /> {search}
                </StyledListItem>
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
  padding: 0;
  border-radius: 0.5rem;
  background-color: #c1d2d7;
  margin: 0 1.5rem;
  border: solid red 1px;

  &:focus-within {
    outline: 2px solid var(--primary-color);
    border-radius: 0.5rem;
    transition: outline 0.3s ease;
  }
`;

const StyledSearchBarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3rem;
  grid-template-rows: 100%;
  justify-items: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #c1d2d7;
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
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
`;

const StyledDropdown = styled.div`
  margin: 0 24px;
  padding: 0rem 0rem 0.5rem 0rem;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
`;

const StyledLine = styled.hr`
  margin: 0;
  border: none;
  height: 0.01rem;
  background-color: var(--primary-color);
`;
