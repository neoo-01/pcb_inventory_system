let components = JSON.parse(localStorage.getItem("components")) || [];
let pcbItems = [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function save() {
  localStorage.setItem("components", JSON.stringify(components));
}

function addComponent() {
  let name = document.getElementById("cname").value;
  let part = document.getElementById("part").value;
  let stock = parseInt(document.getElementById("stock").value);
  let min = parseInt(document.getElementById("min").value);

  if (!name || isNaN(stock) || isNaN(min)) {
    alert("Fill all fields");
    return;
  }

  components.push({ name, part, stock, min });
  save();
  renderComponents();
  updateDropdown();

  document.getElementById("cname").value = "";
  document.getElementById("part").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("min").value = "";
}

function renderComponents() {
  let list = document.getElementById("componentList");
  list.innerHTML = "";

  components.forEach((c, i) => {
    let li = document.createElement("li");
    let low = c.stock < c.min ? " <span class='low'>LOW</span>" : "";
    li.innerHTML = `${c.name} (Stock: ${c.stock}) ${low}
      <button onclick="deleteComponent(${i})">Delete</button>`;
    list.appendChild(li);
  });

  document.getElementById("totalComp").textContent = components.length;
  document.getElementById("lowStock").textContent =
    components.filter(c => c.stock < c.min).length;
}

function deleteComponent(i) {
  components.splice(i, 1);
  save();
  renderComponents();
  updateDropdown();
}

function updateDropdown() {
  let select = document.getElementById("componentSelect");
  select.innerHTML = "";
  components.forEach((c, i) => {
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

function addToPCB() {
  let index = document.getElementById("componentSelect").value;
  let qty = parseInt(document.getElementById("qty").value);

  if (index === "" || isNaN(qty)) {
    alert("Select component and quantity");
    return;
  }

  pcbItems.push({ index: parseInt(index), qty });
  renderPCB();
}

function renderPCB() {
  let list = document.getElementById("pcbItems");
  list.innerHTML = "";
  pcbItems.forEach(item => {
    let li = document.createElement("li");
    li.textContent = components[item.index].name + " x " + item.qty;
    list.appendChild(li);
  });
}

function producePCB() {
  pcbItems.forEach(item => {
    components[item.index].stock -= item.qty;
  });

  pcbItems = [];
  renderPCB();
  save();
  renderComponents();

  alert("PCB Produced");
}

// initial load
renderComponents();
updateDropdown();
