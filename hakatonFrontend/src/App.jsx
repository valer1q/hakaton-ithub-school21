import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Button from "./Button.jsx";
import Demo from "./Table.jsx";
import StatisticsPage from "./StatisticsPage.jsx"; 
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

function App() {
  const [levelFilter, setLevelFilter] = useState(null);
  const [skillFilter, setSkillFilter] = useState(null);

  return (
    <MantineProvider theme={theme}>
      <Router>
        <Header />
        <Sidebar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Button
                  levelFilter={levelFilter}
                  setLevelFilter={setLevelFilter}
                  skillFilter={skillFilter}
                  setSkillFilter={setSkillFilter}
                />
                <Demo levelFilter={levelFilter} skillFilter={skillFilter} />
              </>
            }
          />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;