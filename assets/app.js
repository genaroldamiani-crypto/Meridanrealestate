/* ============ MERIDIAN — shared site script ============ */

/* ---------- property data ---------- */
const PROPERTIES = [
  {id:" p01".trim(), title:"The Orchard House", location:"Ridgeline, Vale Heights", price:2450000, type:"House", beds:5, baths:4, area:4200, tag:"New", img:"img-1", featured:true,
   desc:"A sculptural family residence wrapped in glass and cedar, set against an acre of mature orchard. Floor-to-ceiling arched windows frame the valley from every principal room.",
   features:["Heated infinity pool","Cedar wine cellar","Chef's kitchen","Solar + battery","3-car garage","Home cinema"]},
  {id:"p02", title:"Marlowe Penthouse", location:"Harbour District", price:3850000, type:"Penthouse", beds:3, baths:3, area:3100, tag:"Featured", img:"img-3", featured:true,
   desc:"A full-floor penthouse crowning the Harbour tower, with a wraparound terrace and uninterrupted water views. Private lift access opens directly into the gallery hall.",
   features:["Private lift access","Wraparound terrace","Concierge service","Smart-home system","2 parking bays","Residents' spa"]},
  {id:"p03", title:"Juniper Cottage", location:"Old Mill, Vale Heights", price:980000, type:"Cottage", beds:3, baths:2, area:1850, tag:"", img:"img-2", featured:true,
   desc:"A lovingly restored stone cottage with a walled garden, exposed beams, and a wood-burning hearth. Equal parts character and quiet modern comfort.",
   features:["Walled garden","Original beams","Wood-burning stove","Restored sash windows","Studio outbuilding","South-facing patio"]},
  {id:"p04", title:"Selwyn Glass Villa", location:"Lakeside", price:5200000, type:"Villa", beds:6, baths:5, area:6400, tag:"Exclusive", img:"img-5", featured:false,
   desc:"An architect's own lakeside villa, cantilevered over the water's edge. A study in light, stone, and reflection.",
   features:["Private jetty","Infinity-edge pool","Guest pavilion","Geothermal heating","Boathouse","Gym & sauna"]},
  {id:"p05", title:"The Bracken Loft", location:"Harbour District", price:740000, type:"Apartment", beds:2, baths:1, area:1100, tag:"", img:"img-7", featured:false,
   desc:"A warehouse conversion with double-height ceilings, blackened steel, and reclaimed timber floors. Industrial bones, softened beautifully.",
   features:["Double-height ceilings","Mezzanine study","Secure parking","Communal roof garden","Bike storage","Original brickwork"]},
  {id:"p06", title:"Hawthorn Manor", location:"Ridgeline, Vale Heights", price:4100000, type:"House", beds:7, baths:6, area:7800, tag:"", img:"img-4", featured:false,
   desc:"A Georgian-inspired manor on landscaped grounds, with formal gardens, a coach house, and panelled reception rooms.",
   features:["Coach house","Formal gardens","Tennis court","Library","Staff quarters","Gated entrance"]},
  {id:"p07", title:"Wren's Nest", location:"Lakeside", price:1290000, type:"Cottage", beds:4, baths:3, area:2300, tag:"New", img:"img-6", featured:false,
   desc:"A contemporary timber lodge tucked into the treeline, with a sun-trap deck and an open hearth at its heart.",
   features:["Wraparound deck","Open hearth","Underfloor heating","Boot room","Vegetable garden","EV charger"]},
  {id:"p08", title:"Aldgate Mews", location:"Old Mill, Vale Heights", price:865000, type:"Apartment", beds:2, baths:2, area:1250, tag:"", img:"img-8", featured:false,
   desc:"A discreet mews residence behind a cobbled courtyard — bright, private, and impeccably finished.",
   features:["Cobbled courtyard","Roof terrace","Utility room","Underground parking","Period façade","Open-plan living"]}
];

const money = n => "$" + n.toLocaleString("en-US");
const moneyShort = n => n >= 1000000 ? "$" + (n/1000000).toFixed(n%1000000===0?0:2) + "M" : "$" + Math.round(n/1000) + "k";

/* ---------- storage ---------- */
function load(k){try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return []}}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
let FAVS = load("meridian_favs");
let LEADS = load("meridian_leads");

/* mark JS active so .reveal only hides when we can also reveal it */
document.documentElement.classList.add("js");

