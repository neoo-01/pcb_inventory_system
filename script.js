let components = JSON.parse(localStorage.getItem("components")) || [];
let pcbItems = [];

/* sound */
function playClick(){ document.getElementById("clickSound").play(); }
function playSuccess(){ document.getElementById("successSound").play(); }

/* tab switching */
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    playClick();
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

/* add component */
function addComponent(){
  playClick();
  let name=document.getElementById("cname").value;
  let part=document.getElementById("part").value;
  let stock=parseInt(document.getElementById("stockInput").value);
  let min=parseInt(document.getElementById("minInput").value);

  if(!name || isNaN(stock)) return;

  components.push({name,part,stock,min});
  localStorage.setItem("components",JSON.stringify(components));

  renderComponents();
  updateSelect();
  playSuccess();
}

/* render components */
function renderComponents(){
  let list=document.getElementById("componentList");
  list.innerHTML="";
  let low=0;

  components.forEach((c,i)=>{
    if(c.stock<=c.min) low++;

    let li=document.createElement("li");
    li.innerHTML=`${c.name} (${c.stock}) <button onclick="deleteComp(${i})">Delete</button>`;
    list.appendChild(li);
  });

  document.getElementById("totalComp").innerText=components.length;
  document.getElementById("lowStock").innerText=low;
}

/* delete */
function deleteComp(i){
  if(!confirm("Delete this component?")) return;
  components.splice(i,1);
  localStorage.setItem("components",JSON.stringify(components));
  renderComponents();
  updateSelect();
}


/* select dropdown */
function updateSelect(){
  let sel=document.getElementById("componentSelect");
  sel.innerHTML="";
  components.forEach((c,i)=>{
    let opt=document.createElement("option");
    opt.value=i;
    opt.textContent=c.name;
    sel.appendChild(opt);
  });
}

/* pcb builder */
function addToPCB(){
  playClick();
  let idx=document.getElementById("componentSelect").value;
  let qty=parseInt(document.getElementById("qtyInput").value);
  if(isNaN(qty) || qty<=0) return;

  pcbItems.push({idx,qty});
  renderPCB();
}

/* render pcb list */
function renderPCB(){
  let list=document.getElementById("pcbList");
  list.innerHTML="";
  pcbItems.forEach(it=>{
    let li=document.createElement("li");
    li.innerText=components[it.idx].name+" x "+it.qty;
    list.appendChild(li);
  });
}

/* clear pcb */
function clearPCB(){
  pcbItems=[];
  renderPCB();
}

/* produce pcb */
function producePCB(){
  playSuccess();
  pcbItems.forEach(it=>{
    components[it.idx].stock -= it.qty;
    if(components[it.idx].stock < it.qty){
  alert("Not enough stock for " + components[it.idx].name);
  return;
}

  });
  localStorage.setItem("components",JSON.stringify(components));
  pcbItems=[];
  renderPCB();
  renderComponents();
}

/* CSV */
function importCSV(){
  let file=document.getElementById("csvInput").files[0];
  let reader=new FileReader();
  reader.onload=function(e){
    let rows=e.target.result.split("\n");
    rows.slice(1).forEach(r=>{
      let c=r.split(",");
      if(c.length>=4){
        components.push({
          name:c[0],
          part:c[1],
          stock:parseInt(c[2]),
          min:parseInt(c[3])
        });
      }
    });
    localStorage.setItem("components",JSON.stringify(components));
    renderComponents();
    updateSelect();
  }
  reader.readAsText(file);
}

function exportCSV(){
  let csv="name,part,stock,min\n";
  components.forEach(c=>{
    csv+=`${c.name},${c.part},${c.stock},${c.min}\n`;
  });

  let blob=new Blob([csv]);
  let a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="components.csv";
  a.click();
}

function applyTheme(){
  const p = document.getElementById("primaryColor").value;
  const s = document.getElementById("secondaryColor").value;
  const b = document.getElementById("bgColor").value;

  document.documentElement.style.setProperty('--primary', p);
  document.documentElement.style.setProperty('--secondary', s);
  document.documentElement.style.setProperty('--bg', b);

  localStorage.setItem("theme", JSON.stringify({p,s,b}));
}

function resetTheme(){
  localStorage.removeItem("theme");
  location.reload();
}

// load saved theme
const savedTheme = JSON.parse(localStorage.getItem("theme"));
if(savedTheme){
  document.documentElement.style.setProperty('--primary', savedTheme.p);
  document.documentElement.style.setProperty('--secondary', savedTheme.s);
  document.documentElement.style.setProperty('--bg', savedTheme.b);
}



/* init */
renderComponents();
updateSelect();

