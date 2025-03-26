export function createListQuery(params: Record<string, string[] | string>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
        return;
      }
      query.append(key, value.toString());
    }
  });
  return query.toString();
}

export const copyToClipboard = (text: string) => {
  // Use the newer Clipboard API when available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        // You can add success handling here (e.g., show a notification)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        // You can add error handling here
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      console.log(
        successful ? "Text copied to clipboard" : "Unable to copy text"
      );
      // You can add success/failure handling here
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // You can add error handling here
    }

    document.body.removeChild(textArea);
  }
};
