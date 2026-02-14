let components = JSON.parse(localStorage.getItem("components")) || [];
let pcbItems = [];

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function saveComponents() {
  localStorage.setItem("components", JSON.stringify(components));
}

function addComponent() {
  let name = document.getElementById("cname").value;
  let part = document.getElementById("part").value;
  let stock = parseInt(document.getElementById("stock").value);
  let min = parseInt(document.getElementById("min").value);

  components.push({ name, part, stock, min });
  saveComponents();
  displayComponents();
  updateDropdown();
}

function displayComponents() {
  let list = document.getElementById("componentList");
  list.innerHTML = "";

  components.forEach(c => {
    let li = document.createElement("li");
    li.innerHTML = `${c.name} (Stock: ${c.stock}) 
    ${c.stock < c.min ? "<span class='low'>LOW</span>" : ""}`;
    list.appendChild(li);
  });

  updateDashboard();
}

function updateDropdown() {
  let select = document.getElementById("componentSelect");
  select.innerHTML = "";

  components.forEach((c, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.text = c.name;
    select.appendChild(option);
  });
}

function addToPCB() {
  let index = document.getElementById("componentSelect").value;
  let qty = parseInt(document.getElementById("qty").value);

  pcbItems.push({ index, qty });

  let list = document.getElementById("pcbItems");
  let li = document.createElement("li");
  li.textContent = components[index].name + " x " + qty;
  list.appendChild(li);
}

function producePCB() {
  pcbItems.forEach(item => {
    components[item.index].stock -= item.qty;
  });

  saveComponents();
  displayComponents();
  alert("PCB Produced, stock updated");
}

function updateDashboard() {
  document.getElementById("totalComp").textContent = components.length;

  let low = components.filter(c => c.stock < c.min).length;
  document.getElementById("lowStock").textContent = low;
}

// load on start
displayComponents();
updateDropdown();
