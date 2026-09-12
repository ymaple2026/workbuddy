import { Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

interface AnimatedRoutesProps {
  children: React.ReactNode;
}

export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
}
