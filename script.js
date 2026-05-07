// ===============================================
// GLOBÁLNE PREMENNÉ
// ===============================================
let loggedInUsername = '';
let currentMode = 'free';
let drawnLines = [];
let selectedDevicesForLine = [];
let lineDrawingMode = false;
let deviceCounter = 0;
let rightClickedDeviceId = null;
let selectedLineId = null;

let selectedLineTypeKey = null;
let modalPurpose = 'initial'; // 'initial' alebo 'changeType'

let topologyExamplesMenuVisible = false; // NOVÁ: Premenná na sledovanie stavu menu ukážok topológií
let examplesMenuVisible = false; // Pôvodná premenná pre existujúce menu

// ===============================================
// DEFINÍCIE (Čiary, Zariadenia, Scenáre, Topológie)
// ===============================================

// Definície typov čiar (farba, štýl, názov)
const lineTypes = {
    'optical': {
        color: 'gold',
        dasharray: '',
        name: 'Optický kábel (žltá, neprerušovaná)',
        description: 'Optický kábel: Prepojenie pre optické siete.'
    },
    'telephone': {
        color: 'black',
        dasharray: '',
        name: 'Telefónny kábel (čierna, neprerušovaná)',
        description: 'Telefónny kábel: Prepojenie pre telefónne linky.'
    },
    'ethernet': {
        color: 'blue',
        dasharray: '',
        name: 'Ethernet kábel (modrá, neprerušovaná)',
        description: 'Ethernet kábel: Prepojenie pre lokálne siete (LAN).'
    },
    'wifi': {
        color: 'green',
        dasharray: '7 7',
        name: 'Wi-Fi signál (zelená, prerušovaná)',
        description: 'Wi-Fi signál: Bezdrôtové pripojenie.'
    },
    'mobile': {
        color: 'green',
        dasharray: '2 10',
        name: 'Mobilný signál (zelená, bodkovaná)',
        description: 'Mobilný signál: Bezdrôtové mobilné pripojenie.'
    },
	'DECT': {
        color: 'orange',
        dasharray: '2 10',
        name: 'DECT signál (oranžová, bodkovaná)',
        description: 'DECT signál: Bezdrôtové pripojenie medzi pevnými linkami.'
    }
};

