import { useState } from "react";
import { Icon } from "@iconify/react";
import styled, { css } from "styled-components";

export default function CopyWithOneClick({ iconColor, codeData, isDetail }) {
  const [isCopied, setIsCopied] = useState(false);
  async function handleClick() {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
    await navigator.clipboard.writeText(codeData);
  }

  return (
    <StyledButton $isDetail={isDetail} type="button" onClick={handleClick}>
      <Icon
        icon={isCopied ? "mingcute:check-fill" : "ci:copy"}
        color="var(--main-lila)"
        aria-label={isCopied ? "code copied" : "copy code"}
        width={isDetail ? "16" : "48"}
      />
      {isDetail && (isCopied ? "code copied" : "copy code")}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: absolute;
  background: transparent;
  color: var(--main-lila);
  /* border: solid red 1px; */
  border: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  ${({ $isDetail }) =>
    $isDetail
      ? css`
          top: 0.3rem;
          right: 0.3rem;
        `
      : css`
          bottom: 1rem;
          right: 1rem;
        `}
`;
