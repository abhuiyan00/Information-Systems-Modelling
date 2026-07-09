// Tiny HTML helpers. esc() guards every interpolated value; html`` is a no-op
// tag that just joins template parts (keeps editor highlighting + prettier-ish
// formatting). Arrays are joined so component lists drop straight in.

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function html(strings, ...values) {
  return strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.join("");
    if (v === undefined || v === null || v === false) v = "";
    return out + v + str;
  });
}
