import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Layout from "./routes/Layout";
import Movie from "./routes/Movie";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

// import Layout from "./Layout";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie" element={<Movie />} />
          <Route path="tv" element={<Tv />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
