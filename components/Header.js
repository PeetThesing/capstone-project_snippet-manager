import styled from "styled-components";

function Header() {
  return <Logo>/ˈsnɪp.ɪt/</Logo>;
}

export default Header;

const Logo = styled.h1`
  display: flex;
  position: fixed;
  color: var(--white);
  background-color: var(--teal);
  justify-content: center;
  margin: 0 0 1rem 0;
  padding: 0.5rem;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;
