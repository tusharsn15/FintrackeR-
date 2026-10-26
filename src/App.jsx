import { useApp, AppProvider } from "./context/AppContext";
import { Shell } from "./components/Shell";
import { Login } from "./pages/Login";
import { Landing } from "./pages/Landing";

export function Screens() {
  const { user, setUser, currentPath, navigate } = useApp();

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  if (currentPath === "/" || currentPath === "/landing") {
    return <Landing onStart={() => navigate(user ? "/dashboard" : "/login")} />;
  }

  if (currentPath === "/login") {
    if (user) {
      return <Shell onLogout={logout} />;
    }
    return <Login onBack={() => navigate("/")} />;
  }

  if (!user) {
    return <Login onBack={() => navigate("/")} />;
  }

  return <Shell onLogout={logout} />;
}

export function App() {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
}

export default App;
