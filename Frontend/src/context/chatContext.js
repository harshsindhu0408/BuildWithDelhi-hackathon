import { createContext } from "react";

const chatContext = createContext({
  clearAnalysisData: () => {}, // Default empty function
});

export default chatContext;
