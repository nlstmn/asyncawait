// European countries (we ship within Europe): flag emoji, dialing code, and a
// broad list of cities for the city dropdown. Used by the checkout form.
// Lists are curated (major + mid-size cities), not an exhaustive census.
export const COUNTRIES = [
  { name: 'Albania', flag: '🇦🇱', dial: '+355', cities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Korçë', 'Berat', 'Lushnjë', 'Gjirokastër'] },
  { name: 'Andorra', flag: '🇦🇩', dial: '+376', cities: ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo'] },
  { name: 'Austria', flag: '🇦🇹', dial: '+43', cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Wiener Neustadt', 'Bregenz'] },
  { name: 'Belarus', flag: '🇧🇾', dial: '+375', cities: ['Minsk', 'Gomel', 'Mogilev', 'Vitebsk', 'Brest', 'Grodno', 'Babruysk', 'Baranavichy', 'Barysaw', 'Pinsk'] },
  { name: 'Belgium', flag: '🇧🇪', dial: '+32', cities: ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Liège', 'Charleroi', 'Namur', 'Leuven', 'Mons', 'Mechelen', 'Ostend', 'Kortrijk'] },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦', dial: '+387', cities: ['Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar', 'Zenica', 'Bijeljina', 'Brčko', 'Prijedor', 'Trebinje', 'Doboj'] },
  { name: 'Bulgaria', flag: '🇧🇬', dial: '+359', cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen', 'Pernik', 'Blagoevgrad'] },
  { name: 'Croatia', flag: '🇭🇷', dial: '+385', cities: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Slavonski Brod', 'Karlovac', 'Varaždin', 'Dubrovnik', 'Šibenik'] },
  { name: 'Cyprus', flag: '🇨🇾', dial: '+357', cities: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Paralimni'] },
  { name: 'Czechia', flag: '🇨🇿', dial: '+420', cities: ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Ústí nad Labem', 'Hradec Králové', 'České Budějovice', 'Pardubice', 'Zlín', 'Kladno'] },
  { name: 'Denmark', flag: '🇩🇰', dial: '+45', cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning'] },
  { name: 'Estonia', flag: '🇪🇪', dial: '+372', cities: ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu'] },
  { name: 'Finland', flag: '🇫🇮', dial: '+358', cities: ['Helsinki', 'Espoo', 'Tampere', 'Turku', 'Oulu', 'Vantaa', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori', 'Lappeenranta', 'Rovaniemi'] },
  { name: 'France', flag: '🇫🇷', dial: '+33', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Nantes', 'Lille', 'Strasbourg', 'Montpellier', 'Rennes', 'Grenoble', 'Toulon', 'Reims'] },
  { name: 'Germany', flag: '🇩🇪', dial: '+49', cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg'] },
  { name: 'Greece', flag: '🇬🇷', dial: '+30', cities: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Ioannina', 'Chania', 'Rhodes', 'Kavala', 'Kalamata'] },
  { name: 'Hungary', flag: '🇭🇺', dial: '+36', cities: ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'] },
  { name: 'Iceland', flag: '🇮🇸', dial: '+354', cities: ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Akureyri', 'Reykjanesbær', 'Garðabær', 'Selfoss', 'Akranes'] },
  { name: 'Ireland', flag: '🇮🇪', dial: '+353', cities: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Kilkenny'] },
  { name: 'Italy', flag: '🇮🇹', dial: '+39', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Bologna', 'Genoa', 'Palermo', 'Venice', 'Verona', 'Bari', 'Catania', 'Padua'] },
  { name: 'Latvia', flag: '🇱🇻', dial: '+371', cities: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera'] },
  { name: 'Liechtenstein', flag: '🇱🇮', dial: '+423', cities: ['Vaduz', 'Schaan', 'Triesen', 'Balzers', 'Eschen', 'Mauren', 'Triesenberg'] },
  { name: 'Lithuania', flag: '🇱🇹', dial: '+370', cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai'] },
  { name: 'Luxembourg', flag: '🇱🇺', dial: '+352', cities: ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck', 'Diekirch', 'Wiltz'] },
  { name: 'Malta', flag: '🇲🇹', dial: '+356', cities: ['Valletta', 'Birkirkara', 'Sliema', 'Mosta', 'Qormi', 'Żabbar', 'San Ġwann', 'Rabat'] },
  { name: 'Moldova', flag: '🇲🇩', dial: '+373', cities: ['Chișinău', 'Tiraspol', 'Bălți', 'Bender', 'Rîbnița', 'Cahul', 'Ungheni', 'Soroca'] },
  { name: 'Monaco', flag: '🇲🇨', dial: '+377', cities: ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille', 'Larvotto', 'Moneghetti'] },
  { name: 'Montenegro', flag: '🇲🇪', dial: '+382', cities: ['Podgorica', 'Nikšić', 'Herceg Novi', 'Bar', 'Budva', 'Bijelo Polje', 'Kotor', 'Ulcinj'] },
  { name: 'Netherlands', flag: '🇳🇱', dial: '+31', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Haarlem', 'Arnhem'] },
  { name: 'North Macedonia', flag: '🇲🇰', dial: '+389', cities: ['Skopje', 'Bitola', 'Kumanovo', 'Ohrid', 'Prilep', 'Tetovo', 'Veles', 'Štip', 'Gostivar'] },
  { name: 'Norway', flag: '🇳🇴', dial: '+47', cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø', 'Drammen', 'Fredrikstad', 'Kristiansand', 'Sandnes', 'Ålesund', 'Bodø'] },
  { name: 'Poland', flag: '🇵🇱', dial: '+48', cities: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok', 'Gdynia'] },
  { name: 'Portugal', flag: '🇵🇹', dial: '+351', cities: ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Funchal', 'Aveiro', 'Setúbal', 'Guimarães', 'Évora', 'Cascais'] },
  { name: 'Romania', flag: '🇷🇴', dial: '+40', cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 'Constanța', 'Craiova', 'Galați', 'Oradea', 'Sibiu', 'Ploiești', 'Arad'] },
  { name: 'San Marino', flag: '🇸🇲', dial: '+378', cities: ['San Marino', 'Serravalle', 'Borgo Maggiore', 'Domagnano', 'Fiorentino', 'Acquaviva', 'Chiesanuova'] },
  { name: 'Serbia', flag: '🇷🇸', dial: '+381', cities: ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo', 'Čačak', 'Kraljevo', 'Leskovac'] },
  { name: 'Slovakia', flag: '🇸🇰', dial: '+421', cities: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Banská Bystrica', 'Trnava', 'Trenčín', 'Martin', 'Poprad'] },
  { name: 'Slovenia', flag: '🇸🇮', dial: '+386', cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Velenje', 'Novo Mesto', 'Ptuj', 'Nova Gorica'] },
  { name: 'Spain', flag: '🇪🇸', dial: '+34', cities: ['Barcelona', 'Madrid', 'Valencia', 'Seville', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia', 'Palma', 'Las Palmas', 'Granada', 'Alicante', 'Córdoba', 'Valladolid'] },
  { name: 'Sweden', flag: '🇸🇪', dial: '+46', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Lund', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Norrköping', 'Umeå', 'Gävle'] },
  { name: 'Switzerland', flag: '🇨🇭', dial: '+41', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun'] },
  { name: 'Ukraine', flag: '🇺🇦', dial: '+380', cities: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Zaporizhzhia', 'Kryvyi Rih', 'Mykolaiv', 'Vinnytsia', 'Poltava', 'Chernihiv', 'Cherkasy'] },
  { name: 'United Kingdom', flag: '🇬🇧', dial: '+44', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol', 'Leeds', 'Liverpool', 'Sheffield', 'Newcastle', 'Cardiff', 'Belfast', 'Nottingham', 'Brighton'] },
  { name: 'Vatican City', flag: '🇻🇦', dial: '+379', cities: ['Vatican City'] },
]

// dialing codes for the phone prefix dropdown (unique, sorted numerically)
export const DIAL_CODES = COUNTRIES
  .map(c => ({ name: c.name, flag: c.flag, dial: c.dial }))
  .sort((a, b) => a.name.localeCompare(b.name))
