import { motion } from "framer-motion";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

const Wrapper = styled(motion.div)`
  width: 100%;
  padding-bottom: 500px;
  overflow-x: hidden;
`;

function Layout() {
  return (
    <Wrapper>
      <Header />
      <Suspense fallback={<div>loading...</div>}>
        <Outlet />
      </Suspense>
    </Wrapper>
  );
}

export default Layout;
