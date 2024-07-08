export default function hasObjectValue(obj, key, value) {
  return obj.hasOwnProperty(key) && obj[key] === value;
}
