import { Montserrat } from "next/font/google";
import { createGlobalStyle } from "styled-components";

const montserratFont = Montserrat({ subsets: ["latin"] });

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    --primary-color: linear-gradient(89deg, #9B2FC4 0.91%, #0045E8 99.91%);
    --main-blue:#0045E8;
    --main-lila:#9B2FC4;
    --gradient: linear-gradient(90deg, rgba(155,47,196,1) 0%, rgba(0,69,232,1) 100%);
    --white: white;
    --text-color: #000000;
    --light-color: #DEE7FF;
  }

  body {
    font-family: ${montserratFont.style.fontFamily};
    margin: 6rem 0 0 0;
    background: var(--gradient)
  }
`;
