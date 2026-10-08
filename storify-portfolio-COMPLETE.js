/* Storify Portfolio - JS extracted from supplied source. Execute after HTML insertion. */


const lightLogoSrc = "https://files.easy-orders.net/1791473000481535121.png";
const darkLogoSrc  = "https://files.easy-orders.net/1791473002290328333.png";

const sunIconHTML = `
  <circle cx="12" cy="12" r="5"></circle>
  <line x1="12" y1="1" x2="12" y2="3"></line>
  <line x1="12" y1="21" x2="12" y2="23"></line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  <line x1="1" y1="12" x2="3" y2="12"></line>
  <line x1="21" y1="12" x2="23" y2="12"></line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
`;

const moonIconHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function blUpdateThemeState(isDark) {
  const icons = document.querySelectorAll('.bl-theme-icon');
  icons.forEach(icon => {
    icon.innerHTML = isDark ? sunIconHTML : moonIconHTML;
  });

  const logoImg = document.getElementById('blLogoImg');
  if (logoImg) {
    logoImg.src = isDark ? darkLogoSrc : lightLogoSrc;
  }
}

function blToggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('bl-dark-mode');
  document.body.classList.toggle('bl-dark-mode', isDark);
  blUpdateThemeState(isDark);
}

function blToggleDesktopMenu(e) {
  e.stopPropagation();
  document.getElementById('blDesktopDropdown').classList.toggle('open');
  document.getElementById('blMenuBtn').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('blDesktopDropdown');
  const btn = document.getElementById('blMenuBtn');
  if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
    dropdown.classList.remove('open');
    btn.classList.remove('open');
  }
});

function blOpenMenu() {
  document.getElementById('blMenuOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function blCloseMenu() {
  document.getElementById('blMenuOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function blToggleSearch() {
  const panel = document.getElementById('blSearchPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    setTimeout(function () {
      const input = document.getElementById('bl-header-search');
      if (input) input.focus();
    }, 50);
  }
}

function blCloseSearch() {
  const panel = document.getElementById('blSearchPanel');

  if (panel) {
    panel.classList.remove('open');
  }

  if (typeof clearHeaderSearch === 'function') {
    clearHeaderSearch(false);
    return;
  }

  const input = document.getElementById('bl-header-search');
  if (input) input.value = '';
}

function blHandleSearch(el) {
  if (typeof handleSearch === 'function') {
    handleSearch(el);
  }
}

function blSetSpacer() {
  const header = document.querySelector('.bl-custom-header');
  const spacer = document.getElementById('blHeaderSpacer');
  if (header && spacer) {
    spacer.style.height = header.offsetHeight + 'px';
  }
}

window.addEventListener('load', blSetSpacer);
window.addEventListener('resize', blSetSpacer);
blSetSpacer();



const MOBILE_BREAKPOINT = 680;

function getPerPage() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? 12 : 16;
}

let PER_PAGE = getPerPage();
let currentPage = 1;
let sortOrder = "newest";
let headerSearchQuery = "";
let activeCategory = null;
let filteredCards = [];

