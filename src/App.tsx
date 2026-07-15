import "./App.scss";
import ApplySection from "./components/ApplySection";
import CasesSection from "./components/CasesSection";
import FooterSection from "./components/FooterSection";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import PartnersSection from "./components/PartnersSection";
import ProcessSection from "./components/ProcessSection";
import ServicesSection from "./components/ServicesSection";
import SnapshotSection from "./components/SnapshotSection";
import TracksSection from "./components/TracksSection";
import NewVersionPage from "./components/v2/NewVersionPage";

function App() {
  const page = new URLSearchParams(window.location.search).get("page");

  if (page === "v2") {
    return <NewVersionPage />;
  }

  const loginUrl = import.meta.env.VITE_LOGIN_URL || "#";
  const projectsUrl = import.meta.env.VITE_PROJECTS_URL || "#cases";

  return (
    <div className="page-shell">
      <Header loginUrl={loginUrl} projectsUrl={projectsUrl} />

      <main id="top">
        <HeroSection />
        <IntroSection />
        <ServicesSection />
        <TracksSection />
        <CasesSection />
        <SnapshotSection />
        <ProcessSection />
        <PartnersSection />
        <ApplySection />
      </main>

      <FooterSection />
    </div>
  );
}

export default App;
