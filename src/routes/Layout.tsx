import { motion } from "framer-motion";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

const Wrapper = styled(motion.div)`
  width: 100%;
  overflow-x: hidden;
`;

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.625rem;
`;

function Layout() {
  return (
    <Wrapper>
      <Header />
      <Suspense fallback={<Loader>Loading...</Loader>}>
        <Outlet />
      </Suspense>
    </Wrapper>
  );
}

export default Layout;
