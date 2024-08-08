const airports: Airport[]  = [
    { code: 'ATL', city: 'Atlanta, GA' },
    { code: 'LAX', city: 'Los Angeles, CA' },
    { code: 'ORD', city: 'Chicago, IL' },
    { code: 'DFW', city: 'Dallas, TX' },
    { code: 'DEN', city: 'Denver, CO' },
    { code: 'IND', city: 'Indianapolis, IN'},
    { code: 'DTW', city: 'Detroit, MI'},
    { code: 'JFK', city: 'New York City, NY'},
    { code: 'LAS', city: 'Las Vegas, NV'},
    { code: 'MCO', city: 'Orlando, FL'},
    { code: 'MIA', city: 'Miami, Fl'},
    { code: 'CLT', city: 'Charlotte, NC'},
    { code: 'SEA', city: 'Seattle, WA'},
    { code: 'PHX', city: 'Phoenix, AZ'},
    { code: 'EWR', city: 'Newark, NJ'},
    { code: 'SFO', city: 'San Francisco, CA'},
    { code: 'IAH', city: 'Houston, TX'},
    { code: 'BOS', city: 'Boston, MA'},
    { code: 'FLL', city: 'Fort Lauderdale, FL'},
    { code: 'MSP', city: 'Minneapolis, MN'},
    { code: 'LGA', city: 'New York City, NY'},
    { code: 'PHL', city: 'Philadelphia, PA'},
    { code: 'SLC', city: 'Salt Lake City, UT'},
    { code: 'DCA', city: 'Washington DC, VA'},
    { code: 'SAN', city: 'San Diego, CA'},
    { code: 'BWI', city: 'Baltimore, MD'},
    { code: 'TPA', city: 'Tampa, FL'},
    { code: 'AUS', city: 'Austin, TX'},
    { code: 'IAD', city: 'Washington DC, VA'},
    { code: 'BNA', city: 'Nashville, TN'},
    { code: 'MDW', city: 'Chicago, IL'},
    { code: 'HNL', city: 'Honolulu, HI'},
    { code: 'DAL', city: 'Dallas, TX'},
    { code: 'PDX', city: 'Portland, OR'},
    { code: 'STL', city: 'St Louis, MO'},
    { code: 'HOU', city: 'Houston, TX'},
    { code: 'SMF', city: 'Sacramento, CA'},
    { code: 'MSY', city: 'New Orleans, LA'},
    { code: 'RDU', city: 'Raleigh, NC'},
    { code: 'MLI', city: 'Moline, IL'},
    { code: 'SJC', city: 'San Jose, CA'},
    { code: 'SNA', city: 'Santa Ana, CA'},
    { code: 'OAK', city: 'Oakland, CA'},
    { code: 'RSW', city: 'Fort Myers, FL'},
    { code: 'SJU', city: 'San Juan, CA'},
    { code: 'MCI', city: 'Kansas City, MO'},
    { code: 'SAT', city: 'San Antonio, TX'},
    { code: 'CLE', city: 'Cleveland, OH'},
    { code: 'OGG', city: 'Maui, HI'},
    { code: 'PIT', city: 'Pittsburgh, PA'},
    { code: 'CVG', city: 'Cincinnati, OH'},
    { code: 'CMH', city: 'Columbus, OH'},
    { code: 'PBI', city: 'West Palm Beach, FL'},
    { code: 'JAX', city: 'Jacksonville, FL'},
    { code: 'BUR', city: 'Burbank, CA'},
    { code: 'BDL', city: 'Hartford, CT'},
    { code: 'ONT', city: 'Ontario, CA'},
    { code: 'MKE', city: 'Milwaukee, WI'},
    { code: 'CHS', city: 'Charleston, SC'},
    { code: 'ANC', city: 'Anchorage, AK'},
    { code: 'ABQ', city: 'Albuquerque, NW'},
    { code: 'BOI', city: 'Boise, ID'},
    { code: 'OMA', city: 'Omaha, NE'},
    { code: 'MEM', city: 'Memphis'},
    { code: 'RIC', city: 'Richmond, VA'},
    { code: 'RNO', city: 'Reno, NV'},
    { code: 'BUF', city: 'Buffalo, NY'},
    { code: 'MHT', city: 'Manchester, NH'},
    { code: 'ORF', city: 'Norfolk, VA'},
    { code: 'SDF', city: 'Louisville, KY'},
    { code: 'TUS', city: 'Tuscon, AZ'},
    { code: 'CHA', city: 'Chattanooga, TN'},
    { code: 'SAV', city: 'Savannah, GA'},
    { code: 'MYR', city: 'Myrtle Beach, SC'},
    { code: 'GSP', city: 'Greenville, SC'},
    { code: 'TYS', city: 'Knoxville, TN'},
    { code: 'SRQ', city: 'Sarasota, FL'},
    { code: 'GEG', city: 'Spokane, WA'},
    { code: 'KSHV', city: 'Shreveport, LA'},
    { code: 'HSV', city: 'Huntsville, AL'}
].sort((a, b) => a.city.localeCompare(b.city));

export default airports;