const ALL_CARDS = [
  {theme:'nature', cat:'fashion', color:'light', name:'Nature Fashion', url:'https://nature-fashion.myeasyorders.com', img:'https://files.easy-orders.net/1779745785260319883.png'},
  {theme:'nature', cat:'perfumes', color:'light', name:'Nature Perfumes', url:'https://nature-perfumes.myeasyorders.com', img:'https://files.easy-orders.net/1779745549281665643.png'},
  {theme:'nature', cat:'furniture', color:'light', name:'Nature Furniture', url:'https://nature-furniture.myeasyorders.com', img:'https://files.easy-orders.net/1779745781936025781.png'},
  {theme:'nature', cat:'watches', color:'light', name:'Nature Glasses', url:'https://nature-glasses.myeasyorders.com', img:'https://files.easy-orders.net/1779745792790365890.png'},
  {theme:'nature', cat:'cosmetics', color:'light', name:'Nature Cosmetics', url:'https://nature-cosmetics.myeasyorders.com', bestSeller:true, img:'https://files.easy-orders.net/1779745504532016495.png'},
  {theme:'nature', cat:'gifts', color:'light', name:'Nature Handmade', url:'https://nature-handmade.myeasyorders.com/', img:'https://files.easy-orders.net/1779745803254860506.png'},
  {theme:'nature', cat:'pets', color:'light', name:'Nature Pets', url:'https://nature-pets.myeasyorders.com', img:'https://files.easy-orders.net/1779745797366829944.png'},
  {theme:'nature', cat:'kids', color:'light', name:'Nature Kids', url:'https://nature-kids.myeasyorders.com/', img:'https://files.easy-orders.net/1779745807892676678.png'},
  {theme:'nature', cat:'jewelry', color:'light', name:'Nature Jewelry', url:'https://nature-jewelry.myeasyorders.com', bestSeller:true, img:'https://files.easy-orders.net/1781450070067163819.png'},

  {theme:'hype', cat:'perfumes', color:'light', name:'Hype Perfumes', url:'https://hype-perfumes.myeasyorders.com', img:'https://files.easy-orders.net/1780330273152604698.png'},
  {theme:'hype', cat:'electronics', color:'light', name:'Hype Electronics', url:'https://hype-electronics.myeasyorders.com', img:'https://files.easy-orders.net/1780330297625456261.png'},
  {theme:'hype', cat:'garden', color:'light', name:'Hype Garden', url:'https://hype-garden.myeasyorders.com', img:'https://files.easy-orders.net/1780330347127391690.png'},
  {theme:'hype', cat:'fashion', color:'dark', name:'Hype Dark', url:'https://hype-dark.myeasyorders.com', img:'https://files.easy-orders.net/1780330355528882938.png'},
  {theme:'hype', cat:'fashion', color:'light', name:'Hype Fashion', url:'https://hype-fashion.myeasyorders.com', img:'https://files.easy-orders.net/1780330247404119925.png'},
  {theme:'hype', cat:'kitchen', color:'light', name:'Hype Kitchen', url:'https://hype-kitchen.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1780844078169964082.png'},
  {theme:'hype', cat:'automotive', color:'light', name:'Hype Cars', url:'https://hype-cars.myeasyorders.com/', img:'https://files.easy-orders.net/1780844125883233014.png'},
  {theme:'hype', cat:'books', color:'light', name:'Hype Books', url:'https://hype-books.myeasyorders.com/', img:'https://files.easy-orders.net/1780844196413968354.png'},
  {theme:'hype', cat:'digital', color:'dark', name:'Hype Gamers', url:'https://hype-gamers.myeasyorders.com/', img:'https://files.easy-orders.net/1780844245612698871.png'},
  {theme:'hype', cat:'general', color:'light', name:'Hype General', url:'https://hype-general.myeasyorders.com/', img:'https://files.easy-orders.net/1780844280421020150.png'},
  {theme:'hype', cat:'tools', color:'light', name:'Hype Tools', url:'https://hype-tools.myeasyorders.com/', img:'https://files.easy-orders.net/1780844339171296305.png'},
  {theme:'hype', cat:'jewelry', color:'light', name:'Hype Jewelry', url:'https://hype-jewelry.myeasyorders.com', img:'https://files.easy-orders.net/1781450028094512056.png'},

  {theme:'elite', cat:'fashion', color:'light', name:'ELITE AVYRO', url:'https://avyro-elite.myeasyorders.com', img:'https://files.easy-orders.net/1779381114077598574.png'},
  {theme:'elite', cat:'watches', color:'light', name:'ELITE WALLETS', url:'https://elite-wallets.myeasyorders.com', img:'https://files.easy-orders.net/1779366030528687175.png'},
  {theme:'elite', cat:'furniture', color:'light', name:'ELITE FURNITURE', url:'https://elite-furniture.myeasyorders.com', img:'https://files.easy-orders.net/1779381152202320488.png'},
  {theme:'elite', cat:'health', color:'light', name:'ELITE Fit', url:'https://elite-supplements.myeasyorders.com', img:'https://files.easy-orders.net/1779381427142956547.png'},
  {theme:'elite', cat:'fashion', color:'light', name:'ELITE SPORTS', url:'https://elite-sport.myeasyorders.com', img:'https://files.easy-orders.net/1779381061952581300.png'},
  {theme:'elite', cat:'furniture', color:'light', name:'ELITE GALLERY', url:'https://elite-gallery.myeasyorders.com', img:'https://files.easy-orders.net/1779381109740287680.png'},

  {theme:'phoenix', cat:'cosmetics', color:'light', name:'PHOENIX Cosmetics', url:'https://phoenix-cosmetics.myeasyorders.com', img:'https://files.easy-orders.net/1779381547761255255.png'},
  {theme:'phoenix', cat:'fashion', color:'light', name:'PHOENIX AVYRO', url:'https://phoenix-avyro.myeasyorders.com', img:'https://files.easy-orders.net/1779381171606105293.png'},
  {theme:'phoenix', cat:'fashion', color:'light', name:'PHOENIX SPORTS', url:'https://phoenix-sports.myeasyorders.com', img:'https://files.easy-orders.net/1779292176387134385.png'},
  {theme:'phoenix', cat:'shoes', color:'light', name:'PHOENIX BAGS', url:'https://phoenix-bags.myeasyorders.com', img:'https://files.easy-orders.net/1779381179403227698.png'},
  {theme:'phoenix', cat:'health', color:'light', name:'Phoenix Gym Equipments', url:'https://phoenix-gym.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1784557606499453387.jpeg'},
  {theme:'phoenix', cat:'shoes', color:'light', name:'Phoenix Shoes', url:'https://phoenix-shoes.myeasyorders.com/', img:'https://files.easy-orders.net/1784557634615726352.jpeg'},
  {theme:'phoenix', cat:'shoes', color:'light', name:'Phoenix Wallets', url:'https://phoenix-wallets.myeasyorders.com/', img:'https://files.easy-orders.net/1784557668178360507.jpeg'},
  {theme:'phoenix', cat:'watches', color:'light', name:'Phoenix Glasses', url:'https://phoenix-glasses.myeasyorders.com/', img:'https://files.easy-orders.net/1784557726445485557.jpeg'},

  {theme:'pearl', cat:'furniture', color:'light', name:'Peral Gallery', url:'https://peral-gallery.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1779381048506738041.png'},
  {theme:'pearl', cat:'perfumes', color:'light', name:'Pearl Perfume', url:'https://pearl-perfume.myeasyorders.com/', img:'https://files.easy-orders.net/1779381024212229427.png'},
  {theme:'pearl', cat:'watches', color:'light', name:'Pearl Watches', url:'https://pearl-watches.myeasyorders.com', img:'https://files.easy-orders.net/1779381015732216693.png'},
  {theme:'pearl', cat:'shoes', color:'light', name:'PEARL BAGS', url:'https://pearl-bags.myeasyorders.com/', img:'https://files.easy-orders.net/1779381007739289904.png'},
  {theme:'pearl', cat:'fashion', color:'light', name:'Luxury Fashion', url:'https://luxury-fashion.myeasyorders.com', img:'https://files.easy-orders.net/1779381033268981318.png'},
  {theme:'pearl', cat:'jewelry', color:'light', name:'Peral Jewelry', url:'https://peral-jewelry.myeasyorders.com', img:'https://files.easy-orders.net/1781449981214223282.png'},

  {theme:'blast', cat:'gifts', color:'light', name:'Blast Handmade', url:'https://blast-handmade.myeasyorders.com', img:'https://files.easy-orders.net/1780484400876775433.png'},
  {theme:'blast', cat:'kids', color:'light', name:'Blast Kids', url:'https://blast-kids.myeasyorders.com', bestSeller:true, img:'https://files.easy-orders.net/1780484409038839622.png'},
  {theme:'blast', cat:'pets', color:'light', name:'Blast Pets', url:'https://blast-pets.myeasyorders.com', img:'https://files.easy-orders.net/1780484419603343365.png'},
  {theme:'blast', cat:'digital', color:'dark', name:'Blast Gamers', url:'https://blast-gamers.myeasyorders.com', bestSeller:true, img:'https://files.easy-orders.net/1780484427016631724.png'},
  {theme:'blast', cat:'books', color:'light', name:'Blast Books', url:'https://blast-books.myeasyorders.com', img:'https://files.easy-orders.net/1780484413137354954.png'},
  {theme:'blast', cat:'kids', color:'light', name:'Blast Children', url:'https://blast-children.myeasyorders.com/', img:'https://files.easy-orders.net/1784558783360323042.jpeg'},
  {theme:'blast', cat:'garden', color:'light', name:'Blast Garden', url:'https://blast-garden.myeasyorders.com/', img:'https://files.easy-orders.net/1784558815805600374.jpeg'},

  {theme:'volta', cat:'health', color:'dark', name:'Dark Supplements', url:'https://dark-supplements.myeasyorders.com/', img:'https://files.easy-orders.net/1780847824703915535.png'},
  {theme:'volta', cat:'health', color:'light', name:'Volta Supplements', url:'https://volta-supplements.myeasyorders.com/', img:'https://files.easy-orders.net/1780844744243168553.png'},
  {theme:'volta', cat:'digital', color:'dark', name:'Volta Gamers', url:'https://volta-gamers.myeasyorders.com/', img:'https://files.easy-orders.net/1780844802748971914.png'},
  {theme:'volta', cat:'electronics', color:'light', name:'Volta Electronics', url:'https://volta-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1780844846326875511.png'},
  {theme:'volta', cat:'shoes', color:'light', name:'Volta Bags', url:'https://volta-bags.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1780844897472395806.png'},
  {theme:'volta', cat:'electronics', color:'dark', name:'Dark Electronics', url:'https://dark-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1780847835199041100.png'},
  {theme:'volta', cat:'health', color:'light', name:'Volta Sports', url:'https://volta-sports.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1780845034426341535.png'},
  {theme:'volta', cat:'tools', color:'light', name:'Volta Tools', url:'https://volta-tools.myeasyorders.com/', img:'https://files.easy-orders.net/1780845078383705680.png'},
  {theme:'volta', cat:'automotive', color:'light', name:'Volta Cars', url:'https://volta-cars.myeasyorders.com/', img:'https://files.easy-orders.net/1780845120813776621.png'},
  {theme:'volta', cat:'kitchen', color:'light', name:'Volta Kitchen', url:'https://volta-kitchen.myeasyorders.com/', img:'https://files.easy-orders.net/1780845147783244737.png'},

  {theme:'sharp', cat:'fashion', color:'light', name:'Sharp Menswear', url:'https://sharp-mens-wear.myeasyorders.com', bestSeller:true, img:'https://files.easy-orders.net/1782821371997292415.png'},
  {theme:'sharp', cat:'fashion', color:'light', name:'Sharp Womenswear', url:'https://sharp-women-wear.myeasyorders.com/', img:'https://files.easy-orders.net/1782821375522597268.png'},
  {theme:'sharp', cat:'shoes', color:'light', name:'Sharp Bags', url:'https://sharp-bags.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1782821381734217806.png'},
  {theme:'sharp', cat:'jewelry', color:'light', name:'Sharp Jewelry', url:'https://sharp-jewelry.myeasyorders.com', img:'https://files.easy-orders.net/1782821390839375940.png'},
  {theme:'sharp', cat:'watches', color:'light', name:'Sharp Watches', url:'https://sharp-watches.myeasyorders.com', img:'https://files.easy-orders.net/1782821398248784783.png'},
  {theme:'sharp', cat:'perfumes', color:'light', name:'Sharp Perfumes', url:'https://sharp-perfumes.myeasyorders.com', img:'https://files.easy-orders.net/1782821405854584814.png'},
  {theme:'sharp', cat:'cosmetics', color:'light', name:'Sharp Cosmetics', url:'https://sharp-cosmatics.myeasyorders.com', img:'https://files.easy-orders.net/1782821413573382215.png'},
  {theme:'sharp', cat:'gifts', color:'light', name:'Sharp Handmade', url:'https://sharp-handmade.myeasyorders.com', img:'https://files.easy-orders.net/1782821421987923193.png'},

  {theme:'prime', cat:'garden', color:'light', name:'Prime Garden', url:'https://prime-garden.myeasyorders.com/', img:'https://files.easy-orders.net/1782903855000363171.png'},
  {theme:'prime', cat:'electronics', color:'light', name:'Prime Electronics', url:'https://prime-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1782903858193563299.png'},
  {theme:'prime', cat:'kitchen', color:'light', name:'Prime Kitchen', url:'https://prime-kitchen.myeasyorders.com/', img:'https://files.easy-orders.net/1782903862233903544.png'},
  {theme:'prime', cat:'furniture', color:'light', name:'Prime Furniture', url:'https://prime-furniture.myeasyorders.com/', img:'https://files.easy-orders.net/1782903879462282545.png'},
  {theme:'prime', cat:'food', color:'light', name:'Prime Foods', url:'https://prime-foods.myeasyorders.com/', img:'https://files.easy-orders.net/1782903883875102595.png'},
  {theme:'prime', cat:'pets', color:'light', name:'Prime Pets', url:'https://prime-pets.myeasyorders.com/', img:'https://files.easy-orders.net/1782903891407975217.png'},
  {theme:'prime', cat:'books', color:'light', name:'Prime Books', url:'https://prime-books.myeasyorders.com/', img:'https://files.easy-orders.net/1782903896317318571.png'},
  {theme:'prime', cat:'general', color:'light', name:'Prime General', url:'https://prime-general.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1782903903942819870.png'},
  {theme:'prime', cat:'automotive', color:'light', name:'Prime Cars', url:'https://prime-cars.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1782903909268461220.png'},

  {theme:'seven', cat:'fashion', color:'light', name:'Seven Egy', url:'https://sevenegy.myeasyorders.com/', bestSeller:true, img:'https://easyorders.fra1.digitaloceanspaces.com/1787078432485584331.webp'},
  {theme:'seven', cat:'fashion', color:'light', name:'Seven Fashion', url:'https://seventeen-fashion.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1785242677271901157.png'},
  {theme:'seven', cat:'shoes', color:'light', name:'Seven Bags', url:'https://seven-bags.myeasyorders.com/', img:'https://files.easy-orders.net/1785242683625983333.png'},
  {theme:'seven', cat:'electronics', color:'light', name:'Seven Electronics', url:'https://seven-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1785242688622363013.png'},
  {theme:'seven', cat:'fashion', color:'light', name:"Seven Women's Wear", url:'https://seven-womenwear.myeasyorders.com/', img:'https://files.easy-orders.net/1785242698909748062.png'},
  {theme:'seven', cat:'shoes', color:'light', name:'Seven Shoes', url:'https://seven-shoes.myeasyorders.com/', img:'https://files.easy-orders.net/1785242708958008335.png'},
  {theme:'seven', cat:'watches', color:'light', name:'Seven Glasses', url:'https://seven-glasses.myeasyorders.com/', img:'https://files.easy-orders.net/1785242717331096280.png'},
  {theme:'seven', cat:'fashion', color:'light', name:'Seven Gym Wears', url:'https://seven-gymwear.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1785242723187328837.png'},
  {theme:'seven', cat:'fashion', color:'light', name:'Seven Swimwear', url:'https://seven-swimwear.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1785242731089957393.png'},
  {theme:'seven', cat:'kids', color:'light', name:'Seven Kids', url:'https://seven-kids.myeasyorders.com/', img:'https://files.easy-orders.net/1785242734337787965.png'},

  {theme:'nono', cat:['kids','toys'], color:'light', name:'Nono Kids', url:'https://nono-kidss.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1786273803585816583.png'},
  {theme:'nono', cat:['kids'], color:'light', name:'Nono Clothes', url:'https://nono-clothes.myeasyorders.com/', img:'https://files.easy-orders.net/1786273812592553570.png'},
  {theme:'nono', cat:['kids','toys'], color:'light', name:'Nono Toys', url:'https://nono-toys.myeasyorders.com/', img:'https://files.easy-orders.net/1786273818622133316.png'},
  {theme:'nono', cat:['kids','books'], color:'light', name:'Nono Books', url:'https://nono-books.myeasyorders.com/', img:'https://files.easy-orders.net/1786273823950022129.png'},
  {theme:'nono', cat:['gifts'], color:'light', name:'Nono Gifts', url:'https://nono-gifts.myeasyorders.com/', img:'https://files.easy-orders.net/1786273831259282537.png'},

  {theme:'convert', cat:'tools', color:'light', name:'Convert Tools', url:'https://convert-tools.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1786617447376726578.png'},
  {theme:'convert', cat:['digital','toys'], color:'dark', name:'Convert Gamers', url:'https://convert-gamers.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1786617466110911913.png'},
  {theme:'convert', cat:'electronics', color:'light', name:'Convert Electronics', url:'https://convert-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1786617476688756793.png'},
  {theme:'convert', cat:'fashion', color:'light', name:'Convert Fashion', url:'https://convert-fashion.myeasyorders.com/', img:'https://files.easy-orders.net/1786617485259317746.png'},
  {theme:'convert', cat:'garden', color:'light', name:'Convert Garden', url:'https://convert-garden.myeasyorders.com/', img:'https://files.easy-orders.net/1786617501269866891.png'},
  {theme:'convert', cat:'kitchen', color:'light', name:'Convert Kitchen', url:'https://convert-kitchen.myeasyorders.com/', img:'https://files.easy-orders.net/1786617510180375260.png'},
  {theme:'convert', cat:'jewelry', color:'light', name:'Convert Jewelry', url:'https://convert-jewelry.myeasyorders.com/', img:'https://files.easy-orders.net/1786617515525269952.png'},
  {theme:'convert', cat:'books', color:'light', name:'Convert Books', url:'https://convert-books.myeasyorders.com/', img:'https://files.easy-orders.net/1786617521041287688.png'},
  {theme:'convert', cat:'automotive', color:'light', name:'Convert Cars', url:'https://convert-cars.myeasyorders.com/', img:'https://files.easy-orders.net/1786617526879024901.png'},
  {theme:'convert', cat:'general', color:'light', name:'Convert General', url:'https://convert-general.myeasyorders.com/', img:'https://files.easy-orders.net/1786617532487397800.png'},
  {theme:'convert', cat:'perfumes', color:'light', name:'Convert Perfumes', url:'https://convert-perfumes.myeasyorders.com/', img:'https://files.easy-orders.net/1786617542307245211.png'},

  {theme:'pure', cat:'furniture', color:'light', name:'Pure Furniture', url:'https://pure-furniture.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789388535455901728.png'},
  {theme:'pure', cat:'fashion', color:'light', name:'Pure Fashion', url:'https://pure-fashion.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789388541684688118.png'},
  {theme:'pure', cat:'furniture', color:'light', name:'Pure Home Decore', url:'https://pure-homedecore.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789388544749297724.png'},
  {theme:'pure', cat:'food', color:'light', name:'Pure Chocolate', url:'https://pure-food.myeasyorders.com/', img:'https://files.easy-orders.net/1789388552176863755.png'},
  {theme:'pure', cat:'pets', color:'light', name:'Pure Pets', url:'https://pure-pets.myeasyorders.com/', img:'https://files.easy-orders.net/1789388558491831763.png'},
  {theme:'pure', cat:'gifts', color:'light', name:'Pure Flowers', url:'https://pure-flower.myeasyorders.com/', img:'https://files.easy-orders.net/1789388564524715313.png'},

  {theme:'void', cat:'cosmetics', color:'light', name:'Void Cosmetics', url:'https://void-cosmetics.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789663934773505273.png'},
  {theme:'void', cat:'fashion', color:'light', name:'Void Fashion', url:'https://void-fashion.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789663986949066237.png'},
  {theme:'void', cat:'watches', color:'light', name:'Void Watches', url:'https://void-watches.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1789664008576863512.png'},
  {theme:'void', cat:'shoes', color:'light', name:'Void Shoes', url:'https://void-shoes.myeasyorders.com/', img:'https://files.easy-orders.net/1789664035733478009.png'},
  {theme:'void', cat:['gifts','jewelry'], color:'light', name:'Void Handmade', url:'https://void-handmade.myeasyorders.com/', img:'https://files.easy-orders.net/1789664071133280321.png'},
  {theme:'void', cat:'electronics', color:'light', name:'Void Electronics', url:'https://void-electronic.myeasyorders.com/', img:'https://files.easy-orders.net/1789664099163582684.png'},

  {theme:'easyfood', cat:'food', color:'light', name:'Easyfood Bite', url:'https://easyfood-bite.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1790084660924997221.webp'},
  {theme:'easyfood', cat:'food', color:'light', name:'Easyfood Coffee', url:'https://easyfood-coffee.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1790084652548573895.webp'},
  {theme:'easyfood', cat:'health', color:'light', name:'Easyfood Supplements', url:'https://easyfood-supplements.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1790084641685545953.webp'},
  {theme:'easyfood', cat:'food', color:'light', name:'Easyfood Desserts', url:'https://easyfood-dessert.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1790084628644883580.webp'},
  {theme:'easyfood', cat:'food', color:'light', name:'Easyfood Breakfast', url:'https://easyfood-breakfast.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1790084701165310140.webp'},

  {theme:'vantage', cat:'cosmetics', color:'light', name:'Vantage Cosmetics', url:'https://vantage-cosmetics.myeasyorders.com/', img:'https://files.easy-orders.net/1790656735452112156.webp'},
  {theme:'vantage', cat:'fashion', color:'light', name:'Vantage Fashion', url:'https://vantage-fashion.myeasyorders.com/', img:'https://files.easy-orders.net/1790656750395790625.webp'},
  {theme:'vantage', cat:'furniture', color:'light', name:'Vantage Furniture', url:'https://vantage-homefurniture.myeasyorders.com/', img:'https://files.easy-orders.net/1790656772288811094.webp'},
  {theme:'vantage', cat:'furniture', color:'light', name:'Vantage Home Decor', url:'https://vontag-homedecore.myeasyorders.com/', img:'https://files.easy-orders.net/1790656805486576747.webp'},
  {theme:'vantage', cat:'electronics', color:'light', name:'Vantage Electronics', url:'https://vantage-electronic.myeasyorders.com/', img:'https://files.easy-orders.net/1790656823919346995.webp'},
  {theme:'vantage', cat:'perfumes', color:'light', name:'Vantage Perfume', url:'https://vantage-perfume.myeasyorders.com/', img:'https://files.easy-orders.net/1790656836373237097.webp'},
  {theme:'vantage', cat:'health', color:'light', name:'Vantage Sport', url:'https://vantage-sport.myeasyorders.com/', img:'https://files.easy-orders.net/1790656848566084839.webp'},
  {theme:'vantage', cat:'garden', color:'light', name:'Vantage Plant', url:'https://vantage-plant.myeasyorders.com/', img:'https://files.easy-orders.net/1790656860568168342.webp'},
  {theme:'vantage', cat:'garden', color:'light', name:'Vantage Flower', url:'https://vantage-flower.myeasyorders.com/', img:'https://files.easy-orders.net/1790656869960442363.webp'},
  {theme:'vantage', cat:'sports-nutrition', color:'light', name:'Vantage Supplements', url:'https://vantage-mokamelatgem.myeasyorders.com/', img:'https://files.easy-orders.net/1790656896137981631.webp'},
  {theme:'vantage', cat:'gifts', color:'light', name:'Vantage Handmade', url:'https://vantage-handmadeproduct.myeasyorders.com/', img:'https://files.easy-orders.net/1790656909922060473.webp'},
  {theme:'vantage', cat:'pets', color:'light', name:'Vantage Pets', url:'https://vantage-pets.myeasyorders.com/', img:'https://files.easy-orders.net/1790656918037970616.webp'},
  {theme:'vantage', cat:'bicycle', color:'light', name:'Vantage Bicycle', url:'https://vantage-bicycle.myeasyorders.com/', img:'https://files.easy-orders.net/1790656933040106717.webp'},
  {theme:'vantage', cat:'kids', color:'light', name:'Vantage Kids Accessories', url:'https://vantage-kidsaccessories.myeasyorders.com/', img:'https://files.easy-orders.net/1790656965024353009.webp'},

  // Lines Theme
  {theme:'lines', cat:'cosmetics', color:'light', name:'Lines Cosmetics', url:'https://lines-cosmetics.myeasyorders.com/', img:'https://files.easy-orders.net/1791279271389536750.webp'},
  {theme:'lines', cat:'fashion', color:'light', name:'Lines Fashion', url:'https://lines-fashion.myeasyorders.com/', img:'https://files.easy-orders.net/1791279316177032698.webp'},
  {theme:'lines', cat:'jewelry', color:'light', name:'Lines Jewelry', url:'https://lines-jewelry.myeasyorders.com/', img:'https://files.easy-orders.net/1791279351512237325.webp'},
  {theme:'lines', cat:'kids', color:'light', name:'Lines Kids', url:'https://lines-kids.myeasyorders.com/', img:'https://files.easy-orders.net/1791279397514706232.webp'},
  {theme:'lines', cat:'kids', color:'light', name:'Lines Kidstoys', url:'https://lines-kidstoys.myeasyorders.com/', img:'https://files.easy-orders.net/1791279444087418975.webp'},
  {theme:'lines', cat:'electronics', color:'light', name:'Lines Electronic', url:'https://lines-electronics.myeasyorders.com/', img:'https://files.easy-orders.net/1791279483526391489.webp'},
  {theme:'lines', cat:'shoes', color:'light', name:'Lines Bags', url:'https://lines-bags.myeasyorders.com/', img:'https://files.easy-orders.net/1791279514377440069.webp'},
  {theme:'lines', cat:'shoes', color:'light', name:'Lines Shoes', url:'https://lines-shoes.myeasyorders.com/', img:'https://files.easy-orders.net/1791279542740456832.webp'},

  // Care Theme
  {theme:'care', cat:'cosmetics', color:'light', name:'Care Cosmetics', url:'https://care-cosmetics.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1791278830427321304.webp'},
  {theme:'care', cat:'electronics', color:'light', name:'Care Electronics', url:'https://care-electronics.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1791278845047261623.webp'},
  {theme:'care', cat:'electronics', color:'dark', name:'Care Headphones', url:'https://care-headphones.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1791278834565108100.webp'},
  {theme:'care', cat:'jewelry', color:'light', name:'Care Jewelry', url:'https://care-jewelry.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1791278850403946303.webp'},
  {theme:'care', cat:'garden', color:'light', name:'Care Plants', url:'https://care-plants.myeasyorders.com/', bestSeller:true, img:'https://files.easy-orders.net/1791278853547881314.webp'}

];

