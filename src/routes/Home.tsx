import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 1) 100%
    ),
    url("https://assets.nflxext.com/ffe/siteui/vlv3/271ac55e-7228-438e-824e-92db37981e59/a7ab2752-151f-4823-bb42-d8987212e56a/JP-en-20220627-popsignuptwoweeks-perspective_alpha_website_small.jpg");
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * {
    max-width: 600px;
    text-align: center;
  }

  h1 {
    font-size: 3.125rem;
    font-weight: bolder;
  }
  h2 {
    font-size: 1.625rem;
    margin: 16px 0;
  }
  button {
    background-color: ${(props) => props.theme.logoRed};
    font-size: 1.625rem;
    color: white;
    border: none;
    padding: 10px 30px;
  }
`;

function Home() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <h1>Unlimited movies, TV shows, and anime.</h1>
      <h2>Watch anywhere. Cancel anytime.</h2>
      <button onClick={() => navigate("/movie")}>Start</button>
    </Wrapper>
  );
}

export default Home;
