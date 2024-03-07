import { StyledPage } from "@/components/Layout";
import SnippetCardList from "@/components/SnippetCardList";
import Fuse from "fuse.js";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
import useSWR from "swr";
import StyledToaster from "@/components/StyledToaster";
import {
  StyledLastSearchContainer,
  StyledSearchBarContainer,
  StyledSearchBarForm,
  StyledSearchBarInput,
  StyledButton,
  StyledDropdown,
  StyledList,
  StyledListItem,
  StyledLine,
  StyledSorryMessage,
} from "@/components/Layout";
const fuseOptions = {
  threshold: 0.5,
  keys: ["name", "code", "description", "links", "tag"],
};

export default function HomePage({ onToggleFavorite, favorites }) {
  // define state variable which stores search results
  const [results, setResults] = useState([]);
  // define state variable which stores current search term
  const [searchTerm, setSearchTerm] = useState("");
  // define state variable which stores last five search terms; gets updated when updateLastSearches is called
  const [lastSearches, setLastSearches] = useLocalStorageState("lastSearches", {
    defaultValue: [],
  });
  // boolean state variable which is set to true when search is initiated (either by typing, clicking, or hitting enter)
  const [isSearching, setIsSearching] = useState(false);
  //boolean state variable that is set to true once the search-field is clicked/activated
  const [isDropdown, setIsDropdown] = useState(false);
  //state variable used to navigate trough and select specific items from the lastSearches-array
  const [currentIndex, setCurrentIndex] = useState(-1);

  //fetches data from API
  const { data } = useSWR("/api/snippets");

  //Set up fuse instance
  const fuse = new Fuse(data, fuseOptions);

  const inputRef = useRef(null);

  // set the focus on StyledSearchBarInput when user clicks the Search-Icon
  function handleClick() {
    inputRef.current.focus();
  }

  function updateLastSearches(newTerm) {
    if (newTerm.trim() !== "") {
      setLastSearches((prevSearches) =>
        [newTerm, ...prevSearches.filter((term) => term !== newTerm)].slice(
          0,
          5
        )
      );
    }
  }

  function navigateSearchHistory(direction) {
    if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    if (direction === "down" && currentIndex < lastSearches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowUp") {
      navigateSearchHistory("up");
    }
    if (event.key === "ArrowDown") {
      navigateSearchHistory("down");
    }
    if (event.key === "Enter") {
      updateLastSearches(searchTerm);
    }
    if (event.key === "Enter" && currentIndex !== -1) {
      setIsSearching(true);
      setSearchTerm(lastSearches[currentIndex]);
      const searchTermFromDropDown = lastSearches[currentIndex];
      inputRef.current.value = searchTermFromDropDown;
      const searchResult = fuse.search(searchTermFromDropDown).slice(0, 10);
      setResults(searchResult.map((result) => result.item));
    }
  }

  function handleBlur() {
    updateLastSearches(searchTerm);
    setIsDropdown(false);
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

  function handleLastSearchClick(event, lastSearchTerm) {
    event.preventDefault();
    setIsSearching(true);
    if (inputRef.current) {
      inputRef.current.value = lastSearchTerm;
      updateLastSearches(lastSearchTerm);
      const searchResult = fuse.search(lastSearchTerm).slice(0, 10);
      setResults(searchResult.map((result) => result.item));
    }
  }
  return (
    <StyledPage>
      <StyledToaster />
      <StyledLastSearchContainer
        onFocus={() => setIsDropdown(true)}
        onBlur={handleBlur}
      >
        <StyledSearchBarContainer>
          <StyledSearchBarForm onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="search"></label>
            <StyledSearchBarInput
              ref={inputRef}
              type="text"
              id="search"
              name="search"
              placeholder="search snippets"
              autoComplete="off"
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
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
          <StyledDropdown aria-label="last searches">
            <StyledLine />
            <StyledList role="list" aria-live="polite">
              {lastSearches
                ?.filter((search) => {
                  if (searchTerm === "") {
                    return true;
                  }
                  if (
                    search.toLowerCase().startsWith(searchTerm.toLowerCase())
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                })
                .map((search, index) => (
                  <StyledListItem
                    key={index}
                    aria-selected={currentIndex === index}
                    onMouseDown={() => handleLastSearchClick(event, search)}
                    onMouseEnter={() => setCurrentIndex(index)}
                    onMouseLeave={() => setCurrentIndex(-1)}
                    tabIndex={0}
                    $highlighted={currentIndex === index}
                  >
                    <Icon icon="mdi:recent" height="1.3rem" /> {search}
                  </StyledListItem>
                ))}
            </StyledList>
          </StyledDropdown>
        )}
      </StyledLastSearchContainer>
      {isSearching === true && results.length === 0 ? (
        <StyledSorryMessage>Sorry, no snippets found... 😭</StyledSorryMessage>
      ) : (
        <SnippetCardList
          data={isSearching === true ? results : data}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
        />
      )}
    </StyledPage>
  );
}
