export const formatNumber = (value: number, places: number): number => {
    const expandedPlaces = Math.pow(10, places);
    return Math.round(value * expandedPlaces) / expandedPlaces;
};

export const range = (length: number): number[] => Array.from(Array(length).keys());
