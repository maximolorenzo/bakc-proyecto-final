export const generateCartErrorInfo = (cart) => {
  return `
    El producto no se encuentra en Stock
    `;
};

export const generateProductErrorInfo = (product) => {
  return `
    Una o mas propiedades estan incompletas o son invalidas
    `;
};
