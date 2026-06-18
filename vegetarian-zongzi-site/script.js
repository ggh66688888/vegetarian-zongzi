const prices = {
  signature: 88,
  quinoa: 105,
  peanut: 65,
  gift: 520,
};

const labels = {
  signature: "香菇栗子素肉粽",
  quinoa: "紅藜五穀素肉粽",
  peanut: "花生菜粽",
  gift: "綜合素粽禮盒",
};

const form = document.querySelector("#orderForm");
const totalAmount = document.querySelector("#totalAmount");
const dialog = document.querySelector("#orderDialog");
const orderSummary = document.querySelector("#orderSummary");
const closeDialog = document.querySelector("#closeDialog");
const copyOrder = document.querySelector("#copyOrder");

function numberValue(name) {
  const field = form.elements[name];
  return Math.max(0, Number.parseInt(field.value || "0", 10));
}

function formatCurrency(value) {
  return `NT$${value.toLocaleString("zh-TW")}`;
}

function calculateTotal() {
  return Object.keys(prices).reduce((sum, key) => {
    return sum + numberValue(key) * prices[key];
  }, 0);
}

function updateTotal() {
  totalAmount.textContent = formatCurrency(calculateTotal());
}

function buildSummary() {
  const lines = [];
  lines.push("素肉粽專賣店訂單摘要");
  lines.push(`姓名：${form.elements.name.value}`);
  lines.push(`電話：${form.elements.phone.value}`);
  lines.push("");
  lines.push("品項：");

  Object.keys(prices).forEach((key) => {
    const qty = numberValue(key);
    if (qty > 0) {
      lines.push(`- ${labels[key]} x ${qty} = ${formatCurrency(qty * prices[key])}`);
    }
  });

  lines.push("");
  lines.push(`預估金額：${formatCurrency(calculateTotal())}`);

  const note = form.elements.note.value.trim();
  if (note) {
    lines.push("");
    lines.push(`備註：${note}`);
  }

  return lines.join("\n");
}

form.addEventListener("input", updateTotal);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  orderSummary.textContent = buildSummary();
  dialog.showModal();
});

closeDialog.addEventListener("click", () => {
  dialog.close();
});

copyOrder.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(orderSummary.textContent);
  } catch (error) {
    const range = document.createRange();
    range.selectNodeContents(orderSummary);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }

  copyOrder.textContent = "已複製";
  window.setTimeout(() => {
    copyOrder.textContent = "複製摘要";
  }, 1400);
});

updateTotal();