/* ---------- nav + reveal ---------- */
(function(){
  const nav=document.getElementById("nav"),burger=document.getElementById("burger"),links=document.getElementById("navlinks");
  if(nav){const onScroll=()=>nav.classList.toggle("scrolled",scrollY>40);onScroll();addEventListener("scroll",onScroll);}
  if(burger&&links){burger.addEventListener("click",()=>{burger.classList.toggle("open");links.classList.toggle("open")});
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{burger.classList.remove("open");links.classList.remove("open")}));}
})();
(function(){
  const els=document.querySelectorAll(".reveal");if(!els.length)return;
  const reveal=e=>e.classList.add("in");
  if(!("IntersectionObserver" in window)){els.forEach(reveal);return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}}),{threshold:0,rootMargin:"0px 0px -6% 0px"});
  els.forEach(el=>io.observe(el));
  /* safety net: never leave on-screen content stuck hidden */
  const sweep=()=>els.forEach(e=>{if(!e.classList.contains("in")){const r=e.getBoundingClientRect();if(r.top<innerHeight*1.15&&r.bottom>-50)reveal(e)}});
  addEventListener("load",sweep);addEventListener("scroll",sweep,{passive:true});setTimeout(sweep,1500);
})();

/* ---------- property cards ---------- */
function cardHTML(p){
  const fav = FAVS.includes(p.id) ? "on" : "";
  return `<article class="prop reveal">
    <a class="prop-stretch" href="property.html?id=${p.id}" aria-label="View ${p.title}, ${p.location}, ${moneyShort(p.price)}"></a>
    <div class="ph">
      <div class="img ${p.img}" aria-hidden="true"></div>
      ${p.tag?`<span class="tag">${p.tag}</span>`:""}
      <button type="button" class="fav ${fav}" aria-label="${fav?"Remove":"Save"} ${p.title}" aria-pressed="${fav?"true":"false"}" onclick="toggleFav('${p.id}',this)">♥</button>
      <span class="price">${moneyShort(p.price)}</span>
    </div>
    <div class="body">
      <h3>${p.title}</h3>
      <div class="loc">◴ ${p.location}</div>
      <div class="specs"><span><b>${p.beds}</b> beds</span><span><b>${p.baths}</b> baths</span><span><b>${p.area.toLocaleString()}</b> sq ft</span><span>${p.type}</span></div>
    </div>
  </article>`;
}
function renderProps(targetId, list){
  const el=document.getElementById(targetId); if(!el) return;
  if(!list.length){el.innerHTML=`<p class="empty" style="grid-column:1/-1">No properties match your search.</p>`;return;}
  el.innerHTML=list.map(cardHTML).join("");
  // re-run reveal for freshly added cards
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
  el.querySelectorAll(".reveal").forEach(c=>io.observe(c));
}
function goProperty(id){location.href="property.html?id="+id;}
function toggleFav(id,btn){
  const i=FAVS.indexOf(id);
  const on = i<0;
  if(i>=0){FAVS.splice(i,1);} else {FAVS.push(id);}
  if(btn){btn.classList.toggle("on",on);btn.setAttribute("aria-pressed",on?"true":"false");}
  store("meridian_favs",FAVS);
  const c=document.getElementById("favCount"); if(c)c.textContent=FAVS.length;
}

/* ---------- home featured ---------- */
(function(){ if(document.getElementById("featuredProps")) renderProps("featuredProps", PROPERTIES.filter(p=>p.featured)); })();

/* ---------- listings page ---------- */
(function(){
  const grid=document.getElementById("listingGrid"); if(!grid) return;
  const fLoc=document.getElementById("fLoc"),fType=document.getElementById("fType"),fBeds=document.getElementById("fBeds"),fPrice=document.getElementById("fPrice"),fSort=document.getElementById("fSort");
  function apply(){
    let list=PROPERTIES.filter(p=>{
      if(fLoc.value!=="any" && !p.location.includes(fLoc.value)) return false;
      if(fType.value!=="any" && p.type!==fType.value) return false;
      if(fBeds.value!=="any" && p.beds < +fBeds.value) return false;
      if(fPrice.value!=="any"){const[min,max]=fPrice.value.split("-").map(Number); if(p.price<min||(max&&p.price>max)) return false;}
      return true;
    });
    if(fSort.value==="low") list.sort((a,b)=>a.price-b.price);
    else if(fSort.value==="high") list.sort((a,b)=>b.price-a.price);
    else if(fSort.value==="size") list.sort((a,b)=>b.area-a.area);
    const c=document.getElementById("resultCount"); if(c)c.textContent=`${list.length} ${list.length===1?"property":"properties"}`;
    renderProps("listingGrid",list);
  }
  [fLoc,fType,fBeds,fPrice,fSort].forEach(s=>s&&s.addEventListener("change",apply));
  // honor ?loc= / ?type= from home search
  const q=new URLSearchParams(location.search);
  if(q.get("loc")&&fLoc) fLoc.value=q.get("loc");
  if(q.get("type")&&fType) fType.value=q.get("type");
  apply();
})();
function homeSearch(){
  const loc=document.getElementById("hsLoc").value, type=document.getElementById("hsType").value;
  const p=new URLSearchParams(); if(loc!=="any")p.set("loc",loc); if(type!=="any")p.set("type",type);
  location.href="listings.html"+(p.toString()?"?"+p.toString():"");
}

