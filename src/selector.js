export const getRelocation = (state) => state.relocation || {};
export const getComponents = (state) => getRelocation(state).components || [];
