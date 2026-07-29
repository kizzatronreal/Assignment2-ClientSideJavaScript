const studentId = "200601722";
const studentName = "Luke";

document.addEventListener("DOMContentLoaded", () => {
  const footerP = document.getElementById("studentInfo");
  footerP.textContent = `Student: ${studentName} | Student ID: ${studentId}`;
});


class Pizza {
  constructor(customerName, phone, size, crust, toppings, quantity, spiceLevel, orderType, address, instructions) {
    this.customerName = customerName;
    this.phone = phone;
    this.size = size;
    this.crust = crust;
    this.toppings = toppings; // array
    this.quantity = quantity;
    this.spiceLevel = spiceLevel;
    this.orderType = orderType;
    this.address = address;
    this.instructions = instructions;
  }

  // Builds and returns a human-redable description of the order.
  getOrderDescription() {
    const toppingsText = this.toppings.length > 0
      ? this.toppings.join(", ")
      : "no extra toppings";

    const spiceWords = ["Mild", "A little kick", "Medium", "Hot", "Very hot", "Fire breathing"];
    const spiceText = spiceWords[this.spiceLevel] || "Medium";

    let deliveryText = this.orderType === "Delivery"
      ? `delivered to ${this.address}`
      : "ready for pickup at the counter";

    let description =
      `Thanks, ${this.customerName}! We've got your order: ` +
      `${this.quantity} x ${this.size} pizza with ${this.crust} crust, topped with ${toppingsText}. ` +
      `Spice level: ${spiceText}. This order will be ${deliveryText}. ` +
      `We'll contact you at ${this.phone} if there are any questions.`;

    if (this.instructions && this.instructions.trim() !== "") {
      description += ` Special instructions noted: "${this.instructions.trim()}".`;
    }

    return description;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pizzaForm");
  const orderTypeSelect = document.getElementById("orderType");
  const addressField = document.getElementById("address");
  const spiceSlider = document.getElementById("spiceLevel");
  const spiceValueLabel = document.getElementById("spiceLevelValue");
  const outputSection = document.getElementById("orderOutput");
  const outputParagraph = document.getElementById("orderDescription");

  // Live update of the spice level number next to the slider
  spiceSlider.addEventListener("input", () => {
    spiceValueLabel.textContent = spiceSlider.value;
  });

  function clearErrors() {
    document.querySelectorAll(".error-msg").forEach(el => (el.textContent = ""));
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  }

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add("invalid");
    errorEl.textContent = message;
  }

  // Validates the whole form. Returns true only if every rule passes.
  function validateForm() {
    clearErrors();
    let isValid = true;

    // Name
    const nameInput = document.getElementById("custName");
    const nameVal = nameInput.value.trim();
    if (nameVal.length < 2) {
      showError(nameInput, document.getElementById("custNameError"), "Please enter your full name.");
      isValid = false;
    }

    // Phone
    const phoneInput = document.getElementById("custPhone");
    const phonePattern = /^[0-9\-\+\s]{7,15}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      showError(phoneInput, document.getElementById("custPhoneError"), "Please enter a valid phone number.");
      isValid = false;
    }

    // Size
    const sizeSelect = document.getElementById("pizzaSize");
    if (sizeSelect.value === "") {
      showError(sizeSelect, document.getElementById("pizzaSizeError"), "Please choose a pizza size.");
      isValid = false;
    }

    // Crust (radio group)
    const crustChecked = document.querySelector('input[name="crust"]:checked');
    if (!crustChecked) {
      document.getElementById("crustError").textContent = "Please choose a crust type.";
      isValid = false;
    }

    // Quantity
    const quantityInput = document.getElementById("quantity");
    const quantityVal = Number(quantityInput.value);
    if (!Number.isInteger(quantityVal) || quantityVal < 1 || quantityVal > 10) {
      showError(quantityInput, document.getElementById("quantityError"), "Quantity must be a whole number between 1 and 10.");
      isValid = false;
    }

    // Order type
    if (orderTypeSelect.value === "") {
      showError(orderTypeSelect, document.getElementById("orderTypeError"), "Please select delivery or pickup.");
      isValid = false;
    }

    // Address required only if delivery is selected
    if (orderTypeSelect.value === "Delivery" && addressField.value.trim() === "") {
      showError(addressField, document.getElementById("addressError"), "Please enter a delivery address.");
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    //only continue if validation passes
    if (!validateForm()) {
      outputSection.classList.add("hidden");
      return;
    }

    // capture values from each form input
    const customerName = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const size = document.getElementById("pizzaSize").value;
    const crust = document.querySelector('input[name="crust"]:checked').value;
    const toppings = Array.from(document.querySelectorAll('input[name="toppings"]:checked')).map(cb => cb.value);
    const quantity = Number(document.getElementById("quantity").value);
    const spiceLevel = Number(document.getElementById("spiceLevel").value);
    const orderType = orderTypeSelect.value;
    const address = addressField.value.trim();
    const instructions = document.getElementById("instructions").value;

    // instantiate Pizza object and output its generated description
    const order = new Pizza(customerName, phone, size, crust, toppings, quantity, spiceLevel, orderType, address, instructions);

    outputParagraph.textContent = order.getOrderDescription();
    outputSection.classList.remove("hidden");
    outputSection.scrollIntoView({ behavior: "smooth" });
  });
});
