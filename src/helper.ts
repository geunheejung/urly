export const openInNewTab = (url: string) => {
  const W = 540, H = 569;  
  const xPos = (window.screen.width / 2) - (W / 2);
  const yPos = (window.screen.height / 2) - (H / 2);  
  const windowFeatures = `width=${W}, height=${H}, left=${xPos}, top=${yPos}`
  window.open(url, '_blank', windowFeatures);
};