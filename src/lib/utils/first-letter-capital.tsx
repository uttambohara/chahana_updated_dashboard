export default function firstLetterCapital(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
}
