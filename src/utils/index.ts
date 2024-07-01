export const validateInputNumber = (value: any) => {
    if (isNaN(value)) {
      return "Giá trị không hợp lệ";
    }
    return true;
};

export const getRandomImagePath = (imagePaths: any) => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
}

export const capitalizeFirstLetter = (string: string) => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}