import { createContext } from 'react';

const GalaxyContext = createContext({
  galaxy: null,
  setGalaxy: () => {}
});

export default GalaxyContext;