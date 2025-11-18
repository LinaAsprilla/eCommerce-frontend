export const images = [
  '/images/p1.webp',
  '/images/p3.webp',
  '/images/p4.webp'
];

export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

export const getRandomRating = (): number => {
  return Number((Math.random() * 2 + 3).toFixed(1));
};

export const getRandomReviews = (): number => {
  return Math.floor(Math.random() * 500) + 1;
};

export const getRandomColors = (): string[] => {
  const colorPalettes = [
    ['#000000', '#FFFFFF', '#FF5733'],
    ['#E74C3C', '#3498DB', '#2ECC71'],
    ['#9B59B6', '#F39C12', '#1ABC9C'],
    ['#34495E', '#E67E22', '#ECF0F1'],
    ['#C0392B', '#16A085', '#D35400'],
    ['#2980B9', '#27AE60', '#8E44AD'],
  ];
  const randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return colorPalettes[randomIndex];
};

export const getRandomIsNew = (): boolean => {
  return Math.random() > 0.7;
};
