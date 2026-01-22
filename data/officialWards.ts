
export const OFFICIAL_WARD_MAPPING: Record<string, string> = {
  "1": "Narela", "2": "Bankner", "3": "Holambi Kalan", "4": "Alipur", "5": "Bakhtawarpur",
  "6": "Burari", "7": "Kadipur", "8": "Mukundpur", "9": "Sant Nagar", "10": "Jharoda",
  "11": "Timarpur", "12": "Malka Ganj", "13": "Mukherjee Nagar", "14": "Dheerpur", "15": "Adarsh Nagar",
  "16": "Azadpur", "17": "Bhalswa", "18": "Jahangir Puri", "19": "Sarup Nagar", "20": "Samaypur Badli",
  "21": "Rohini-A", "22": "Rohini-B", "23": "Rithala", "24": "Rohini-C", "25": "Rohini-D",
  "26": "Pooth Kalan", "27": "Begampur", "28": "Keshav Puram", "29": "Shakurpur", "30": "Saraswati Vihar",
  "31": "Shalimar Bagh", "32": "Pitam Pura", "33": "Kohat Enclave", "34": "Rani Bagh", "35": "Mundka",
  "36": "Nilothi", "37": "Sultanpuri East", "38": "Sultanpuri West", "39": "Kirari Suleman Nagar", "40": "Prem Nagar",
  "41": "Mubarakpur", "42": "Nangloi East", "43": "Nangloi West", "44": "Quammruddin Nagar", "45": "Nihal Vihar",
  "46": "Jawalapuri", "47": "Mangolpuri-A", "48": "Mangolpuri-B", "49": "Mangolpuri-C", "50": "Mangolpuri-D",
  "51": "Rohini F", "52": "Naharpur", "53": "Ratan Vihar", "54": "Pitam Pura North", "55": "Pitam Pura South",
  "56": "Shalimar Bagh-B", "57": "Shalimar Bagh-A", "58": "Haiderpur", "59": "Saraswati Vihar", "60": "Paschim Vihar",
  "61": "Shakur Basti", "62": "Punjabi Bagh", "63": "Karampura", "64": "Moti Nagar", "65": "Ashok Vihar",
  "131": "Anand Vihar", "132": "Vishwas Nagar", "133": "Krishna Nagar", "134": "Anarkali", "135": "Jagat Puri",
  "238": "Karawal Nagar West", "239": "Khajoori Khas", "240": "Sri Ram Colony"
  // ... The remaining mapping is dynamically handled by ID for wards not explicitly mapped here
};

export const getWardName = (no: string | number) => {
  return OFFICIAL_WARD_MAPPING[String(no)] || `Ward ${no}`;
};
