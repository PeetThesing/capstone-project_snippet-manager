import styled from "styled-components";
import Button from "./Button";
import { useState } from "react";
import { Icon } from "@iconify/react";

function SnippetForm({ onSubmit, formName, defaultData }) {
  const [inputName, setInputName] = useState(defaultData?.name || "");
  const [inputCode, setInputCode] = useState(defaultData?.code || "");
  const [warningMessage, setWarningMessage] = useState("");
  const [isFormValidated, setIsFormValidated] = useState(false);

  function handleInputName(event) {
    const value = event.target.value;
    setInputName(value);
  }

  function handleInputCode(event) {
    const value = event.target.value;
    setInputCode(value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (inputName === "" || inputCode === "") {
      setWarningMessage(
        <span>
          <Icon icon="tabler:alert-circle-filled" height="2rem" /> Please fill
          in the required field
        </span>
      );
      setIsFormValidated(true);
    } else {
      setWarningMessage("");
    }
    const formData = new FormData(event.target);
    const snippetData = Object.fromEntries(formData);

    onSubmit(event, snippetData);
  }

  return (
    <StyledForm aria-labelledby={formName} onSubmit={handleSubmit}>
      <h2> {defaultData ? "Update Snippet" : "Add new Snippet"}</h2>
      <Warning>{warningMessage}</Warning>

      <p>
        <Icon icon="tabler:alert-circle" height="2rem" />
        &nbsp;Fields marked with an * are required
      </p>
      <label htmlFor="name">Name*</label>
      <StyledInputName
        value={inputName}
        onChange={handleInputName}
        type="text"
        id="name"
        name="name"
        placeholder="Code name"
        error={isFormValidated && inputName === ""}
      />
      <label htmlFor="code">Code*</label>

      <StyledCode
        value={inputCode}
        onChange={handleInputCode}
        type="text"
        id="code"
        name="code"
        rows="5"
        placeholder="Your code"
        error={isFormValidated && inputCode === ""}
      ></StyledCode>

      <label htmlFor="description">Description</label>
      <StyledFormElementOfCrime
        type="text"
        id="description"
        name="description"
        rows="5"
        placeholder="Description of the code"
        defaultValue={defaultData?.description}
      ></StyledFormElementOfCrime>
      <label htmlFor="link">Link</label>
      <StyledFormElementOfCrime
        as="input"
        type="text"
        id="link"
        name="link"
        placeholder="Type your link here"
        defaultValue={defaultData?.link}
      />
      <label htmlFor="tag">Tag</label>
      <StyledFormElementOfCrime
        as="select"
        id="tag"
        name="tag"
        placeholder="tag"
        defaultValue={defaultData?.tag}
      >
        <option value=""></option>
        <option value="html">html</option>
        <option value="javaScript">javaScript</option>
        <option value="next">next</option>
      </StyledFormElementOfCrime>
      <StyledButtonContainer>
        <Button type="submit" buttonName={defaultData ? "Update" : "Submit"} />
        <Button type="reset" buttonName="Reset" />
      </StyledButtonContainer>
    </StyledForm>
  );
}

export default SnippetForm;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  font-weight: 500;
`;

const StyledInputName = styled.input`
  border: 2px solid ${(props) => (props.error ? "red" : "initial")};
  height: 2rem;
  border-radius: 0.3rem;
  background-color: var(--light-color);
`;
const StyledCode = styled.textarea`
  border: 2px solid ${(props) => (props.error ? "red" : "initial")};
  height: 10rem;
  border-radius: 0.3rem;
  background-color: var(--primary-color);

  color: var(--white);
`;

const StyledFormElementOfCrime = styled.textarea`
  height: 2rem;
  border-radius: 0.3rem;
  background-color: var(--light-color);
  border: none;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Warning = styled.p`
  color: red;
`;
