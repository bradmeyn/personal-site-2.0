document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll("pre code");

  codeBlocks.forEach((block) => {
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.className = "copy-button";
    block.parentNode.insertBefore(copyButton, block);

    copyButton.addEventListener("click", () => {
      const code = block.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    });
  });
});