/* ---------- property detail page ---------- */
(function(){
  const root=document.getElementById("pdRoot"); if(!root) return;
  const id=new URLSearchParams(location.search).get("id")||"p01";
  const p=PROPERTIES.find(x=>x.id===id)||PROPERTIES[0];
  const set=(sel,val)=>{const e=root.querySelector(sel); if(e)e.textContent=val;};
  document.title = p.title + " — Meridian";
  set("[data-pd=title]",p.title); set("[data-pd=loc]","◴ "+p.location); set("[data-pd=price]",money(p.price));
  set("[data-pd=type]",p.type); set("[data-pd=beds]",p.beds); set("[data-pd=baths]",p.baths); set("[data-pd=area]",p.area.toLocaleString());
  set("[data-pd=desc]",p.desc);
  const main=root.querySelector("[data-pd=mainimg]"); if(main)main.className="img "+p.img;
  root.querySelectorAll("[data-pd=sideimg]").forEach((el,i)=>el.className="img "+PROPERTIES[(PROPERTIES.indexOf(p)+i+1)%PROPERTIES.length].img);
  const fl=root.querySelector("[data-pd=features]"); if(fl)fl.innerHTML=p.features.map(f=>`<li>${f}</li>`).join("");
  // mortgage defaults from price
  const price=document.getElementById("mPrice");
  if(price){price.value=p.price; price.max=Math.max(p.price*1.2,6000000); document.getElementById("mPriceOut").textContent=money(p.price); calcMortgage();}
  // hidden property field on viewing form
  const vp=document.getElementById("vProperty"); if(vp)vp.value=p.title;
})();

function calcMortgage(){
  const price=+document.getElementById("mPrice").value;
  const down=+document.getElementById("mDown").value;
  const rate=+document.getElementById("mRate").value;
  const years=+document.getElementById("mYears").value;
  document.getElementById("mPriceOut").textContent=money(price);
  document.getElementById("mDownOut").textContent=down+"%";
  document.getElementById("mRateOut").textContent=rate.toFixed(1)+"%";
  document.getElementById("mYearsOut").textContent=years+" yrs";
  const principal=price*(1-down/100);
  const r=rate/100/12, n=years*12;
  const m = r===0 ? principal/n : principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  document.getElementById("mResult").textContent=money(Math.round(m));
}

/* ---------- forms (lead capture) ---------- */
function setErr(id,bad){const e=document.getElementById(id); if(e)e.classList.toggle("err",bad); return !bad;}
const emailRe=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function submitViewing(e){
  e.preventDefault();
  const name=val("vName"),email=val("vEmail"),phone=val("vPhone");
  let ok=true;
  ok=setErr("vf-name",name.length<2)&&ok;
  ok=setErr("vf-email",!emailRe.test(email))&&ok;
  ok=setErr("vf-phone",phone.replace(/\D/g,"").length<7)&&ok;
  if(!ok) return;
  LEADS.push({kind:"Viewing",name,email,phone,detail:val("vProperty"),date:val("vDate"),when:new Date().toISOString(),status:"new"});
  store("meridian_leads",LEADS);
  showSuccess("viewingForm","viewingSuccess");
}
function submitContact(e){
  e.preventDefault();
  const name=val("cName"),email=val("cEmail");
  let ok=true;
  ok=setErr("cf-name",name.length<2)&&ok;
  ok=setErr("cf-email",!emailRe.test(email))&&ok;
  ok=setErr("cf-msg",val("cMsg").length<4)&&ok;
  if(!ok) return;
  LEADS.push({kind:"Message",name,email,phone:val("cPhone"),detail:val("cTopic"),date:val("cMsg").slice(0,80),when:new Date().toISOString(),status:"new"});
  store("meridian_leads",LEADS);
  showSuccess("contactForm","contactSuccess");
}
function submitValuation(e){
  e.preventDefault();
  const name=val("eName"),email=val("eEmail");
  let ok=true;
  ok=setErr("ef-name",name.length<2)&&ok;
  ok=setErr("ef-email",!emailRe.test(email))&&ok;
  if(!ok) return;
  LEADS.push({kind:"Valuation",name,email,phone:val("ePhone"),detail:val("eAddress"),date:"",when:new Date().toISOString(),status:"new"});
  store("meridian_leads",LEADS);
  showSuccess("valuationForm","valuationSuccess");
}
function val(id){const e=document.getElementById(id);return e?e.value.trim():"";}
function showSuccess(formId,successId){
  const f=document.getElementById(formId),s=document.getElementById(successId);
  if(f)f.style.display="none"; if(s)s.classList.add("show");
}