const CATS = [
  { id: "fashion", label: "Fashion & Clothing" },
  { id: "shoes", label: "Shoes & Bags" },
  { id: "jewelry", label: "Jewelry & Accessories" },
  { id: "watches", label: "Watches & Eyewear" },
  { id: "perfumes", label: "Perfumes" },
  { id: "cosmetics", label: "Cosmetics" },
  { id: "health", label: "Health & Fitness" },
  { id: "electronics", label: "Electronics" },
  { id: "furniture", label: "Furniture & Decor" },
  { id: "kids", label: "Baby & Kids" },
  { id: "toys", label: "Toys & Hobbies" },
  { id: "gifts", label: "Gifts & Handmade" },
  { id: "pets", label: "Pet Supplies" },
  { id: "garden", label: "Garden & Outdoor" },
  { id: "books", label: "Books" },
  { id: "kitchen", label: "Home & Kitchen" },
  { id: "food", label: "Food & Beverages" },
  { id: "automotive", label: "Automotive & Accessories" },
  { id: "digital", label: "Digital Products" },
  { id: "tools", label: "Tools & Equipment" },
  { id: "general", label: "General Store" },
  { id: "sports-nutrition", label: "Sports Nutrition Supplements" },
  { id: "bicycle", label: "Bicycle" }
];