// Objekt s definíciami zariadení
const deviceDefinitions = {
    'router': { imgSrc: 'images/router.jpg', altText: 'Vlastný Router', description: '<strong>Wi-Fi router</strong><br>Poskytuje bezdrôtové a káblové pripojenie do siete.' },
    'phone': { imgSrc: 'images/telefon.jpg', altText: 'Telefón', description: '<strong>Telefón</strong><br>Koncové hlasové zariadenie pre komunikáciu.' },
	'895I': { imgSrc: 'images/Telco PH-895I.jpeg', altText: 'Telco PH-895IDN', description: '<strong>Telco PH-895IDN</strong><br>Telco PH‑895IDN je jednoduchý drôtový telefón k pevnej linke určený na základné telefonovanie.Má veľký podsvietený displej, telefónny zoznam, hlasité handsfree a svetelnú indikáciu prichádzajúcich a zmeškaných hovorov.Podporuje zobrazenie čísla volajúceho (CLIP) a ovládanie je v českom jazyku.' },
	'DX600': { imgSrc: 'images/DX600.jpg', altText: 'Gigaset DX600A ISDN', description: '<strong>Gigaset DX600A ISDN</strong><br>Gigaset DX600A ISDN je profesionálny stolový telefón určený pre domácu kanceláriu a malé až stredné firmy. Zariadenie kombinuje ISDN technológiu s pokročilými funkciami pre efektívnu správu hovorov a kontaktov. Telefón je vhodný pre používateľov, ktorí potrebujú spoľahlivú pevnú linku s rozšírenými možnosťami.Hlavné vlastnosti:Veľký farebný 3,5" TFT displej s vysokým rozlíšením a intuitívnym ovládanímPodpora ISDN (S0) – možnosť pracovať s viacerými telefónnymi číslami (MSN)3 integrované odkazovače s celkovou dĺžkou záznamu až cca 55 minútAdresár až pre 750 kontaktov (vCard), vrátane fotografií a VIP kontaktovBluetooth a DECT – možnosť pripojenia mobilného telefónu alebo bezdrôtových slúchadielEthernet (LAN) pripojenie pre správu, synchronizáciu kontaktov a online službyPodpora faxu cez analógový portHD kvalita zvuku a plne duplexný hlasitý odposluchProgramovateľné funkčné tlačidlá pre rýchlu voľbu a často používané funkcie' },
	'CX470': { imgSrc: 'images/CX470.jpeg', altText: 'SIEMENS Gigaset CX470 ISDN', description: '<strong>SIEMENS Gigaset CX470 ISDN</strong><br>Bezdrôtový ISDN telefón s možnosťou viacerých hovorov. Zvláda až 10 ISDN čísel (MSN). Rozširiteľný až na 6 sluchádiel. Automatická synchronizácia dátumu a času prostredníctvom D-kanálu. ECO DECT – o 60% nižšia spotreba energie a premenlivé zníženie vysielacieho výkonu.' },
	'DECTBASE': { imgSrc: 'images/DECT_base.jpeg', altText: 'SIEMENS GIGASET BOX100', description: '<strong>SIEMENS GIGASET BOX100</strong><br>Vysoko kompatibilná a spoľahlivá základňa, ktorá vám umožní prepojiť až šesť slúchadiel a súčasne zvládne dva hovory - ideálne riešenie pre domácnosti aj menšie kancelárie.Siemens GIGASET BOX100 je samostatná DECT/GAP základňa navrhnutá pre jednoduché a efektívne rozšírenie vášho existujúceho telefónneho systému. Podporuje slúchadlá radu Gigaset C, S a SL a ponúka vynikajúci dosah až 300 metrov vonku a 50 metrov v interiéri, čo zabezpečí stabilné a kvalitné pripojenie v rôznych prostrediach.Súčasťou tejto základne je aj integrovaný telefónny záznamník s kapacitou až 25 minút nahrávania, vrátane možnosti nahratia jednej osobnej správy. Vďaka tomu nezmeškáte žiadny dôležitý hovor a budete mať vždy prehľad o prichádzajúcich správach' },
	'212': { imgSrc: 'images/ISDN PBX Systems 212.jpeg', altText: 'PBX Systems 212', description: '<strong>PBX Systems 212</strong><br>je digitálna telefónna ústredňa určená pre malé firmy, ktorá podporuje 2 ISDN linky (2 hovory súčasne) a až 12 vnútorných pobočiek. Umožňuje priame vytáčanie na jednotlivé pobočky (DDI/MSN), konferenčné hovory, presmerovanie a spoluprácu so systémovými aj analógovými zariadeniami. Je vhodná tam, kde je potrebná spoľahlivá a jednoduchá ISDN komunikácia.' },
	'PBX14': { imgSrc: 'images/PBX14.jpeg', altText: 'ISDN PBX 1/4', description: '<strong>ISDN PBX 1/4</strong><br>ISDN PBX 1/4 je kompaktná digitálna ISDN telefónna ústredňa určená pre veľmi malé kancelárie alebo prevádzky. Podporuje 1 ISDN linku (2 hovory súčasne) a až 4 vnútorné pobočky, pričom umožňuje základné funkcie ako presmerovanie hovorov, podržanie a internú komunikáciu. Je vhodná tam, kde je potrebné jednoduché a spoľahlivé riešenie pevnej ISDN komunikácie' },
	'HICOM': { imgSrc: 'images/SIEMENS_HICOM.jpeg', altText: 'SIEMENS HICOM 150', description: '<strong>SIEMENS HICOM 150</strong><br> je digitálna telefónna ústredňa (PABX/keysystem) určená pre malé a stredné firmy. Podporuje analógové aj digitálne prípojky vrátane ISDN2 a ISDN30, umožňuje interné volania, presmerovanie, konferencie a spoluprácu so systémovými telefónmi Siemens Optiset. Je to modulárny a spoľahlivý systém vhodný pre klasické firemné pevné linky.' },
	'GXV3470': { imgSrc: 'images/Grandstream GXV3470.jpeg', altText: 'Grandstream GXV3470', description: '<strong>Grandstream GXV3470</strong><br> Grandstream GXV3470 je IP videotelefón, s funkčnosťou tabletu so systémom Android. Vďaka 7 palcovej dotykovej obrazovke s rozlíšením 800x1280, naklápajúcej kamere, dvom mikrofónom, integrovanou Wi-Fi a podporou Bluetooth 5.0, zabezpečuje riešenie pre efektívnu komunikáciu a produktivitu. Prostredníctvom Android 11 ponúka okamžitý prístup k tisíckam aplikácií pre systém Android.' },
	'Yealink T46U': { imgSrc: 'images/Yealink T46U.jpeg', altText: 'Yealink T46U', description: '<strong>Yealink T46U</strong><br>Yealink T46U je IP telefón, ktorý disponuje bohatou funkčnou výbavou a farebným 4,3” TFT-LCD displejom s rozlíšením 480x272 pixelov, dvoma 1 Gbs ethernetovými portami s podporou PoE, farebnou indikáciou pomocou LED diód a niekoľkými podsvietenými tlačidlami.' },
	'WP820': { imgSrc: 'images/WP820.jpeg', altText: 'Grandstream WP820', description: '<strong>Grandstream WP820</strong><br>Vyskúšajte prenosný, bezdrôtový wifi telefón Grandstream WP820 pre domácnosti i firmy, pri ktorom vám nebudú zavadzať žiadne káble ani šnúry. Keďže telefón sa na internet pripojí prostredníctvom wifi, nie je potrebné mať k nemu DECT základňu, čím tiež ušetríte priestor. Nabíjanie je prostredníctvom nabíjacej základne alebo priamo micro USB kábla. Samozrejmosťou je HD kvalita zvuku a dlhá výdrž batérie. Vďaka Bluetooth technológii môžete telefón spárovať so svojim smartfónom, alebo Blueetoth slúchadlami, čo ešte viac zvýši pohodlie a flexibilitu využívania.' },
	'Yealink W90B': { imgSrc: 'images/Yealink W90B.jpeg', altText: 'Yealink W90B', description: '<strong>IP DECT Základňová stanica Multi-Cell system Yealink W90B</strong><br>Yealink W90B je základňová stanica pre IP DECT Multi-Cell systém Yealink W90. Bunkový systém Yealink W90 DECT IP sa skladá z dvoch hlavných prvkov: <br>základňovej stanice W90B a riadiacej jednotky W90DM a je navrhnutý pre pokrytie kompletných priestorov bezdrôtovým signálom.<br>IP DECT bunkový systém vytvára škálovateľné a spoľahlivé riešenie pre stredné a veľké organizácie.<br>Bunkový systém Yealink W90 DECT IP umožňuje prepojenie až 250 rúčok / 250 súbežných hovorov.<br>Systém podporuje prepojenie koncových zariadení - Yealink W59R, W73H. <br>Samozrejmosťou pre všetky zariadenia je zaistenie plynulého prechodu prebiehajúceho hovoru medzi základňovými stanicami (tzv. Handover) a funkcie roaming pre prechod medzi oddelenými systémami (napr. prechod medzi vzdialenými budovami).W90DM i W90B vychádzajú z moderného a kompaktného designu s plnou podporou HD hlasovej kvality.Oproti systému W80 disponuje taktiež externými anténami, ktoré zaisťujú väčší dosah DECT bezdrôtového signálu.<br>Systém obsahujúci až 60 základňových staníc sa skladá z daného počtu samotných základňových staníc a riadiacej jednotky.' },
	'Yealink W73H': { imgSrc: 'images/Yealink W73H.jpeg', altText: 'Yealink W73H', description: '<strong>IP DECT slúchadlo</strong><br>Yealink W73H je IP DECT telefón k multi-cell riešeniu Yealink W90.<br> Disponuje farebným displejom, novým moderným designom s HD zvukom a výdržou až 400 hodín v pohotovostnom režime.<br>Pre vyšší užívateľský komfort ponúka funkciu rýchleho nabíjania - 10 minút nabíjania vám zaistí ďalší až 2-hodinový hovor.<br>Rýchlo sa zorientujete aj na 1,8“ LCD farebnom displeji s rozlíšením 128x160 pixelov.<br>Telefón ponúka aj vysokú kvalitu zvuku vďaka technológií HD Voice. <br>Vysokú kvalitu zvuku oceníte aj pri použití náhlavnej súpravy, rúčka disponuje 3,5 mm jackom.<br>Telefón má tiež 6 programovateľných tlačidiel.' },
	'SNOM D717': { imgSrc: 'images/SNOM D717.jpeg', altText: 'SNOM D717', description: '<strong>SNOM D717</strong><br>SNOM D717 je určený pre užívateľov prevažne z radu nižšieho a stredného managementu. Farebný displej s vysokým rozlíšením ponúka aj vďaka svojej ergonómii, jednoduchú obsluhu, aktiváciu služieb a volania. Telefón podporuje PoE, preto v jeho balení nenájdete sieťový adaptér.' },
	'Yealink MP54': { imgSrc: 'images/Yealink MP54.jpeg', altText: 'Yealink MP54', description: '<strong>Yealink MP54</strong><br>Yealink MP54 je IP telefón podporujúci možnosť hybridného módu, vďaka ktorému je možné naplno využívať platformu Teams a zároveň s obmedzenými možnosťami využívať prostredie technológie SIP. Na tejto obmedzenej verzii pre SIP, nebudete schopní nastaviť presmerovanie, alebo BLF tlačidlá, ale ako záložná komunikácia alebo napr. spojenie s IP dverníkmi je táto možnosť ideálna. Telefón automaticky dokáže identifikovať volanie na rôzne platformy súčasne, a tak dokážete prechádzať medzi hovormi, či upozorniť volajúceho na obsadenie, ak ste už na jednej z platforiem hovor prijali.<br>Stolný IP telefón Yealink MP54 je založený na operačnom systéme Android 9.0 a je vybavený dotykovou obrazovkou a USB portom, pre pripojenie náhlavnej súpravy. Okrem toho podporuje PoE napájenie, preto v balení nenájdete sieťový adaptér' },
	'Grandstream GXV3450': { imgSrc: 'images/Grandstream GXV3450.jpeg', altText: 'Grandstream GXV3450', description: '<strong>Grandstream GXV3450</strong><br>SGrandstream GXV3450 je IP videotelefón, s funkčnosťou tabletu so systémom Android. Vďaka 5 palcovej dotykovej obrazovke s rozlíšením 1280x720, naklápajúcej kamere, dvom mikrofónom, integrovanou Wi-Fi a podporou Bluetooth 5.0, zabezpečuje riešenie pre efektívnu komunikáciu a produktivitu. Prostredníctvom Android 11 ponúka okamžitý prístup k tisíckam aplikácií pre systém Android.' },
	'Grandstream DP752': { imgSrc: 'images/Grandstream DP752.jpeg', altText: 'Grandstream DP752', description: '<strong>IP DECT základňová stanica k IP telefónom DP722 a DP730</strong><br>Grandstream DP752 je výkonná DECT základňová stanica slúžiaca pre pripojenie až 5 slúchadiel. Aktuálne si môžete vybrať až z dvoch variantov slúchadiel. Ide o modely DP722 a DP730. Kombinácia slúchadla a základňovej stanice vám umožní volať pomocou VoIP technológie, ktorá je teraz absolútnou špičkou v pomere kvality hovoru a jeho ceny.<br>Pri použití modelu DP722 je dosah signálu až 350 m v otvorených a 50 m v uzavretých priestoroch, čím získavate skvelú slobodu pohybu, ako u vás doma, tak v kancelárii. V kombinácii s rúčkou DP730 je vonkajší dosah signálu dokonca až 400 m. Základňa podporuje až 10 SIP účtov, 5 paralelných hovorov, funkciu push-to-talk, intercom, alebo tiež 3 cestnú audiokonferenciu. Miniatúrne rozmery, čistý dizajn a praktický stojan ocenia predovšetkým tí zákazníci, ktorí majú v pláne si základňu postaviť na stôl. Hanbu ale určite neurobí ani tým, ktorí by si ju chceli pripevniť na stenu.<br>Model DP752 vám ponúkne komfortné volacie funkcie ako sú napríklad: záznam volaní, čakajúci hovor, automatická odpoveď, melódie pri čakaní, odpoveď alebo prepojenie' },
	'Grandstream DP730': { imgSrc: 'images/Grandstream DP730.jpeg', altText: 'Grandstream DP730', description: '<strong>IP DECT slúchadlo</strong><br>DP730 je špičkový bezdrôtový telefón, ktorý svojim užívateľom umožňuje používať svoju VoIP sieť v akomkoľvek prostredí, či už ide o skladové, obytné, maloobchodné či obchodné prostredie. Model DP730 je určený ako pre obchodných, tak aj pre rezidentných užívateľov.<br>Telefón je podporovaný VoIP základňovými stanicami značky Granstream DP752 a DP750 DECT. Na základe tohto prepojenia získate špičkový výkon a mobilitu.<br>Nesporným benefitom je dĺžka hovoru, ktorá je až 40 hodín a taktiež dĺžka pohotovostného režimu, ktorá je až 500 hodín. Zariadenie disponuje technológiou DECT, vďaka ktorej je možné vybudovať spojenie riadiaceho bodu s ďalším bodom či bodom v lokálnom meradle. Samozrejmosťou je HD audio a to ako na slúchadle, tak na reproduktore, ktoré vám zabezpečí kvalitný a jasný zvuk aj pri hlasitom odposluchu. Telefón disponuje štandardom HAC (hearing aid compatibility) a zabezpečením DECT, ktoré umožňuje overovanie a šifrovanie hovorov.<br>Ku každej základňovej stanici môžete pripojiť až päť telefónov DP730, z ktorých každý má dosah až 400 metrov v otvorenom priestore a až 50 metrov vo vnútri.<br>Telefón disponuje nasledujúcimi funkciami: interkom, trojcestná konferencia, push-to-talk, stiahnutie telefónneho zoznamu, čakajúci hovor, vytáčanie volania, flexibilný plán vytáčania. Zariadenie podporuje mnoho jazykov, samozrejmosťou je aj slovenčina.' },
	'Cisco CP-8861': { imgSrc: 'images/Cisco CP-8861.jpeg', altText: 'Cisco CP-8861', description: '<strong>Cisco CP-8861</strong><br>IP Phone 8861 poskytuje vysoko bezpečné, ľahko použiteľné a komplexné prepojenie VoIP komunikácie a telefónnych funkcií s vašimi osobnými mobilnými zariadeniami v celej vašej organizácii. Pokrýva požiadavky náročných užívateľov. Okrem kvalitného širokopásmového zvuku a mnohých funkcionalít ponúka tiež flexibilné možnosti nasadenia.' },
    'ISDN': { imgSrc: 'images/ISDN.jpeg', altText: 'ISDN', description: '<strong>UŽ Neponukáme</strong><br>ISDN telefón je digitálny pevný telefón, ktorý prenáša hovory v digitálnej kvalite.Oproti starým analógovým telefónom má čistejší zvuk, spoľahlivejšie spojenie a umožňuje mať viac telefónnych čísiel na jednej linke.' },
    'notebook': { imgSrc: 'images/notebook.jpg', altText: 'Notebook', description: '<strong>Lenovo LOQ Essential Gen 9</strong><br>Prenosný počítač, ktorý sa pripája k sieti.' },
    'PC': { imgSrc: 'images/PC.jpg', altText: 'Stolný počítač', description: '<strong>Stolný počítač</strong><br>Počítač je elektronické zariadenie, ktoré spracováva údaje podľa zadaných inštrukcií a umožňuje vykonávať rôzne úlohy ako písanie, výpočty, komunikáciu či hranie hier.' },
    'TV': { imgSrc: 'images/TV.jpg', altText: 'Televízor', description: '<strong>Televízor</strong><br>Televízor je elektronické zariadenie, ktoré spracováva obraz a video údaje- zobrazovacie zariadenie' },
    'socket': { imgSrc: 'images/socket.jpg', altText: 'Zásuvka (el.)', description: '<strong>Zásuvka (elektrická)</strong><br>Bod pripojenia k elektrickej sieti.' },
    'ethernet-cable': { imgSrc: 'images/ethernet-cable.jpg', altText: 'Ethernet kábel', description: '<strong>Ethernet kábel</strong><br>Internetový kábel -koncovka RJ45 Kábel pre prepojenie sieťových zariadení (napr. router a PC).' },
    'mobile-phone': { imgSrc: 'images/mobile-phone.jpg', altText: 'Mobilný telefón', description: '<strong>iPhone 16 Pro Max</strong><br>Bezdrôtové mobilné zariadenie pre komunikáciu a internet.' },
    'server': { imgSrc: 'images/server.jpg', altText: 'Server', description: '<strong>Server</strong><br>Počítač poskytujúci služby iným počítačom v sieti.' },
    'internet': { imgSrc: 'images/internet.jpg', altText: 'Internet', description: '<strong>Internet</strong><br>' },
    'telefonny-stlp': { imgSrc: 'images/stlp.jpg', altText: 'Stlp', description: '<strong>Telefonny Stlp</strong><br>Telefónny stĺp je vysoký zvislý nosný prvok, ktorý slúži na vedenie telekomunikačných a niekedy aj elektrických káblov. Najčastejšie je vyrobený z dreva (impregnované kmene stromov), betónu alebo ocele. Typický jednoduchý telefónny stĺp má výšku približne 7–12 metrov, jeden hlavný zvislý kmeň a hore upevnené izolátory, cez ktoré sú vedené káble. Po bokoch môže mať oporné laná pre stabilitu, najmä pri rohoch alebo na dlhších trasách. Telefónne káble vedú od stĺpa k stĺpu a môžu slúžiť na pevné telefónne linky, optické káble na internet alebo na distribúciu nízkonapäťových signálov a dát.' },
    'NT': { imgSrc: 'images/NT.jpeg', altText: 'NT-Network Terminal', description: '<strong>Network Terminal</strong><br>NT je zariadenie, ktoré spája ISDN linku od operátora s tvojimi zariadeniami doma alebo v kancelárii.Mení signál zo siete operátora na taký, ktorý môžu používať ISDN telefóny alebo ústredne.' },
    'switch': { imgSrc: 'images/network-switch.jpg', altText: 'Switch', description: '<strong>Switch</strong><br>Zariadenie pre pripojenie viacerých zariadení v lokálnej sieti.' },
    'cloud': { imgSrc: 'images/cloud.jpg', altText: 'Cloud', description: '<strong>Cloud/Internet</strong><br>Reprezentácia vonkajšej siete alebo internetu.' },
    'ont-router': { imgSrc: 'images/ont-router.jpg', altText: 'ONT Router', description: '<strong>Vantiva FGA2235</strong><br>Optický sieťový terminál (Optical Network Terminal) s funkciami routera, používaný v GPON/FTTH sieťach.' },
    'hag-router': { imgSrc: 'images/hag-router.jpg', altText: 'HAG Router', description: '<strong>Sercomm Speedport Plus 2</strong><br>Home Access Gateway s funkciami routera, často používaný pre VDSL/ADSL pripojenia.' },
    'telephone-cable': { imgSrc: 'images/telephone-cable.jpg', altText: 'Telefónny kábel', description: '<strong>Telefónny kábel</strong><br>Kábel pre pripojenie telefónnych zariadení a prenos analógových alebo digitálnych hlasových signálov.' },
    'optical-cable': { imgSrc: 'images/optical-cable.jpg', altText: 'Optický kábel', description: '<strong>Optický kábel</strong><br>Kábel pre prenos dát svetlom, používaný v optických sieťach (FTTH, GPON).' },
    'telephone-socket': { imgSrc: 'images/telz.jpg', altText: 'Tel. zásuvka', description: '<strong>Telefónna zásuvka</strong><br>Zásuvka pre pripojenie telefónu alebo modemu k telefónnej linke.' },
    'optical-socket': { imgSrc: 'images/optical-socket.jpg', altText: 'Opt. zásuvka', description: '<strong>Optická zásuvka</strong><br>Zásuvka pre pripojenie optického kábla k zariadeniu alebo rozvodnej sieti v budove.' },
    'ethernet-socket': { imgSrc: 'images/ethernet-socket.jpg', altText: 'Eth. zásuvka', description: '<strong>Ethernetová zásuvka</strong><br>Zásuvka pre pripojenie ethernet kábla k lokálnej sieti (LAN).' },
    'hdmi-cable': { imgSrc: 'images/hdmi-cable.jpg', altText: 'HDMI kábel', description: '<strong>HDMI kábel</strong><br>Kábel pre prenos digitálneho audio a video signálu vo vysokom rozlíšení.' },
    'coaxial-cable': { imgSrc: 'images/coaxial-cable.jpg', altText: 'Koax. kábel', description: '<strong>Koaxiálny kábel</strong><br>Kábel pre prenos vysokofrekvenčných signálov, často používaný pre káblovú televíziu a internet (DOCSIS).' },
    '5G': { imgSrc: 'images/5G.jpg', altText: '5G signál', description: '<strong>5G Signál</strong><br>Mobilný signál,využivajúci 5G technológie.' },
	'DECT': { imgSrc: 'images/DECT.jpeg', altText: 'DECT', description: '<strong>DECT</strong><br>je skratka pre Digital Enhanced Cordless Telecommunications – digitálny bezdrôtový štandard, ktorý sa používa najmä pre bezdrôtové (šnúrové) telefóny v domácnostiach aj firmách.Umožňuje bezpečný, kvalitný prenos hlasu medzi základňou a slúchadlom na krátku vzdialenosť.Používa vlastné frekvenčné pásmo, takže sa neruší s Wi‑Fi' },
    'Bts': { imgSrc: 'images/bts.jpg', altText: 'Vysielač', description: '<strong>Vysielač</strong><br>Mobilný vysielač, umožňujúci šíriť signal cez 5G,4G a 2G sieť.' },
    'GOBOX': { imgSrc: 'images/gobox.jpg', altText: 'Magio GO TV Box Android', description: '<strong>Skyworth STB-HY4403</strong><br>Skyworth STB-HY4403 - je Magio Box prenosné zariadenie, ktoré prináša sledovanie internetovej televízie Magio GO aj na veľkú obrazovku televízneho prijímača.' },
    'Mesh': { imgSrc: 'images/mesh.png', altText: 'Wi-Fi Mesh (WOW Wi-Fi)', description: '<strong>Kaon AR1344E</strong><br>Kaon AR1344E Wi-Fi Mesh je doplnkové zariadenie pre zlepšenie pokrytia Wi-Fi signálu.' },
    'FWA-indoor': { imgSrc: 'images/FWA-indoor-router.jpg', altText: 'ZTE MC801A Indoor Router', description: '<strong>ZTE MC801A</strong><br>5G Wi-Fi router pre použitie v domácnosti či menšej firme.' },
    'WNC': { imgSrc: 'images/wnc.jpeg', altText: ' WNC anténa ', description: '<strong>ZTE MC801A</strong><br>WNC anténa.' },
	'Rozbocovac': { imgSrc: 'images/rozbocovac5.jpeg', altText: ' Rozdeľovač telefónov RJ11 6P4C 1 zástrčka / 5 zásuviek', description: '<strong>Rozdeľovač telefónov RJ11 6P4C 1 zástrčka / 5 zásuviek</strong><br>Telefónny rozbočovač slúži na rozvetvenie konektora RJ11 6p4c' },
    'FWA-outdoor': { imgSrc: 'images/FWA-outdoor-router.jpg', altText: 'WNC AF55 5G Outdoor Router', description: '<strong>WNC AF55 5G</strong><br>WNC AF55 5G je výkonný router určený pre domácnosti aj podniky, ktorý poskytuje vysokorýchlostné 5G pripojenie, nízku latenciu, podporu viacerých zariadení a pokročilé bezpečnostné funkcie, ideálny pre moderné bezdrôtové siete.' },
    'ADB': { imgSrc: 'images/adbbio.jpg', altText: 'ADB SV4251 BIO', description: '<strong>ADB SV4251 BIO</strong><br>ADB SV4251 BIO je High-End multifunkčný WiFi router pre malé a stredné firmy. Podporuje pripojenie Ethernetom do 1Gbs, duplexným VDSL až do rýchlosti 100/50 Mbps a v móde ADSL2+ do rýchlosti 24/1 Mbps.Zákazník má možnosť pripojiť 20 a viac zariadení bezdrôtovou technológiou WiFi s rýchlosťou až 300 Mbps alebo 4x pomocou ethernet kábla s rýchlosťou až 1 Gbps. ADB SV4251 podporuje pripojenie až 4x telefónu pre službu Extra Číslo.V rámci služby Firemný Internet dostane zákazník prístup k pokročilým nastaveniam siete, hardwarovo podporovaný IP-Sec, 3G Backup, vzdialenú správu, prístup k službe VVN a iné.'},
    '2,4': { imgSrc: 'images/2,4.jpeg', altText: 'Wi-Fi 2,4 Ghz', description: '<strong>2,4 GHz Wi-Fi</strong><br>2,4 GHz je Wi‑Fi pásmo, ktoré má dlhší dosah, ale nižšiu rýchlosť.  ✅<strong> Výhody:</strong> lepší dosah – prejde cez steny a podlahy, stabilnejšie spojenie na väčšiu vzdialenosť, vhodné pre smart zariadenia (mobil, IoT, tlačiareň)  ❌ <strong>Nevýhody:</strong> pomalšia rýchlosť, viac rušené (mikrovlnka, Bluetooth, susedné Wi‑Fi), v panelákoch býva preplnené.' },
	'5': { imgSrc: 'images/5.jpeg', altText: 'Wi-Fi 5 Ghz', description: '<strong>5 GHz Wi-Fi</strong><br>5 GHz je Wi‑Fi pásmo, ktoré má vyššiu rýchlosť, ale kratší dosah.✅ <strong>Výhody:</strong> vyššia rýchlosť, menej rušenia (čistejšie pásmo), lepšie na video, online hovory, hry❌ <strong>Nevýhody:</strong> kratší dosah, horšie prechádza cez steny, ďalej od routera môže signál slabnúť' },
	'wifi-icon': { imgSrc: 'images/wifi-icon.jpg', altText: 'Wi-Fi', description: '<strong>Wi-Fi</strong><br>Symbol pre bezdrôtové pripojenie alebo bezdrôtovú sieť.' },
	'bluetooth': { imgSrc: 'images/bluetooth.jpeg', altText: 'Bluetooth', description: '<strong>Bluetooth</strong><br>Bluetooth je bezdrôtová technológia na krátku vzdialenosť, ktorá slúži na prepojenie zariadení medzi sebou bez káblov.' },
    'bus': { imgSrc: 'images/Bus.png', altText: 'Zbernicová topológia (BUS)', description: '<strong>Zbernicova technológia (BUS)</strong><br>Zbernicová topológia je taktiež známa ako lineárna zbernica ( BUS ). Ide o najjednoduchšiu a v minulosti najčastejšie používanú topológiu. Chrbticou siete je spojovacie vedenie (hlavný kábel, segment), ku ktorému sú, pomocou príslušných odbočovacích prvkov, pripojené jednotlivé uzly siete (iné spojenia medzi uzlami neexistujú) bez centrálnej alebo riadiacej stanice. Dátové správy sa šíria vedením všetkými smermi a všetky stanice k nim majú prístup. To znamená, že každá stanica v sieti vidí signály každej, čo môže byť výhodou, pokiaľ tieto informácie chce získať' },
    'star': { imgSrc: 'images/star.png', altText: 'Hviezdicová topológia (STAR)', description: '<strong>Hviezdicová topológia (STAR)</strong><br>Táto topológia, predstavujúca súčasný trend vytvárania počítačových sietí, ponúka centralizované zdroje a správu. Pochádza ešte z počiatkov používania výpočtovej techniky, kedy boli počítače pripojené k centrálnemu počítaču mainframe. Spoje od koncových pripojených uzlov sú vedené do centrálneho uzla (tzv. centrálny koncentrátor, hub, rozbočovač), čo je prvok realizujúci elektrické prepojenie koncových uzlov.' },
    'ring': { imgSrc: 'images/ring2.png', altText: ' Kruhová topológia (RING)', description: '<strong> Kruhová topológia je jednoduchý uzavretý kruh pozostávajúci z uzlov a liniek, kde každý uzol je prepojený iba s dvomi susediacimi uzlami. V sieti kruhovej topológie sú stanice prepojené vedením do tvaru súvislého kruhu tak, že vysielacia časť jedného uzla je pripojená na prijímaciu časť uzla nasledujúceho. Dátové správy sa postupne predávajú medzi stanicami jedným smerom podľa určitej hierarchie. Signál postupuje v slučke v jednom smere a prechádza všetkými počítačmi.' },
    'meshT': { imgSrc: 'images/meshT.png', altText: 'Kompletná topológia ( Complete, Mesh)', description: '<strong>Kompletná topológia ( Complete, Mesh)</strong><br>V tejto topológii je každý uzol siete prepojený linkou so všetkými ostatnými uzlami v sieti (sú vytvorené redundantné spojenia) Výhodou tejto topológie je, že ak nastane porucha niektorej linky, informácie môžu ďalej putovať cez ľubovoľnú inú linku v sieti až k cieľu (informácia môže použiť viac ciest k cieľu). Nevýhodou je použitie obrovského množstva káblu čo vedie k vysokej cene riešenia. Správanie sa siete veľmi závisí od použitých zariadení.' }
};

