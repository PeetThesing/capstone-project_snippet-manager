import { StyledButtonOrLink } from "./StyledButtonOrLink";
import { Icon } from "@iconify/react";

function Button({
  onClick,
  buttonName,
  buttonIcon,
  $backgroundColor,
  ...props
}) {
  return (
    <StyledButtonOrLink
      onClick={onClick}
      $backgroundColor={$backgroundColor}
      {...props}
    >
      <span role="img" aria-hidden="true">
        <Icon icon={buttonIcon} className="button-icon" />
      </span>
      {buttonName}
    </StyledButtonOrLink>
  );
}

export default Button;
