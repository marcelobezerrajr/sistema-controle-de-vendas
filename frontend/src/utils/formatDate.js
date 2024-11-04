export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date + "T00:00:00");
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}/${month}/${day}`;
};