// NOVÁ DÁTOVÁ ŠTRUKTÚRA PRE KATEGORIZÁCIU ZARIADENÍ V PALETE
const deviceCategories = {
    'Routers': [
        'router', 'ont-router', 'hag-router','NT', 'FWA-indoor', 'FWA-outdoor', 'ADB','WNC', 'Mesh'
    ],
    'Koncové Zariadenia': [
        'phone','895I','ISDN', 'notebook', 'mobile-phone', 'PC', 'TV'
    ],
	'ISDN aparáty': [
        'DX600','ISDN', 'CX470','DECTBASE', '212', 'PBX14', 'HICOM'
    ],
	'IP aparáty': [
        'GXV3470', 'Yealink T46U', 'WP820', 'Yealink W90B', 'Yealink W73H', 'SNOM D717','Yealink MP54', 'Grandstream GXV3450', 'Grandstream DP752', 'Grandstream DP730', 'Cisco CP-8861'
    ],
    'Sieťová Infraštruktúra': [
        'server', 'switch','telefonny-stlp', 'cloud', 'internet','Rozbocovac'
    ],
    'Zásuvky': [
        'socket', 'telephone-socket', 'optical-socket', 'ethernet-socket'
    ],
    'Káble': [
        'ethernet-cable', 'telephone-cable', 'optical-cable', 'hdmi-cable', 'coaxial-cable'
    ],
    'Bezdrôtové': [
        'wifi-icon', '2,4','5','5G','DECT', 'Bts','bluetooth'
    ],
    'Magio Boxy': [
        'GOBOX'
    ],
    'Topológia sietí': [ // Príklad pridanej kategórie pre topológie, ak by ste chceli "bus" zariadenie v palete
        'bus' , 'star' ,'ring' , 'meshT'
    ]
};

// Definície scenárov
const scenarioDefinitions = {
    'free': {
        description: "Voľná tvorba schémy. Ťahajte a spájajte zariadenia ako chcete.",
        requiredDevices: [],
        requiredConnections: []
    },
    'gpon': {
        description: "Úloha: Vytvorte GPON sieť. Musíte použiť zariadenia s ponuky a spojiť tieto zariadenia.",
        requiredDevices: [
            { type: 'optical-socket', count: 1, label: 'Optická Zásuvka' },
            { type: 'optical-cable', count: 1, label: 'Optický kábel' },
            { type: 'ont-router', count: 1, label: 'ONT Router' },
            { type: ['notebook', 'mobile-phone'], count: { min: 1 }, label: 'Notebook alebo Mobilný telefón (aspoň jedno)' },
            { type: 'ethernet-cable', count: { min: 0, max: Infinity }, label: 'Ethernet kábel (voliteľné, podľa potreby)' },
            { type: 'wifi-icon', count: { min: 0, max: Infinity }, label: 'Wi-Fi ikona (voliteľné, podľa potreby)' }
        ],
        requiredConnections: [
            ['optical-socket', 'optical-cable'],
            ['optical-cable', 'ont-router'],
        ]
    },
    'vdsl': {
        description: "Úloha: Vytvorte VDSL sieť. Musíte použiť zariadenia s ponuky a spojiť tieto zariadenia",
        requiredDevices: [
            { type: 'telephone-socket', count: 1, label: 'Telefónna Zásuvka' },
            { type: 'telephone-cable', count: 2, label: 'Telefónny kábel' },
            { type: 'hag-router', count: 1, label: 'HAG-Router' },
            { type: ['notebook', 'mobile-phone'], count: { min: 1 }, label: 'Notebook alebo Mobilný telefón (aspoň jedno)' },
            { type: 'ethernet-cable', count: { min: 0, max: Infinity }, label: 'Ethernet kábel (voliteľné, podľa potreby)' },
            { type: 'wifi-icon', count: { min: 0, max: Infinity }, label: 'Wi-Fi ikona (voliteľné, podľa potreby)' }
        ],
        requiredConnections: [
            ['telephone-socket', 'telephone-cable'],
            ['telephone-cable', 'hag-router'],
        ]
    },
    'fwa': {
        description: "Úloha: Vytvorte fwa sieť. Musíte použiť zariadenia s ponuky a spojiť tieto zariadenia",
        requiredDevices: [
            { type: 'Bts', count: 1, label: 'Vysielač' },
            { type: '5G', count: 1, label: 'Mobilný signál' },
            { type: ['FWA-indoor', 'FWA-outdoor'], count: { min: 1 }, label: 'Indoor/Outdoor router(aspoň jedno)' },
            { type: ['notebook', 'mobile-phone'], count: { min: 1 }, label: 'Notebook alebo Mobilný telefón (aspoň jedno)' },
            { type: 'ethernet-cable', count: { min: 0, max: Infinity }, label: 'Ethernet kábel (voliteľné, podľa potreby)' },
            { type: 'wifi-icon', count: { min: 0, max: Infinity }, label: 'Wi-Fi ikona (voliteľné, podľa potreby)' }
        ],
        requiredConnections: [
            ['Bts', '5G'],
            ['5G', ['FWA-indoor', 'FWA-outdoor']], // Upravené pre flexibilitu
        ]
    }
};