function cardHasCategory(card, id) {
  if (Array.isArray(card.cat)) {
    return card.cat.includes(id);
  }
  return card.cat === id;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===== CATEGORY BAR ===== */
function buildCatBarHTML() {
  let html = `
    <button
      type="button"
      class="cat-chip ${activeCategory === null ? "active" : ""}"
      onclick="selectCategory(null)"
    >
      All
    </button>
  `;

  CATS.forEach(function (cat) {
    html += `
      <button
        type="button"
        class="cat-chip ${activeCategory === cat.id ? "active" : ""}"
        onclick="selectCategory('${cat.id}')"
      >
        ${cat.label}
      </button>
    `;
  });

  return html;
}

function renderCatBar() {
  document.getElementById("cat-bar").innerHTML = buildCatBarHTML();
}

function selectCategory(id) {
  activeCategory = activeCategory === id ? null : id;
  currentPage = 1;
  renderCatBar();
  applyFilters();
}

function getLabelById(list, id) {
  const item = list.find(function (entry) {
    return entry.id === id;
  });
  return item ? item.label : id;
}

function handleSort(value) {
  sortOrder = value;
  currentPage = 1;
  applyFilters();
}

function sortCards(cards) {
  if (sortOrder === "newest") {
    return [...cards].reverse();
  }

  if (sortOrder === "az") {
    return [...cards].sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  if (sortOrder === "bestseller") {
    return cards.filter(function (card) {
      return Boolean(card.bestSeller);
    });
  }

  return cards;
}

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function clearHeaderSearch(closePanel) {
  headerSearchQuery = "";

  const input = document.getElementById("bl-header-search");
  if (input) input.value = "";

  if (closePanel) {
    const panel = document.getElementById("blSearchPanel");
    if (panel) panel.classList.remove("open");
  }

  applyFilters();
}

function handleSearch(inputEl) {
  headerSearchQuery = normalizeSearch(inputEl ? inputEl.value : "");
  applyFilters();
}

function resetAllFilters() {
  activeCategory = null;
  clearHeaderSearch(true);
  renderCatBar();
}

function removeFilter(type) {
  if (type === "search") {
    clearHeaderSearch(true);
    return;
  }

  if (type === "category") {
    activeCategory = null;
    renderCatBar();
    applyFilters();
  }
}

function renderActiveFilters() {
  const box = document.getElementById("active-filters");
  const chips = [];

  if (headerSearchQuery) {
    chips.push(`
      <span class="filter-chip">
        ${escapeHtml(headerSearchQuery)}
        <button type="button" aria-label="Remove search filter" onclick="removeFilter('search')">×</button>
      </span>
    `);
  }

  if (activeCategory) {
    chips.push(`
      <span class="filter-chip">
        ${escapeHtml(getLabelById(CATS, activeCategory))}
        <button type="button" aria-label="Remove category filter" onclick="removeFilter('category')">×</button>
      </span>
    `);
  }

  if (chips.length === 0) {
    box.classList.remove("visible");
    box.innerHTML = "";
    return;
  }

  box.classList.add("visible");
  box.innerHTML = `
    <span class="active-filters-label">Filtered by:</span>
    ${chips.join("")}
    <button type="button" class="clear-filters-btn" onclick="resetAllFilters()">Clear all</button>
  `;
}

function applyFilters() {
  renderActiveFilters();

  filteredCards = ALL_CARDS.filter(function (card) {
    const categoryMatches =
      !activeCategory || cardHasCategory(card, activeCategory);

    const searchableText = normalizeSearch([
      card.name,
      card.theme,
      Array.isArray(card.cat) ? card.cat.join(" ") : card.cat
    ].join(" "));

    const searchMatches =
      headerSearchQuery === "" ||
      headerSearchQuery
        .split(" ")
        .filter(Boolean)
        .every(function (word) {
          return searchableText.includes(word);
        });

    return categoryMatches && searchMatches;
  });

  filteredCards = sortCards(filteredCards);

  currentPage = 1;
  renderPage(false);
}

function renderPage(shouldScroll) {
  const grid = document.getElementById("grid");
  const countLabel = document.getElementById("count-label");
  const total = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * PER_PAGE;
  const pageCards = filteredCards.slice(startIndex, startIndex + PER_PAGE);

  if (total === 0) {
    countLabel.textContent = "0 Projects";
  } else {
    const first = startIndex + 1;
    const last = Math.min(startIndex + PER_PAGE, total);
    countLabel.textContent = first + "-" + last + " of " + total + " Project" + (total === 1 ? "" : "s");
  }

  if (pageCards.length === 0) {
    grid.innerHTML = `<div class="empty-state">No projects found.</div>`;
  } else {
    grid.innerHTML = pageCards
      .map(function (card) {
        return `
          <article class="card">
            <div class="card-img-wrap">
              <a href="${card.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(card.name)}">
                <img class="card-img" src="${card.img}" alt="${escapeHtml(card.name)}" loading="lazy">
              </a>
            </div>

            <div class="card-info">
              <span class="card-name">${escapeHtml(card.name)}</span>
              <span class="badge-new">New</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  renderPagination(totalPages);

  if (shouldScroll) {
    document.querySelector(".themes-page")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `
    <button type="button" class="page-btn" aria-label="Previous page" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
      &#8249;
    </button>
  `;

  for (let page = 1; page <= totalPages; page += 1) {
    const shouldShow =
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1);

    if (shouldShow) {
      html += `
        <button type="button" class="page-btn ${page === currentPage ? "active" : ""}" onclick="goPage(${page})">
          ${page}
        </button>
      `;
    } else if (page === currentPage - 2 || page === currentPage + 2) {
      html += `<span class="pagination-ellipsis">…</span>`;
    }
  }

  html += `
    <button type="button" class="page-btn" aria-label="Next page" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>
      &#8250;
    </button>
  `;

  pagination.innerHTML = html;
}

function goPage(page) {
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PER_PAGE));

  if (page < 1 || page > totalPages || page === currentPage) {
    return;
  }

  currentPage = page;
  renderPage(true);
}

/* ===== أسهم شريط الكاتوجري ===== */
const CAT_BAR_SCROLL_AMOUNT = 320;

function scrollCatBar(direction) {
  const bar = document.getElementById("cat-bar");
  if (!bar) return;
  bar.scrollBy({ left: direction * CAT_BAR_SCROLL_AMOUNT, behavior: "smooth" });
}

function updateCatBarArrows() {
  const bar = document.getElementById("cat-bar");
  const leftArrow = document.getElementById("cat-bar-arrow-left");
  const rightArrow = document.getElementById("cat-bar-arrow-right");
  if (!bar || !leftArrow || !rightArrow) return;

  const maxScroll = bar.scrollWidth - bar.clientWidth;

  leftArrow.disabled = bar.scrollLeft <= 2;
  rightArrow.disabled = maxScroll <= 2 || bar.scrollLeft >= maxScroll - 2;
}

/* ===== سحب الشريط بالماوس ===== */
function initCatBarDrag() {
  const bar = document.getElementById("cat-bar");
  if (!bar) return;

  let isDown = false;
  let moved = false;
  let startX = 0;
  let scrollStart = 0;

  bar.addEventListener("mousedown", function (e) {
    isDown = true;
    moved = false;
    startX = e.pageX;
    scrollStart = bar.scrollLeft;
    bar.classList.add("dragging");
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();

    const delta = e.pageX - startX;

    if (Math.abs(delta) > 5) {
      moved = true;
    }

    bar.scrollLeft = scrollStart - delta;
  });

  window.addEventListener("mouseup", function () {
    if (!isDown) return;
    isDown = false;
    bar.classList.remove("dragging");
  });

  /* منع تنفيذ ضغطة الفلتر إذا كانت المسة عبارة عن سحب */
  bar.addEventListener(
    "click",
    function (e) {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    },
    true
  );

  bar.addEventListener("scroll", updateCatBarArrows);
  window.addEventListener("resize", updateCatBarArrows);
}

renderCatBar();
initCatBarDrag();
updateCatBarArrows();

filteredCards = sortCards([...ALL_CARDS]);
renderPage(false);