/* ---------- dashboard ---------- */
(function(){
  if(!document.getElementById("dashRoot")) return;
  renderDash();
})();
function renderDash(){
  LEADS = load("meridian_leads"); FAVS = load("meridian_favs");
  const viewings=LEADS.filter(l=>l.kind==="Viewing"), messages=LEADS.filter(l=>l.kind==="Message"), vals=LEADS.filter(l=>l.kind==="Valuation");
  const openLeads=LEADS.filter(l=>l.status!=="closed").length;
  setText("kpiLeads",LEADS.length); setText("kpiViewings",viewings.length); setText("kpiSaved",FAVS.length); setText("kpiOpen",openLeads);

  // lead list (most recent first)
  const list=document.getElementById("leadList");
  const sorted=[...LEADS].sort((a,b)=>new Date(b.when)-new Date(a.when));
  if(!sorted.length){ list.innerHTML=`<p class="empty">No enquiries yet. Submit a viewing request, valuation, or message on the site and it appears here.</p>`; }
  else list.innerHTML=sorted.map((l)=>{
    const idx=LEADS.indexOf(l);
    const initials=(l.name||"?").split(" ").map(s=>s[0]).slice(0,2).join("").toUpperCase();
    return `<div class="lead-row">
      <div class="av">${initials}</div>
      <div class="info"><b>${l.name}</b><small>${l.kind} · ${l.detail||l.email}</small></div>
      <span class="when">${timeAgo(l.when)}</span>
      <span class="pill-status ${l.status}" onclick="cycleStatus(${idx})">${l.status}</span>
    </div>`;
  }).join("");

  // breakdown bars
  setText("bdViewings",viewings.length); setText("bdMessages",messages.length); setText("bdValuations",vals.length); setText("bdSaved",FAVS.length);
  const max=Math.max(1,viewings.length,messages.length,vals.length,FAVS.length);
  const bars={barViewings:viewings.length,barMessages:messages.length,barValuations:vals.length,barSaved:FAVS.length};
  Object.entries(bars).forEach(([id,v])=>{const b=document.getElementById(id); if(b)b.style.height=(14+v/max*100)+"px";});

  // saved properties
  const sp=document.getElementById("savedList");
  if(sp){
    const saved=PROPERTIES.filter(p=>FAVS.includes(p.id));
    sp.innerHTML = saved.length ? saved.map(p=>`<div class="lead-row"><div class="av">♥</div><div class="info"><b>${p.title}</b><small>${p.location} · ${moneyShort(p.price)}</small></div><span class="when">${p.type}</span></div>`).join("")
      : `<p class="empty">No saved properties yet.</p>`;
  }
}
function cycleStatus(idx){
  const order=["new","contacted","closed"];
  LEADS[idx].status = order[(order.indexOf(LEADS[idx].status)+1)%order.length];
  store("meridian_leads",LEADS); renderDash();
}
function seedDemo(){
  const now=Date.now();
  LEADS = [
    {kind:"Viewing",name:"Eleanor Price",email:"eleanor@email.com",phone:"5550148822",detail:"Marlowe Penthouse",date:"2026-07-03",when:new Date(now-1000*60*42).toISOString(),status:"new"},
    {kind:"Valuation",name:"Marcus Hale",email:"m.hale@email.com",phone:"5550172210",detail:"18 Old Mill Lane",date:"",when:new Date(now-1000*60*60*5).toISOString(),status:"contacted"},
    {kind:"Message",name:"Priya Nair",email:"priya@email.com",phone:"",detail:"General enquiry",date:"Interested in Lakeside villas under $3M",when:new Date(now-1000*60*60*26).toISOString(),status:"new"},
    {kind:"Viewing",name:"Tom Whitfield",email:"tomw@email.com",phone:"5550199001",detail:"The Orchard House",date:"2026-07-05",when:new Date(now-1000*60*60*50).toISOString(),status:"closed"}
  ];
  FAVS = ["p02","p04","p07"];
  store("meridian_leads",LEADS); store("meridian_favs",FAVS); renderDash();
}
function clearDemo(){ LEADS=[]; FAVS=[]; store("meridian_leads",LEADS); store("meridian_favs",FAVS); renderDash(); }
function setText(id,v){const e=document.getElementById(id); if(e)e.textContent=v;}
function timeAgo(iso){
  const s=(Date.now()-new Date(iso))/1000;
  if(s<3600) return Math.max(1,Math.round(s/60))+"m ago";
  if(s<86400) return Math.round(s/3600)+"h ago";
  return Math.round(s/86400)+"d ago";
}

/* favourite count in nav (if present) */
(function(){const c=document.getElementById("favCount"); if(c)c.textContent=FAVS.length;})();