// NOVÁ DÁTOVÁ ŠTRUKTÚRA PRE PRÍKLADY TOPOLÓGIÍ SIETÍ
const topologyDefinitions = {
    'busTopology': {
        name: 'Zbernicová topológia (BUS)',
        description: `Zbernicová topológia je taktiež známa ako lineárna zbernica ( BUS ). Ide o najjednoduchšiu a v minulosti najčastejšie používanú topológiu. Chrbticou siete je spojovacie vedenie (hlavný kábel, segment), ku ktorému sú, pomocou príslušných odbočovacích prvkov, pripojené jednotlivé uzly siete (iné spojenia medzi uzlami neexistujú) bez centrálnej alebo riadiacej stanice. Dátové správy sa šíria vedením všetkými smermi a všetky stanice k nim majú prístup. To znamená, že každá stanica v sieti vidí signály každej, čo môže byť výhodou, pokiaľ tieto informácie chce získať.

        Dáta v sieti, vo forme elektrických signálov, sú posielané všetkým počítačom v sieti, ale informáciu príjme iba ten počítač, ktorého adresa odpovedá adrese zakódovanej v počiatočnom signály. Pretože v daný okamih môže správy odosielať vždy iba jeden počítač, výkon siete závisí na počtu počítačov pripojených k zbernici. Čím viac počítačov je k zbernici pripojených, tím viac počítačov bude čakať, aby mohli poslať dáta po zbernici, a tým bude sieť pomalšia.

        Hlavnými výhodami tejto topológie sú:
        <ul>
            <li>použitie jedného vedenia,</li>
            <li>porucha stanice prevádzku na sieti neovplyvní,</li>
            <li>pomerne ľahko sa k sieti pripojujú nové stanice,</li>
            <li>stanice vysielajú správy ostatným staniciam naraz a stanica, ktorá je určená, si ju zo správ pohybujúcich sa na sieti sama vyberie. Správy určené iným staniciam bude ignorovať.</li>
        </ul>
        Medzi nevýhody okrem iného patria:
        <ul>
            <li>poruchu iných staníc kábel nezaznamenáva,</li>
            <li>vysoký počet odbočiek môže spôsobovať problémy v sieti (rozpojenie konektorov môže znamenať zlyhanie siete),</li>
            <li>obtiažna identifikácia príčin poruchy,</li>
            <li>topologická obmedzenosť počtu uzlov, i vzdialenosti medzi nimi,</li>
            <li>striktné zdieľanie pásma bez možnosti významnejšie ovplyvniť túto vlastnosť použitím aktívnych prvkov,</li>
            <li>vysoký počet pripojených staníc môže veľmi obmedziť využitie siete,</li>
        </ul>
        Túto topológiu používa Ethernet realizovaný pomocou koaxiálneho káblu. Existujú dve špecifikácie, 10Base-2 a 10Base-5, ktorých rozdiel je daný typom použitého káblu a jeho dĺžkou. Počítačové siete založené na zbernicovej topológii sa dnes považujú za zastarané.`,
        devices: [
            { id: 'bus_pc1', type: 'PC', x: 100, y: 200 },
            { id: 'bus_pc2', type: 'PC', x: 300, y: 200 },
            { id: 'bus_server', type: 'server', x: 500, y: 200 },
            { id: 'bus_pc3', type: 'PC', x: 700, y: 200 }
        ],
        connections: [
            { from: 'bus_pc1', to: 'bus_pc2', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc3', type: 'ethernet' }
        ]
    },
    'starTopology': {
        name: 'Hviezdicová topológia (STAR)',
        description: `Táto topológia, predstavujúca súčasný trend vytvárania počítačových sietí, ponúka centralizované zdroje a správu. Pochádza ešte z počiatkov používania výpočtovej techniky, kedy boli počítače pripojené k centrálnemu počítaču mainframe. Spoje od koncových pripojených uzlov sú vedené do centrálneho uzla (tzv. centrálny koncentrátor, hub, rozbočovač), čo je prvok realizujúci elektrické prepojenie koncových uzlov. Koncentrátor otvára a udržuje otvorenú logickú cestu k cieľovej stanici tak, aby nedochádzalo ku konfliktom medzi správami, ktoré sú naň posielané zo všetkých staníc v sieti. Zároveň zachováva možnosť prístupu stanice k signálom všetkých ostatných staníc v sieti. Všetky signály sa prenášajú z vysielacieho počítača cez rozbočovače do všetkých počítačov v sieti, pričom každými dvoma stanicami musí existovať len jedna cesta. Centrálny uzol môže pracovať buď ako pasívny koncentrátor (iba distribuuje signál vyslaný stanicami), alebo ako aktívny opakovač, alebo rozbočovač. Spoje sú najčastejšie realizované pomocou symetrického kábla. Všetky informácie putujú do jediného zariadenia, čo môže byť výhodou z hľadiska bezpečnosti alebo obmedzovania prístupu, ale zároveň to môže viesť k bezpečnostným problémom.
        Výhody hviezdicovej topológie:
        <ul>
            <li>menšia náchylnosť k poruchám káblov (iba v rámci jednotlivých prepojení medzi centrálnym a koncovým uzlom) a súvisiacim výpadkom siete (pri prerušení káblu medzi stanicou koncentrátorom nie je ovplyvnená činnosť ostatných staníc),,</li>
            <li>jednoduché protokoly a ľahké monitorovanie siete</li>
            
        </ul>
        Nevýhody hviezdicovej topológie:
        <ul>
            <li>väčšia potreba káblových vedení, bez možnosti slučiek,</li>
            <li>ak dôjde k poruche koncentrátora, znamená to zástavu činnosti všetkých uzlov a kolaps siete,</li>
            <li>náklady na nákup koncentrátora</li>
            
        </ul>
        Najjednoduchšia a najčastejšie používaná konfigurácia tejto topológie obsahuje jeden koncentrátor na ktorom je napojených niekoľko uzlov. Zložitejšie konfigurácie môžu obsahovať niekoľko prepojených koncentrátorov – táto konfigurácia sa nazýva strom (Tree). Stromová topológia nepoužíva centrálny uzol, ale namiesto toho používa „koreňový“ uzol, z ktorého putujú „vetvy“ k ďalším uzlom v sieti v určitej hierarchii. Existujú dva typy stromovej topológie:
        <ul>
            <li>binárny strom – z každého uzla vedú iba dve vetvy,</li>
            <li>chrbticový strom – všetky vetvy k uzlom vychádzajú z jedného kmeňa.</li>
            <li>náklady na nákup koncentrátora</li>
            
        </ul>`,
        devices: [
         { id: 'bus_pc1', type: 'PC', x: 100, y: 100 },
            { id: 'bus_pc2', type: 'PC', x: 300, y: 100 },
            { id: 'bus_pc3', type: 'PC', x: 500, y: 100 },
            { id: 'bus_server', type: 'server', x: 300, y: 300 },
            { id: 'bus_pc4', type: 'PC', x: 100, y: 500 },
            { id: 'bus_pc5', type: 'PC', x: 300, y: 500 },
            { id: 'bus_pc6', type: 'PC', x: 500, y: 500 }
        ],
        connections: [
            { from: 'bus_pc1', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc3', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc4', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc5', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc6', to: 'bus_server', type: 'ethernet' }
            
         ]
    },
     'ringTopology': {
        name: 'Kruhová topológia (RING)',
        description: `Kruhová topológia je jednoduchý uzavretý kruh pozostávajúci z uzlov a liniek, kde každý uzol je prepojený iba s dvomi susediacimi uzlami. V sieti kruhovej topológie sú stanice prepojené vedením do tvaru súvislého kruhu tak, že vysielacia časť jedného uzla je pripojená na prijímaciu časť uzla nasledujúceho. Dátové správy sa postupne predávajú medzi stanicami jedným smerom podľa určitej hierarchie. Signál postupuje v slučke v jednom smere a prechádza všetkými počítačmi. Na rozdiel od pasívnej zbernicovej topológie, v kruhovej topológii funguje každý počítač ako opakovač, tzn. že zosilňuje signál a posiela ho do ďalšieho počítača. Pretože signál prechádza všetkými počítačmi, môže mať zlyhanie jedného počítača dopad na celú sieť. Typickými technológiami používajúcimi topológiu kruhu sú Token Ring a FDDI (obidve používajú logický kruh, ale fyzicky je topológia tvorená hviezdou s centrálnym prvkom).
        Výhody kruhovej topológie:
        <ul>
            <li>jednoduchý spôsob predávania dátových správ bez náchylnosti ku kolíziám medzi stanicami,</li>
            <li>možnosť realizácie vyšších prenosových rýchlostí a možnosť zapojiť do siete viac uzlov bez akýchkoľvek prídavných zariadení,</li>
            <li>možnosť garantovať maximálnu dobu pre dosiahnutie spojenia medzi ľubovoľnými v sieti zapojenými stanicami.</li>
        </ul>
        Nevýhody kruhovej topológie:
        <ul>
            <li>pri poruche stanice dôjde k prerušeniu činnosti siete,</li>
            <li>výrazne vyššia cena sieťových kariet.</li>
            
            
        </ul>
        Špeciálnym rozšírením kruhovej topológie je topológia dvojitého kruhu (Dual Ring), ktorá pozostáva z dvoch nezávislých sústredných kruhov, ktoré nie sú vzájomne elektricky prepojené. Obidva uzly nezávisle prepájajú tie isté uzlové počítače. Použitie dvoch nezávislých kruhov zvyšuje celkovú spoľahlivosť a flexibilitu siete. Každé sieťové zariadenie je časťou dvoch nezávislých kruhových topológií. Logicky sa dual ring správa ako dva nezávislé kruhy, z ktorých v jednom časovom okamžiku pracuje (je použitý) iba jeden.
        Typickými technológiami používajúcimi topológiu kruhu sú FDDI (Fiber Distributed Data Interface) a CDDI (Cable Distributed Data Interface), pričom obidve používajú logický kruh, ale fyzicky je topológia tvorená hviezdou s centrálnym prvkom). Zložitejšie topológie sietí môžu obsahovať kombinácie vyššie uvedených typov, najčastejšie kombináciu niekoľko hviezd do stromovej štruktúry. Topológia siete má kľúčový význam v oblasti lokálnych sietí, kde s ňou úzko súvisí samotný spôsob komunikácie medzi jednotlivými uzlami.
        `,
        devices: [
            { id: 'bus_pc1', type: 'PC', x: 100, y: 100 },
            { id: 'bus_pc2', type: 'PC', x: 500, y: 100 },
            { id: 'bus_pc3', type: 'PC', x: 500, y: 300 },
            { id: 'bus_server', type: 'server', x: 300, y: 50 },
            { id: 'bus_pc4', type: 'PC', x: 300, y: 380 },
            { id: 'bus_pc5', type: 'PC', x: 100, y: 300 }
        ],
        connections: [
            { from: 'bus_pc1', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc2', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_pc3', type: 'ethernet' },
            { from: 'bus_pc3', to: 'bus_pc4', type: 'ethernet' },
            { from: 'bus_pc4', to: 'bus_pc5', type: 'ethernet' },
            { from: 'bus_pc5', to: 'bus_pc1', type: 'ethernet' }
            
         ]
    },
    'meshTopology': {
        name: 'Kompletná topológia ( Complete, Mesh)',
        description: `V tejto topológii je každý uzol siete prepojený linkou so všetkými ostatnými uzlami v sieti (sú vytvorené redundantné spojenia) Výhodou tejto topológie je, že ak nastane porucha niektorej linky, informácie môžu ďalej putovať cez ľubovoľnú inú linku v sieti až k cieľu (informácia môže použiť viac ciest k cieľu). Nevýhodou je použitie obrovského množstva káblu čo vedie k vysokej cene riešenia. Správanie sa siete veľmi závisí od použitých zariadení.`,
        devices: [
            { id: 'bus_pc1', type: 'PC', x: 100, y: 100 },
            { id: 'bus_pc2', type: 'PC', x: 500, y: 100 },
            { id: 'bus_pc3', type: 'PC', x: 500, y: 300 },
            { id: 'bus_server', type: 'server', x: 300, y: 0 },
            { id: 'bus_pc4', type: 'PC', x: 300, y: 380 },
            { id: 'bus_pc5', type: 'PC', x: 100, y: 300 }
        ],
        connections: [
            { from: 'bus_pc1', to: 'bus_server', type: 'ethernet' },
            { from: 'bus_pc1', to: 'bus_pc2', type: 'ethernet' },
            { from: 'bus_pc1', to: 'bus_pc3', type: 'ethernet' },
            { from: 'bus_pc1', to: 'bus_pc4', type: 'ethernet' },
            { from: 'bus_pc1', to: 'bus_pc5', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc2', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc3', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc4', type: 'ethernet' },
            { from: 'bus_server', to: 'bus_pc5', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_pc3', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_pc4', type: 'ethernet' },
            { from: 'bus_pc2', to: 'bus_pc5', type: 'ethernet' },
            { from: 'bus_pc3', to: 'bus_pc4', type: 'ethernet' },
            { from: 'bus_pc3', to: 'bus_pc5', type: 'ethernet' },
            { from: 'bus_pc4', to: 'bus_pc5', type: 'ethernet' }
            
         ]
    }
    // Tu môžete pridávať ďalšie definície topológií (hviezda, kruh, atď.)
};

// NOVÁ DÁTOVÁ ŠTRUKTÚRA PRE PRÍKLADY ZAPOJENÍ
const exampleDefinitions = {
    'bridgeMode': {
        name: 'Bridge Mode - GPON',
        description: 'Ukážka zapojenia GPON ONT v Bridge móde s externým routerom. Optický kábel z optickej zásuvky vstupuje do ONT routera. ONT router v bridge móde preposiela dáta na externý router cez Ethernet kábel. Koncové zariadenia (notebook, mobil) sú pripojené k externému routeru káblovým alebo bezdrôtovým spojením.',
        devices: [
            { id: 'ex_bm_opt_sock', type: 'optical-socket', x: 50, y: 200 },
            { id: 'ex_bm_opt_cable_dev', type: 'optical-cable', x: 180, y: 200 },
            { id: 'ex_bm_ont_router', type: 'ont-router', x: 310, y: 200 },
            { id: 'ex_bm_eth_cable_dev', type: 'ethernet-cable', x: 440, y: 200 },
            { id: 'ex_bm_ext_router', type: 'router', x: 570, y: 200 },
            { id: 'ex_bm_eth_cable_dev2', type: 'ethernet-cable', x: 600, y: 50 },
            { id: 'ex_bm_notebook', type: 'notebook', x: 780, y: 50 },
            { id: 'ex_bm_mobile', type: 'mobile-phone', x: 780, y: 380 },
            { id: 'ex_bm_wifi_icon', type: 'wifi-icon', x: 600, y: 380 }
        ],
        connections: [
            { from: 'ex_bm_opt_sock', to: 'ex_bm_opt_cable_dev', type: 'optical' },
            { from: 'ex_bm_opt_cable_dev', to: 'ex_bm_ont_router', type: 'optical' },
            { from: 'ex_bm_ont_router', to: 'ex_bm_eth_cable_dev', type: 'ethernet' },
            { from: 'ex_bm_eth_cable_dev', to: 'ex_bm_ext_router', type: 'ethernet' },
            { from: 'ex_bm_ext_router', to: 'ex_bm_eth_cable_dev2', type: 'ethernet' },
            { from: 'ex_bm_eth_cable_dev2', to: 'ex_bm_notebook', type: 'ethernet' },
            { from: 'ex_bm_ext_router', to: 'ex_bm_wifi_icon', type: 'wifi' },
            { from: 'ex_bm_wifi_icon', to: 'ex_bm_mobile', type: 'wifi' }
        ]
    },
    'bridgeModeVDSL': {
        name: 'Bridge Mode - VDSL',
        description: 'Ukážka zapojenia VDSL HAG v Bridge móde s externým routerom. Telefonný kábel z teleonnej zásuvky vstupuje do HAG routera. HAG router v bridge móde preposiela dáta na externý router cez Ethernet kábel. Koncové zariadenia (notebook, mobil) sú pripojené k externému routeru káblovým alebo bezdrôtovým spojením.',
        devices: [
            { id: 'ex_fm_tel_sock', type: 'telephone-socket', x: 50, y: 200 },
            { id: 'ex_fm_tel_cable_dev', type: 'telephone-cable', x: 180, y: 200 },
            { id: 'ex_fm_hag_router', type: 'hag-router', x: 310, y: 200 },
            { id: 'ex_bm_eth_cable_dev', type: 'ethernet-cable', x: 440, y: 200 },
            { id: 'ex_bm_ext_router', type: 'router', x: 570, y: 200 },
            { id: 'ex_bm_eth_cable_dev2', type: 'ethernet-cable', x: 600, y: 50 },
            { id: 'ex_bm_notebook', type: 'notebook', x: 780, y: 50 },
            { id: 'ex_bm_mobile', type: 'mobile-phone', x: 780, y: 380 },
            { id: 'ex_bm_wifi_icon', type: 'wifi-icon', x: 600, y: 380 }
        ],
        connections: [
            { from: 'ex_fm_tel_sock', to: 'ex_fm_tel_cable_dev', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev', to: 'ex_fm_hag_router', type: 'telephone' },
            { from: 'ex_fm_hag_router', to: 'ex_bm_eth_cable_dev', type: 'ethernet' },
            { from: 'ex_bm_eth_cable_dev', to: 'ex_bm_ext_router', type: 'ethernet' },
            { from: 'ex_bm_ext_router', to: 'ex_bm_eth_cable_dev2', type: 'ethernet' },
            { from: 'ex_bm_eth_cable_dev2', to: 'ex_bm_notebook', type: 'ethernet' },
            { from: 'ex_bm_ext_router', to: 'ex_bm_wifi_icon', type: 'wifi' },
            { from: 'ex_bm_wifi_icon', to: 'ex_bm_mobile', type: 'wifi' }
        ]
    },
    'fullMode': {
        name: 'Full Mode - VDSL',
        description: 'Ukážka zapojenia VDSL linky do HAG routera (Home Access Gateway). Telefónny kábel z telefónnej zásuvky vedie do HAG routera. Koncové zariadenia (notebook) sú pripojené k HAG routeru káblovým alebo bezdrôtovým spojením.',
        devices: [
            { id: 'ex_fm_tel_sock', type: 'telephone-socket', x: 50, y: 200 },
            { id: 'ex_fm_tel_cable_dev', type: 'telephone-cable', x: 180, y: 200 },
            { id: 'ex_fm_hag_router', type: 'hag-router', x: 310, y: 200 },
            { id: 'ex_bm_eth_cable_dev', type: 'ethernet-cable', x: 440, y: 120 },
            { id: 'ex_fm_notebook_eth', type: 'notebook', x: 650, y: 120 },
            { id: 'ex_fm_notebook_wifi', type: 'notebook', x: 650, y: 280 },
            { id: 'ex_fm_wifi_icon', type: 'wifi-icon', x: 450, y: 280 }
        ],
        connections: [
            { from: 'ex_fm_tel_sock', to: 'ex_fm_tel_cable_dev', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev', to: 'ex_fm_hag_router', type: 'telephone' },
            { from: 'ex_fm_hag_router', to: 'ex_bm_eth_cable_dev', type: 'ethernet' },
            { from: 'ex_bm_eth_cable_dev', to: 'ex_fm_notebook_eth', type: 'ethernet' },
            { from: 'ex_fm_hag_router', to: 'ex_fm_wifi_icon', type: 'wifi' },
            { from: 'ex_fm_wifi_icon', to: 'ex_fm_notebook_wifi', type: 'wifi' }
        ]
    },
    'ExtracisloVDSL': {
        name: 'Extra číslo (VDSL)',
        description: 'Ukážka zapojenia VDSL linky do HAG routera (Home Access Gateway). Telefónny kábel z telefónnej zásuvky vedie do HAG routera. Koncové zariadenia sú pevné linky s doplnkovou službou Extra čislo. Zákaznik ma samostatné tel.čísla na koždom koncovom zariadení.Na jednom koncovom bode môže uskutočniť dva hovory nezávisle.',
        devices: [
            { id: 'ex_fm_tel_sock', type: 'telephone-socket', x: 50, y: 200 },
            { id: 'ex_fm_tel_cable_dev', type: 'telephone-cable', x: 180, y: 200 },
            { id: 'ex_fm_adbbio', type: 'ADB', x: 310, y: 200 },
            { id: 'ex_fm_phone_tel', type: 'phone', x: 750, y: 90 },
            { id: 'ex_fm_phone_tel1', type: 'phone', x: 750, y: 200 },
            { id: 'ex_fm_phone_tel2', type: 'phone', x: 750, y: 320 },
            { id: 'ex_fm_tel_cable_dev2', type: 'telephone-cable', x: 500, y: 90 },
            { id: 'ex_fm_tel_cable_dev3', type: 'telephone-cable', x: 500, y: 200 },
            { id: 'ex_fm_tel_cable_dev4', type: 'telephone-cable', x: 500, y: 320 }
        ],
        connections: [
            { from: 'ex_fm_tel_sock', to: 'ex_fm_tel_cable_dev', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev', to: 'ex_fm_adbbio', type: 'telephone' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev2', type: 'telephone' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev3', type: 'telephone' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev4', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev2', to: 'ex_fm_phone_tel', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev3', to: 'ex_fm_phone_tel1', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev4', to: 'ex_fm_phone_tel2', type: 'telephone' }
        ]
    },
    'ExtracisloGPON': {
        name: 'Extra číslo (GPON)',
        description: 'Ukážka zapojenia GPON linky cez ONT terminál a HAG. Keďže ADB BIO router nemá optické ukončenie, je potrebné ponechať ONT terminál vo forme bridge a následne pripojiť ADB SV4251 BIO. Optický kábel zo zásuvky je vedený do ONT a z ONT je vedený ethernetový kábel do ADB Bio. Koncové zariadenia sú pevné linky s doplnkovou službou Extra číslo. Zákazník má samostatné tel.čísla na každom koncovom zariadení. Na jednom koncovom bode môže uskutočniť dva hovory nezávisle.',
        devices: [
            { id: 'ex_bm_opt_sock', type: 'optical-socket', x: 20, y: 200 },
            { id: 'ex_bm_opt_cable_dev', type: 'optical-cable', x: 120, y: 200 },
            { id: 'ex_bm_ont_router', type: 'ont-router', x: 280, y: 200 },
            { id: 'ex_fm_adbbio', type: 'ADB', x: 410, y: 200 },
            { id: 'ex_fm_phone_tel', type: 'phone', x: 800, y: 90 },
            { id: 'ex_fm_phone_tel1', type: 'phone', x: 800, y: 200 },
            { id: 'ex_fm_phone_tel2', type: 'phone', x: 800, y: 320 },
            { id: 'ex_fm_tel_cable_dev2', type: 'telephone-cable', x: 600, y: 90 },
            { id: 'ex_fm_tel_cable_dev3', type: 'telephone-cable', x: 600, y: 200 },
            { id: 'ex_fm_tel_cable_dev4', type: 'telephone-cable', x: 600, y: 320 }
        ],
        connections: [
            { from: 'ex_bm_opt_sock', to: 'ex_bm_opt_cable_dev', type: 'optical' },
            { from: 'ex_bm_opt_cable_dev', to: 'ex_bm_ont_router', type: 'optical' },
            { from: 'ex_bm_ont_router', to: 'ex_fm_adbbio', type: 'ethernet' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev2', type: 'telephone' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev3', type: 'telephone' },
            { from: 'ex_fm_adbbio', to: 'ex_fm_tel_cable_dev4', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev2', to: 'ex_fm_phone_tel', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev3', to: 'ex_fm_phone_tel1', type: 'telephone' },
            { from: 'ex_fm_tel_cable_dev4', to: 'ex_fm_phone_tel2', type: 'telephone' }
        ]
    }
};

// ===============================================
// HLAVNÉ FUNKCIE A LOGIKA
// ===============================================

// Prihlasovacia logika
function login() {
    const usernameInput = document.getElementById('username');
    loggedInUsername = usernameInput.value.trim();
    if (loggedInUsername) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        document.getElementById('userInfo').textContent = `Prihlásený ako: ${loggedInUsername}`;
        selectMode('free'); // Nastaví predvolený režim po prihlásení
    } else {
        alert('Zadajte používateľské meno!');
    }
}

// Funkcia na vyčistenie pracovnej plochy
function clearWorkspace() {
    const workspace = document.getElementById('workspace');
    const svgOverlay = document.getElementById('line-svg-overlay');

    svgOverlay.innerHTML = `
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
            </marker>
        </defs>
    `;

    document.querySelectorAll('.device').forEach(device => device.remove());
    drawnLines = [];
    selectedDevicesForLine = [];
    selectedLineTypeKey = null;
    hideLineTypeSelectionModal();
    lineDrawingMode = false;
    updateLineDrawingUIState();
    updateLineDrawingInstruction();
    deviceCounter = 0;
    rightClickedDeviceId = null;
    selectedLineId = null;
    const modeDescriptionDiv = document.getElementById('mode-description');
    if (modeDescriptionDiv) {
        modeDescriptionDiv.innerHTML = ''; // Nastaví obsah na prázdny reťazec
         }
}

// Funkcia na výber režimu (Voľná tvorba, GPON, VDSL, FWA)
function selectMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    clearWorkspace();
    const modeDescriptionDiv = document.getElementById('mode-description');
    modeDescriptionDiv.innerHTML = `<strong>Režim: ${mode.toUpperCase()}</strong><br>${scenarioDefinitions[mode].description}`;
    document.querySelectorAll('input[name="appMode"]').forEach(radio => {
        radio.checked = (radio.value === mode);
    });
    loadScenarioControls(mode);
}

// Funkcia na načítanie kontrolných prvkov a úloh pre scenáre
function loadScenarioControls(mode) {
    const palette = document.getElementById('device-palette');
    const checkSolutionBtn = document.getElementById('checkSolutionBtn');
    palette.style.display = 'block';

    checkSolutionBtn.style.display = (mode === 'gpon' || mode === 'vdsl' || mode === 'fwa') ? 'block' : 'none';

    if (lineDrawingMode) {
        disableLineDrawingMode();
    }
    renderDevicePalette();
}

// Funkcia na vytvorenie screenshotu
async function takeScreenshot() {
    const workspace = document.getElementById('workspace');
    const palette = document.getElementById('device-palette');
    const originalPaletteDisplay = palette.style.display;
    palette.style.display = 'none';
    try {
        const canvas = await html2canvas(workspace, {
            useCORS: false,
            logging: true,
            scale: 2
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `sietova_schema_${loggedInUsername || 'anonym'}_${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Chyba pri vytváraní screenshotu:", error);
        alert("Nepodarilo sa vytvoriť screenshot. Skúste znova. Skontrolujte konzolu prehliadača pre detaily.");
    } finally {
        palette.style.display = originalPaletteDisplay;
    }
}

// ===============================================
// LOGIKA PRE DRAG & DROP ZARIADENÍ
// ===============================================
let draggedElement = null;
let isCloning = false;
let offsetX, offsetY;

function generateUniqueDeviceId() {
    deviceCounter++;
    return `device-${deviceCounter}`;
}

function createDeviceElement(type, x, y) {
    const def = deviceDefinitions[type];
    if (!def) {
        console.error(`Chyba: Definícia pre typ zariadenia "${type}" nebola nájdená.`);
        return null;
    }

    const deviceDiv = document.createElement('div');
    deviceDiv.className = 'device';
    deviceDiv.setAttribute('data-type', type);
    deviceDiv.id = generateUniqueDeviceId();
    deviceDiv.style.left = `${x}px`;
    deviceDiv.style.top = `${y}px`;

    const innerDiv = document.createElement('div');
    innerDiv.className = 'device-inner';
    const img = document.createElement('img');
    img.src = def.imgSrc;
    img.alt = def.altText;
    innerDiv.appendChild(img);
    deviceDiv.appendChild(innerDiv);

    deviceDiv.onclick = function(event) {
        document.getElementById('custom-context-menu').style.display = 'none';
        if (lineDrawingMode) {
            handleDeviceClickForLine(deviceDiv.id);
            event.stopPropagation();
        }
    };

    deviceDiv.ondblclick = function(event) {
        showDeviceDescriptionModal(deviceDiv.getAttribute('data-type'));
        event.stopPropagation();
    };

    return deviceDiv;
}

document.addEventListener('mousedown', function(e) {
    const contextMenu = document.getElementById('custom-context-menu');
    if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }

    if (lineDrawingMode) return;

    const targetPaletteItem = e.target.closest('.palette-item');
    const targetDevice = e.target.closest('.device');

    if (targetPaletteItem) {
        isCloning = true;
        const deviceType = targetPaletteItem.getAttribute('data-type');
        draggedElement = createDeviceElement(deviceType, 0, 0);
        if (draggedElement) { // Skontroluj, či createDeviceElement vrátil platný element
            document.getElementById('workspace').appendChild(draggedElement);
            draggedElement.classList.add('dragging');
            const rect = draggedElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        } else {
            console.warn(`Pokus o vytvorenie neznámeho zariadenia typu: ${deviceType}`);
            draggedElement = null; // Reset draggedElement, aby sa zabránilo ďalším chybám
        }
    } else if (targetDevice && e.target.closest('#workspace')) {
        isCloning = false;
        draggedElement = targetDevice;
        draggedElement.classList.add('dragging');
        offsetX = e.clientX - draggedElement.offsetLeft;
        offsetY = e.clientY - draggedElement.offsetTop;
    }
});

document.addEventListener('mousemove', function(e) {
    if (draggedElement) {
        e.preventDefault();
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        const workspace = document.getElementById('workspace');
        const workspaceRect = workspace.getBoundingClientRect();

        newLeft = Math.max(0, Math.min(newLeft, workspaceRect.width - draggedElement.offsetWidth));
        newTop = Math.max(0, newTop);

        draggedElement.style.left = newLeft + 'px';
        draggedElement.style.top = newTop + 'px';

        updateLines();
    }
});

document.addEventListener('mouseup', function() {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
        isCloning = false;
    }
});

// ===============================================
// LOGIKA PRE POPIS ZARIADENÍ (MODÁLNE OKNO)
// ===============================================
function showDeviceDescriptionModal(deviceType) {
    const def = deviceDefinitions[deviceType];
    if (!def) {
        console.error(`Definícia pre popis zariadenia "${deviceType}" nebola nájdená.`);
        return;
    }

    const modal = document.getElementById('device-description-modal');
    document.getElementById('device-desc-image').src = def.imgSrc;
    document.getElementById('device-desc-image').alt = def.altText;
    document.getElementById('device-desc-title').textContent = def.altText;
    document.getElementById('device-desc-text').innerHTML = def.description;
    modal.style.display = 'flex';
}

function hideDeviceDescriptionModal() {
    document.getElementById('device-description-modal').style.display = 'none';
}

// ===============================================
// LOGIKA PRE SPÁJANIE ZARIADENÍ ČIARAMI (SVG)
// ===============================================
function showLineTypeSelectionModal() {
    document.getElementById('line-type-selection-modal').style.display = 'flex';
}

function hideLineTypeSelectionModal() {
    document.getElementById('line-type-selection-modal').style.display = 'none';
}

function selectLineType(typeKey) {
    selectedLineTypeKey = typeKey;
    hideLineTypeSelectionModal();
    if (modalPurpose === 'initial') {
        lineDrawingMode = true;
    }
    updateLineDrawingUIState();
    updateLineDrawingInstruction();
}

function cancelLineTypeSelection() {
    hideLineTypeSelectionModal();
    if (modalPurpose === 'initial') {
        disableLineDrawingMode();
    }
    updateLineDrawingInstruction();
    document.querySelectorAll('.device.highlight-for-line').forEach(el => el.classList.remove('highlight-for-line'));
    selectedDevicesForLine = [];
}

function updateLineDrawingUIState() {
    const connectBtn = document.getElementById('connectBtn');
    const disableConnectBtn = document.getElementById('disableConnectBtn');
    const workspace = document.getElementById('workspace');

    if (lineDrawingMode) {
        connectBtn.style.backgroundColor = '#007bff';
        connectBtn.textContent = 'Vyberte typ spojenia';
        disableConnectBtn.style.display = 'inline-block';
        workspace.classList.add('line-drawing-cursor');
    } else {
        connectBtn.style.backgroundColor = '';
        connectBtn.textContent = 'Spojiť zariadenia';
        disableConnectBtn.style.display = 'none';
        workspace.classList.remove('line-drawing-cursor');
    }
}

function updateLineDrawingInstruction() {
    const instructionSpan = document.getElementById('line-drawing-instruction');
    if (!lineDrawingMode) {
        instructionSpan.textContent = '';
        return;
    }

    if (!selectedLineTypeKey) {
        instructionSpan.textContent = 'Vyberte typ spojenia.';
        return;
    }

    const lineTypeName = lineTypes[selectedLineTypeKey].name;
    if (selectedDevicesForLine.length === 0) {
        instructionSpan.textContent = `Vybraný typ spojenia: ${lineTypeName}. Kliknite na prvé zariadenie.`;
    } else if (selectedDevicesForLine.length === 1) {
        const firstDevice = document.getElementById(selectedDevicesForLine[0]);
        const deviceType = firstDevice ? deviceDefinitions[firstDevice.getAttribute('data-type')].altText : 'neznáme';
        instructionSpan.textContent = `Vybraný typ spojenia: ${lineTypeName}. Prvé zariadenie: ${deviceType}. Kliknite na druhé zariadenie.`;
    }
}

function toggleLineDrawingMode() {
    if (lineDrawingMode) {
        modalPurpose = 'changeType';
        showLineTypeSelectionModal();
    } else {
        lineDrawingMode = true;
        modalPurpose = 'initial';
        showLineTypeSelectionModal();
        updateLineDrawingUIState();
        updateLineDrawingInstruction();
    }
}

function disableLineDrawingMode() {
    lineDrawingMode = false;
    selectedLineTypeKey = null;
    selectedDevicesForLine.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('highlight-for-line');
    });
    selectedDevicesForLine = [];
    hideLineTypeSelectionModal();
    updateLineDrawingUIState();
    updateLineDrawingInstruction();
}

function handleDeviceClickForLine(deviceId) {
    if (!lineDrawingMode) {
        alert('Prosím, aktivujte režim spájania zariadení.');
        return;
    }

    if (!selectedLineTypeKey) {
        modalPurpose = 'initial';
        showLineTypeSelectionModal();
        return;
    }

    const deviceElement = document.getElementById(deviceId);
    if (selectedDevicesForLine.includes(deviceId)) {
        selectedDevicesForLine = selectedDevicesForLine.filter(id => id !== deviceId);
        deviceElement.classList.remove('highlight-for-line');
    } else {
        if (selectedDevicesForLine.length < 2) {
            selectedDevicesForLine.push(deviceId);
            deviceElement.classList.add('highlight-for-line');
            if (selectedDevicesForLine.length === 2) {
                const id1 = selectedDevicesForLine[0];
                const id2 = selectedDevicesForLine[1];

                if (id1 === id2) {
                    alert("Nemôžete spojiť zariadenie so sebou samým.");
                } else {
                    drawLine(id1, id2, selectedLineTypeKey);
                }

                document.getElementById(id1).classList.remove('highlight-for-line');
                document.getElementById(id2).classList.remove('highlight-for-line');
                selectedDevicesForLine = [];
            }
        } else {
            document.getElementById(selectedDevicesForLine[0]).classList.remove('highlight-for-line');
            document.getElementById(selectedDevicesForLine[1]).classList.remove('highlight-for-line');
            selectedDevicesForLine = [deviceId];
            deviceElement.classList.add('highlight-for-line');
        }
    }
    updateLineDrawingInstruction();
}

function drawLine(startDeviceId, endDeviceId, typeKey) {
    const startDeviceEl = document.getElementById(startDeviceId);
    const endDeviceEl = document.getElementById(endDeviceId);

    if (!startDeviceEl || !endDeviceEl || !typeKey || !lineTypes[typeKey]) {
        console.error("Neplatné argumenty pre drawLine alebo typ čiary nebol nájdený.", { startDeviceId, endDeviceId, typeKey });
        return;
    }

    const existingLineByIds = drawnLines.some(line => {
        const isExisting = (line.startDeviceId === startDeviceId && line.endDeviceId === endDeviceId) ||
                         (line.startDeviceId === endDeviceId && line.endDeviceId === startDeviceId);
        if (isExisting) {
            console.warn(`Attempted to draw duplicate connection between ${startDeviceId} and ${endDeviceId}. Existing line ID in drawnLines: ${line.id}.`);
        }
        return isExisting;
    });

    if (existingLineByIds) {
        alert(`Toto konkrétne prepojenie už existuje medzi týmito dvoma zariadeniami.`);
        return;
    }

    const svgOverlay = document.getElementById('line-svg-overlay');
    if (!svgOverlay) {
        console.error("SVG vrstva nebola nájdená.");
        return;
    }

    const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
    const startRect = startDeviceEl.getBoundingClientRect();
    const endRect = endDeviceEl.getBoundingClientRect();

    const x1 = (startRect.left + startRect.width / 2) - workspaceRect.left;
    const y1 = (startRect.top + startRect.height / 2) - workspaceRect.top;
    const x2 = (endRect.left + endRect.width / 2) - workspaceRect.left;
    const y2 = (endRect.top + endRect.height / 2) - workspaceRect.top;

    const lineId = `line-${startDeviceId}-${endDeviceId}-${Date.now()}`;

    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const lineDef = lineTypes[typeKey];

    newLine.setAttribute('id', lineId);
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('stroke', lineDef.color);
    newLine.setAttribute('stroke-width', '2');
    if (lineDef.dasharray) {
        newLine.setAttribute('stroke-dasharray', lineDef.dasharray);
    }
    newLine.setAttribute('marker-end', 'url(#arrowhead)');
    svgOverlay.appendChild(newLine);

    newLine.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        selectedLineId = newLine.id;
        showContextMenu(event.clientX, event.clientY, 'line');
    });

    drawnLines.push({
        id: lineId,
        startDeviceId: startDeviceId,
        endDeviceId: endDeviceId,
        element: newLine,
        lineTypeKey: typeKey
    });
    console.log(`Line ${lineId} added. Current drawnLines:`, drawnLines.map(l => l.id));
}

function deleteLine(lineId) {
    console.log('Attempting to delete line with ID:', lineId);
    console.log('drawnLines BEFORE filter:', drawnLines.map(l => l.id));

    const lineToRemove = document.getElementById(lineId);
    if (lineToRemove) {
        lineToRemove.remove();
        console.log(`SVG element ${lineId} removed from DOM.`);
    } else {
        console.warn(`SVG element ${lineId} not found in DOM.`);
    }

    const initialLength = drawnLines.length;
    drawnLines = drawnLines.filter(line => line.id !== lineId);
    const newLength = drawnLines.length;

    if (newLength < initialLength) {
        console.log(`Line ${lineId} successfully removed from drawnLines array.`);
    } else {
        console.warn(`Line ${lineId} was NOT found or removed from drawnLines array. Initial length: ${initialLength}, new length: ${newLength}.`);
    }

    console.log('drawnLines AFTER filter:', drawnLines.map(l => l.id));
    selectedLineId = null;
    updateLines();
}

function updateLines() {
    const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
    drawnLines = drawnLines.filter(line => {
        const startDevice = document.getElementById(line.startDeviceId);
        const endDevice = document.getElementById(line.endDeviceId);

        if (!startDevice || !endDevice) {
            if (line.element && line.element.parentNode) {
                line.element.parentNode.removeChild(line.element);
            }
            return false;
        }

        const startRect = startDevice.getBoundingClientRect();
        const endRect = endDevice.getBoundingClientRect();

        const x1 = (startRect.left + startRect.width / 2) - workspaceRect.left;
        const y1 = (startRect.top + startRect.height / 2) - workspaceRect.top;
        const x2 = (endRect.left + endRect.width / 2) - workspaceRect.left;
        const y2 = (endRect.top + endRect.height / 2) - workspaceRect.top;

        line.element.setAttribute('x1', x1);
        line.element.setAttribute('y1', y1);
        line.element.setAttribute('x2', x2);
        line.element.setAttribute('y2', y2);

        const lineDef = lineTypes[line.lineTypeKey];
        if (lineDef) {
            line.element.setAttribute('stroke', lineDef.color);
            if (lineDef.dasharray) {
                line.element.setAttribute('stroke-dasharray', lineDef.dasharray);
            } else {
                line.element.removeAttribute('stroke-dasharray');
            }
        }
        return true;
    });
}

// ===============================================
// LOGIKA PRE KONTROLU RIEŠENIA SCENÁROV
// ===============================================

const getCanonicalConnection = (type1, type2) => {
    return type1 < type2 ? `${type1}-${type2}` : `${type2}-${type1}`;
};

function findAndMarkLine(fromTypes, toTypes, requiredLineType, availableLines, usedLineIds, fromId = null, toId = null) {
    const fromTypesArr = Array.isArray(fromTypes) ? fromTypes : [fromTypes];
    const toTypesArr = Array.isArray(toTypes) ? toTypes : [toTypes];

    for (const line of availableLines) {
        if (usedLineIds.has(line.id)) continue;

        const startDevice = document.getElementById(line.startDeviceId);
        const endDevice = document.getElementById(line.endDeviceId);

        if (!startDevice || !endDevice) continue;

        const actualStartType = startDevice.getAttribute('data-type');
        const actualEndType = endDevice.getAttribute('data-type');

        const lineTypeMatch = (requiredLineType === undefined) ||
                              (line.lineTypeKey === requiredLineType);

        const idMatchStart = (fromId === null || line.startDeviceId === fromId);
        const idMatchEnd = (toId === null || line.endDeviceId === toId);

        const idMatchStartReversed = (fromId === null || line.endDeviceId === fromId);
        const idMatchEndReversed = (toId === null || line.startDeviceId === toId);

        const matchForward = fromTypesArr.includes(actualStartType) &&
                             toTypesArr.includes(actualEndType) &&
                             idMatchStart && idMatchEnd;

        const matchBackward = fromTypesArr.includes(actualEndType) &&
                              toTypesArr.includes(actualStartType) &&
                              idMatchStartReversed && idMatchEndReversed;

        if ((matchForward || matchBackward) && lineTypeMatch) {
            usedLineIds.add(line.id);
            return line;
        }
    }
    return null;
}

function checkSolution() {
    const currentScenario = scenarioDefinitions[currentMode];

    if (currentMode === 'free') {
        alert("V režime 'Voľná tvorba' nie je čo kontrolovať.");
        return;
    }

    if (!currentScenario) {
        alert("Neznámy scenár pre kontrolu.");
        return;
    }

    const allPlacedDevices = Array.from(document.querySelectorAll('.device'));
    const placedDeviceCounts = {};
    const placedDeviceElements = {};

    allPlacedDevices.forEach(device => {
        const type = device.getAttribute('data-type');
        placedDeviceCounts[type] = (placedDeviceCounts[type] || 0) + 1;
        if (!placedDeviceElements[type]) {
            placedDeviceElements[type] = [];
        }
        placedDeviceElements[type].push(device);
    });

    const allowedDeviceTypesInScenario = new Set();
    currentScenario.requiredDevices.forEach(req => {
        if (Array.isArray(req.type)) {
            req.type.forEach(t => allowedDeviceTypesInScenario.add(t));
        } else {
            allowedDeviceTypesInScenario.add(req.type); // Opravené z t.type na req.type
        }
    });

    for (const placedType in placedDeviceCounts) {
        if (!allowedDeviceTypesInScenario.has(placedType)) {
            alert(`Chyba: Zariadenie "${deviceDefinitions[placedType].altText}" nie je povolené v úlohe "${currentMode.toUpperCase()}" a malo by byť odstránené.`);
            return;
        }
    }

    for (const req of currentScenario.requiredDevices) {
        let minRequired = 0;
        let maxRequired = Infinity;

        if (typeof req.count === 'object' && req.count !== null) {
            minRequired = req.count.min !== undefined ? req.count.min : 0;
            maxRequired = req.count.max !== undefined ? req.count.max : Infinity;
        } else {
            minRequired = req.count;
            maxRequired = req.count;
        }

        let actualCountForRequirement = 0;
        const typesInThisRequirement = Array.isArray(req.type) ? req.type : [req.type];
        typesInThisRequirement.forEach(type => {
            actualCountForRequirement += placedDeviceCounts[type] || 0;
        });

        if (actualCountForRequirement < minRequired) {
            const deviceNames = typesInThisRequirement.map(t => `"${deviceDefinitions[t].altText}"`).join(' alebo ');
            alert(`Chyba: Pre úlohu "${currentMode.toUpperCase()}" musíte mať aspoň ${minRequired}x (${deviceNames}), ale máte len ${actualCountForRequirement}.`);
            return;
        }
        if (actualCountForRequirement > maxRequired) {
            const deviceNames = typesInThisRequirement.map(t => `"${deviceDefinitions[t].altText}"`).join(' alebo ');
            alert(`Chyba: Pre úlohu "${currentMode.toUpperCase()}" môžete mať maximálne ${maxRequired}x (${deviceNames}), ale máte ${actualCountForRequirement}.`);
            return;
        }
    }

    let usedLineIdsForFixedConnections = new Set();
    const fixedConnections = currentScenario.requiredConnections;

    for (const reqConn of fixedConnections) {
        if (Array.isArray(reqConn)) {
            const [type1, type2] = reqConn;
            const lineFound = findAndMarkLine(type1, type2, undefined, drawnLines, usedLineIdsForFixedConnections);
            if (!lineFound) {
                const type1Name = Array.isArray(type1) ? type1.map(t => deviceDefinitions[t]?.altText || t).join(' alebo ') : (deviceDefinitions[type1]?.altText || type1);
                const type2Name = Array.isArray(type2) ? type2.map(t => deviceDefinitions[t]?.altText || t).join(' alebo ') : (deviceDefinitions[type2]?.altText || type2);
                alert(`Chyba: Chýba potrebné spojenie medzi "${type1Name}" a "${type2Name}".`);
                return;
            }
        }
    }

    const endDeviceTypes = ['notebook', 'mobile-phone'];
    const terminalDevices = [];
    endDeviceTypes.forEach(type => {
        if (placedDeviceElements[type]) {
            terminalDevices.push(...placedDeviceElements[type]);
        }
    });

    if (terminalDevices.length === 0) {
        alert("Chyba: V schéme sa nenašlo žiadne koncové zariadenie (Notebook alebo Mobilný telefón).");
        return;
    }

    let routerTypesForConnectionCheck = null;
    if (currentMode === 'gpon') {
        routerTypesForConnectionCheck = 'ont-router';
    } else if (currentMode === 'vdsl') {
        routerTypesForConnectionCheck = 'hag-router';
    } else if (currentMode === 'fwa') {
        routerTypesForConnectionCheck = ['FWA-indoor', 'FWA-outdoor'];
    }

    let routerElement = null;
    if (Array.isArray(routerTypesForConnectionCheck)) {
        for (const type of routerTypesForConnectionCheck) {
            if (placedDeviceElements[type] && placedDeviceElements[type].length > 0) {
                routerElement = placedDeviceElements[type][0];
                break;
            }
        }
    } else if (routerTypesForConnectionCheck) {
        routerElement = placedDeviceElements[routerTypesForConnectionCheck] ?
                        placedDeviceElements[routerTypesForConnectionCheck][0] : null;
    }

    if (!routerElement) {
        let missingRouterName = 'požadovaný router';
        if (routerTypesForConnectionCheck) {
            if (Array.isArray(routerTypesForConnectionCheck)) {
                missingRouterName = routerTypesForConnectionCheck.map(t => deviceDefinitions[t]?.altText || t).join(' alebo ');
            } else {
                missingRouterName = deviceDefinitions[routerTypesForConnectionCheck]?.altText || routerTypesForConnectionCheck;
            }
        }
        alert(`Chyba: V schéme sa nenašiel ${missingRouterName}.`);
        return;
    }

    let allTerminalDevicesConnected = true;
    let usedLinesForTerminalConnections = new Set();
    let usedEthernetCables = new Set();
    let usedWifiIcons = new Set();

    for (const terminalDevice of terminalDevices) {
        let deviceIsConnected = false;
        let linesUsedForCurrentDevice = new Set();

        const availableEthernetCables = placedDeviceElements['ethernet-cable'] || [];
        for (const ethernetCable of availableEthernetCables) {
            if (usedEthernetCables.has(ethernetCable.id)) continue;

            let currentPathTempLines = new Set();

            const lineRouterToEthernet = findAndMarkLine(
                routerElement.getAttribute('data-type'),
                'ethernet-cable',
                'ethernet',
                drawnLines,
                currentPathTempLines,
                routerElement.id,
                ethernetCable.id
            );

            if (lineRouterToEthernet) {
                const lineEthernetToTerminal = findAndMarkLine(
                    'ethernet-cable',
                    terminalDevice.getAttribute('data-type'),
                    'ethernet',
                    drawnLines,
                    currentPathTempLines,
                    ethernetCable.id,
                    terminalDevice.id
                );

                if (lineEthernetToTerminal) {
                    currentPathTempLines.forEach(id => linesUsedForCurrentDevice.add(id));
                    usedEthernetCables.add(ethernetCable.id);
                    deviceIsConnected = true;
                    break;
                }
            }
            currentPathTempLines.clear();
        }

        if (!deviceIsConnected) {
            linesUsedForCurrentDevice.clear();
            const availableWifiIcons = placedDeviceElements['wifi-icon'] || [];
            for (const wifiIcon of availableWifiIcons) {
                if (usedWifiIcons.has(wifiIcon.id)) continue;

                let currentPathTempLines = new Set();

                const lineRouterToWifiIcon = findAndMarkLine(
                    routerElement.getAttribute('data-type'),
                    'wifi-icon',
                    'wifi',
                    drawnLines,
                    currentPathTempLines,
                    routerElement.id,
                    wifiIcon.id
                );

                if (lineRouterToWifiIcon) {
                    const lineWifiIconToTerminal = findAndMarkLine(
                        'wifi-icon',
                        terminalDevice.getAttribute('data-type'),
                        'wifi',
                        drawnLines,
                        currentPathTempLines,
                        wifiIcon.id,
                        terminalDevice.id
                    );

                    if (lineWifiIconToTerminal) {
                        currentPathTempLines.forEach(id => linesUsedForCurrentDevice.add(id));
                        usedWifiIcons.add(wifiIcon.id);
                        deviceIsConnected = true;
                        break;
                    }
                }
                currentPathTempLines.clear();
            }
        }

        if (!deviceIsConnected) {
            allTerminalDevicesConnected = false;
            const terminalDeviceName = terminalDevice ? deviceDefinitions[terminalDevice.getAttribute('data-type')].altText : "neznáme zariadenie";
            const routerName = routerElement ? deviceDefinitions[routerElement.getAttribute('data-type')].altText : "neznámy router";
            alert(`Chyba: Koncové zariadenie "${terminalDeviceName}" (ID: ${terminalDevice.id}) nie je správne pripojené k ${routerName} (cez Ethernet kábel alebo Wi-Fi).`);
            return;
        } else {
            linesUsedForCurrentDevice.forEach(id => usedLinesForTerminalConnections.add(id));
        }
    }

    let totalUsedLineIds = new Set([...usedLineIdsForFixedConnections, ...usedLinesForTerminalConnections]);
    for (const actualLine of drawnLines) {
        if (totalUsedLineIds.has(actualLine.id)) continue;

        const startDevice = document.getElementById(actualLine.startDeviceId);
        const endDevice = document.getElementById(actualLine.endDeviceId);

        if (!startDevice || !endDevice) continue;

        const actualStartType = startDevice.getAttribute('data-type');
        const actualEndType = endDevice.getAttribute('data-type');
        const actualLineType = actualLine.lineTypeKey;

        alert(`Chyba: Našli sme nepovolené spojenie. Spojili ste "${deviceDefinitions[actualStartType].altText}" a "${deviceDefinitions[actualEndType].altText}" s typom čiary "${lineTypes[actualLineType].name}".`);
        return;
    }

    alert(`Super, ${loggedInUsername || 'užívateľ'} zvládol si to na výbornú!`);
}

// ===============================================
// LOGIKA PRE RENDER PALETY ZARIADENÍ
// ===============================================
function renderDevicePalette() {
    const devicePaletteDiv = document.getElementById('device-palette');
    const paletteTitle = devicePaletteDiv.querySelector('h3');
    devicePaletteDiv.innerHTML = '';
    devicePaletteDiv.appendChild(paletteTitle);

    for (const categoryName in deviceCategories) {
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header');
        categoryHeader.innerHTML = `
            <span>${categoryName}</span>
            <span class="arrow">></span>
        `;
        devicePaletteDiv.appendChild(categoryHeader);

        const categoryContent = document.createElement('div');
        categoryContent.classList.add('category-content');
        devicePaletteDiv.appendChild(categoryContent);

        deviceCategories[categoryName].forEach(deviceType => {
            const def = deviceDefinitions[deviceType];
            if (def) {
                const paletteItem = document.createElement('div');
                paletteItem.classList.add('palette-item');
                paletteItem.setAttribute('data-type', deviceType);
                paletteItem.setAttribute('draggable', 'true');

                const img = document.createElement('img');
                img.src = def.imgSrc;
                img.alt = def.altText;
                const span = document.createElement('span');
                span.textContent = def.altText;

                paletteItem.appendChild(img);
                paletteItem.appendChild(span);
                categoryContent.appendChild(paletteItem);

                paletteItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', deviceType);
                    e.dataTransfer.effectAllowed = 'copy';
                    isCloning = true;
                });
            } else {
                console.warn(`Definícia pre zariadenie typu "${deviceType}" v kategórii "${categoryName}" nebola nájdená.`);
            }
        });

        categoryHeader.addEventListener('click', () => {
            categoryHeader.classList.toggle('expanded');
            categoryContent.classList.toggle('expanded');
            document.querySelectorAll('.category-header.expanded').forEach(header => {
                if (header !== categoryHeader) {
                    header.classList.remove('expanded');
                    header.nextElementSibling.classList.remove('expanded');
                }
            });
        });
    }
}

// ===============================================
// LOGIKA PRE KONTEXTOVÉ MENU
// ===============================================
function showContextMenu(x, y, type) {
    const contextMenu = document.getElementById('custom-context-menu');
    const deleteDeviceContextMenuItem = document.getElementById('delete-device-context');
    const deleteLineContextMenuItem = document.getElementById('delete-line-context');

    deleteDeviceContextMenuItem.style.display = 'none';
    deleteLineContextMenuItem.style.display = 'none';

    if (type === 'device') {
        deleteDeviceContextMenuItem.style.display = 'block';
    } else if (type === 'line') {
        deleteLineContextMenuItem.style.display = 'block';
    }

    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.style.display = 'block';
}

// ===============================================
// LOGIKA PRE UKÁŽKY ZAPOJENÍ A TOPOLÓGIÍ
// ===============================================

// NOVÁ FUNKCIA: Prepnúť zobrazenie menu ukážok topológií
function toggleTopologyExamplesMenu() {
    const topologyExampleMenu = document.getElementById('topology-example-menu');
    topologyExamplesMenuVisible = !topologyExamplesMenuVisible;
    topologyExampleMenu.style.display = topologyExamplesMenuVisible ? 'block' : 'none';
}

// NOVÁ FUNKCIA: Načíta preddefinovanú ukážku topológie
let loadedTopologyDeviceMap = {};

function loadTopologyExample(topologyKey) {
    const topology = topologyDefinitions[topologyKey];
    if (!topology) {
        alert('Topológia nenájdená!');
        return;
    }

    if (!confirm(`Naozaj chcete načítať ukážku topológie "${topology.name}"? Tým sa vymaže aktuálna pracovná plocha.`)) {
        return;
    }

    clearWorkspace();
    loadedTopologyDeviceMap = {};

    topology.devices.forEach(dev => {
        const newDeviceEl = createDeviceElement(dev.type, dev.x, dev.y);
        if (newDeviceEl) {
            document.getElementById('workspace').appendChild(newDeviceEl);
            loadedTopologyDeviceMap[dev.id] = newDeviceEl.id;
        }
    });

    topology.connections.forEach(conn => {
        const startDomId = loadedTopologyDeviceMap[conn.from];
        const endDomId = loadedTopologyDeviceMap[conn.to];
        if (startDomId && endDomId) {
            drawLine(startDomId, endDomId, conn.type);
        } else {
            console.error(`Chyba pri kreslení spojenia pre topológiu: Zariadenie s logickým ID ${conn.from} (mapované na ${startDomId}) alebo ${conn.to} (mapované na ${endDomId}) nebolo nájdené.`);
        }
    });

    selectMode('free');

    document.getElementById('mode-description').innerHTML =
        `<strong>Ukážka topológie: ${topology.name}</strong><br>${topology.description}`;

    document.getElementById('topology-example-menu').style.display = 'none';
    topologyExamplesMenuVisible = false;

    document.getElementById('checkSolutionBtn').style.display = 'none';
}

// Pôvodná funkcia: Prepnúť zobrazenie menu ukážok zapojení
function toggleExamplesMenu() {
    const exampleMenu = document.getElementById('example-menu');
    examplesMenuVisible = !examplesMenuVisible;
    exampleMenu.style.display = examplesMenuVisible ? 'block' : 'none';
}

// Pôvodná funkcia: Načíta preddefinovanú ukážku zapojenia
let loadedExampleDeviceMap = {};

function loadExample(exampleKey) {
    const example = exampleDefinitions[exampleKey];
    if (!example) {
        alert('Ukážka nenájdená!');
        return;
    }

    if (!confirm(`Naozaj chcete načítať ukážku "${example.name}"? Tým sa vymaže aktuálna pracovná plocha.`)) {
        return;
    }

    clearWorkspace();
    loadedExampleDeviceMap = {};

    example.devices.forEach(dev => {
        const newDeviceEl = createDeviceElement(dev.type, dev.x, dev.y);
        if (newDeviceEl) {
            document.getElementById('workspace').appendChild(newDeviceEl);
            loadedExampleDeviceMap[dev.id] = newDeviceEl.id;
        }
    });

    example.connections.forEach(conn => {
        const startDomId = loadedExampleDeviceMap[conn.from];
        const endDomId = loadedExampleDeviceMap[conn.to];
        if (startDomId && endDomId) {
            drawLine(startDomId, endDomId, conn.type);
        } else {
            console.error(`Chyba pri kreslení spojenia pre ukážku: Zariadenie s logickým ID ${conn.from} (mapované na ${startDomId}) alebo ${conn.to} (mapované na ${endDomId}) nebolo nájdené.`);
        }
    });

    selectMode('free');

    document.getElementById('mode-description').innerHTML =
        `<strong>Ukážka: ${example.name}</strong><br>${example.description}`;

    document.getElementById('example-menu').style.display = 'none';
    examplesMenuVisible = false;

    document.getElementById('checkSolutionBtn').style.display = 'none';
}


// ===============================================
// INICIALIZÁCIA A GLOBLÁLNE UDALOSTI
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    renderDevicePalette();

    const workspace = document.getElementById('workspace');
    const contextMenu = document.getElementById('custom-context-menu');
    const deleteDeviceContextMenuItem = document.getElementById('delete-device-context');
    const deleteLineContextMenuItem = document.getElementById('delete-line-context');
    const lineTypeSelectionModal = document.getElementById('line-type-selection-modal');
    const deviceDescriptionModal = document.getElementById('device-description-modal');

    workspace.addEventListener('contextmenu', (e) => {
        rightClickedDeviceId = null;
        selectedLineId = null;

        const targetDevice = e.target.closest('.device');
        if (targetDevice) {
            e.preventDefault();
            rightClickedDeviceId = targetDevice.id;
            showContextMenu(e.clientX, e.clientY, 'device');
        } else if (e.target.tagName === 'line') {
            e.preventDefault();
            selectedLineId = e.target.id;
            showContextMenu(e.clientX, e.clientY, 'line');
        } else {
            contextMenu.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
            rightClickedDeviceId = null;
            selectedLineId = null;
        }
    });

    deleteDeviceContextMenuItem.onclick = function() {
        if (rightClickedDeviceId) {
            const deviceToDelete = document.getElementById(rightClickedDeviceId);
            if (deviceToDelete) {
                deviceToDelete.remove();
                drawnLines = drawnLines.filter(line => {
                    if (line.startDeviceId === rightClickedDeviceId || line.endDeviceId === rightClickedDeviceId) {
                        line.element.remove();
                        return false;
                    }
                    return true;
                });
                updateLines();
                rightClickedDeviceId = null;
            }
        }
        contextMenu.style.display = 'none';
    };

    deleteLineContextMenuItem.onclick = function() {
        if (selectedLineId) {
            deleteLine(selectedLineId);
            selectedLineId = null;
        }
        contextMenu.style.display = 'none';
    };

    document.querySelectorAll('.line-type-btn').forEach(button => {
        button.addEventListener('mousedown', (e) => e.stopPropagation());
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            selectLineType(type);
        });
    });

    lineTypeSelectionModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            cancelLineTypeSelection();
        }
    });

    lineTypeSelectionModal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());
    deviceDescriptionModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideDeviceDescriptionModal();
        }
    });
    deviceDescriptionModal.querySelector('.device-desc-modal-content').addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (deviceDescriptionModal.style.display === 'flex') {
                hideDeviceDescriptionModal();
            }
            if (document.getElementById('line-type-selection-modal').style.display === 'flex') {
                cancelLineTypeSelection();
            }
            document.getElementById('custom-context-menu').style.display = 'none';
        }
    });

    // Skryje pôvodné menu ukážok zapojení pri kliknutí mimo neho
    document.addEventListener('click', function(event) {
        const exampleDropdown = document.getElementById('example-menu').closest('.dropdown');
        if (exampleDropdown && examplesMenuVisible && !exampleDropdown.contains(event.target)) {
            document.getElementById('example-menu').style.display = 'none';
            examplesMenuVisible = false;
        }
    });
    document.getElementById('example-menu').style.display = 'none';

    // Skryje nové menu ukážok topológií pri kliknutí mimo neho
    document.addEventListener('click', function(event) {
        const topologyDropdown = document.getElementById('topology-example-menu').closest('.dropdown');
        if (topologyDropdown && topologyExamplesMenuVisible && !topologyDropdown.contains(event.target)) {
            document.getElementById('topology-example-menu').style.display = 'none';
            topologyExamplesMenuVisible = false;
        }
    });
    document.getElementById('topology-example-menu').style.display = 'none';
});
