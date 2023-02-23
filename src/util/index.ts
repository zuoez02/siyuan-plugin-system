export const log = (...p) => {
    console.log(`[Plugin System] `, ...p)
};

export const error = (...p) => console.error(`[Plugin System] `, ...p);