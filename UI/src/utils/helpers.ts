export function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function truncateString(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
}
