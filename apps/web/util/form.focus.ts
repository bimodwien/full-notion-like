// Returns true when there was an invalid field to focus.
export function focusFirstInvalid(form: HTMLFormElement, errors: Record<string, string>) {
  const [firstName] = Object.keys(errors);
  if (!firstName) return false;

  const field = form.elements.namedItem(firstName);
  if (field instanceof HTMLElement) field.focus();
  return true;
}
