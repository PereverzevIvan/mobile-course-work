import React, { createContext, useContext, useState, ReactNode } from "react";
import { TReport } from "@/types/results";

interface UserContextType {
  reports: TReport[] | null;
  setReports: React.Dispatch<React.SetStateAction<TReport[] | null>>;
}

const ReportsContext = createContext<UserContextType | undefined>(undefined);

export const ResultsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<TReport[] | null>([]);

  return (
    <ReportsContext.Provider value={{ reports, setReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useResultsContext = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
