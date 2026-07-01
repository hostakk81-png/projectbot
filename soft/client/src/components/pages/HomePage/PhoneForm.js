import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import {phone} from 'phone';
import Select, { components} from 'react-select';
import {sockets} from './HomePage';

const pack_phone = phone;

const data = [
    {
      "iso2": "AD",
      "name": "Andorra",
      "codes": [
        {
          "code": "376",
          "patterns": [
            "XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Андорра"
    },
    {
      "iso2": "AE",
      "name": "United Arab Emirates",
      "codes": [
        {
          "code": "971",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "ОАЭ"
    },
    {
      "iso2": "AF",
      "name": "Afghanistan",
      "codes": [
        {
          "code": "93",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Афганистан"
    },
    {
      "iso2": "AI",
      "name": "Anguilla",
      "codes": [
        {
          "code": "1264",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ангилья"
    },
    {
      "iso2": "AL",
      "name": "Albania",
      "codes": [
        {
          "code": "355",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Албания"
    },
    {
      "iso2": "AM",
      "name": "Armenia",
      "codes": [
        {
          "code": "374",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Армения"
    },
    {
      "iso2": "AO",
      "name": "Angola",
      "codes": [
        {
          "code": "244",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ангола"
    },
    {
      "iso2": "AS",
      "name": "American Samoa",
      "codes": [
        {
          "code": "1684",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Американское Самоа"
    },
    {
      "iso2": "AT",
      "name": "Austria",
      "codes": [
        {
          "code": "43",
          "patterns": [
            "XXX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Австрия"
    },
    {
      "iso2": "AU",
      "name": "Australia",
      "codes": [
        {
          "code": "61",
          "patterns": [
            "X XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Австралия"
    },
    {
      "iso2": "AW",
      "name": "Aruba",
      "codes": [
        {
          "code": "297",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Аруба"
    },
    {
      "iso2": "AZ",
      "name": "Azerbaijan",
      "codes": [
        {
          "code": "994",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Азербайджан"
    },
    {
      "iso2": "BA",
      "name": "Bosnia &amp; Herzegovina",
      "codes": [
        {
          "code": "387",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Босния и Герцеговина"
    },
    {
      "iso2": "BB",
      "name": "Barbados",
      "codes": [
        {
          "code": "1246",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Барбадос"
    },
    {
      "iso2": "BD",
      "name": "Bangladesh",
      "codes": [
        {
          "code": "880",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бангладеш"
    },
    {
      "iso2": "BE",
      "name": "Belgium",
      "codes": [
        {
          "code": "32",
          "patterns": [
            "XXX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бельгия"
    },
    {
      "iso2": "BF",
      "name": "Burkina Faso",
      "codes": [
        {
          "code": "226",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Буркина-Фасо"
    },
    {
      "iso2": "BH",
      "name": "Bahrain",
      "codes": [
        {
          "code": "973",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бахрейн"
    },
    {
      "iso2": "BI",
      "name": "Burundi",
      "codes": [
        {
          "code": "257",
          "patterns": [
            "XX XX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бурунди"
    },
    {
      "iso2": "BJ",
      "name": "Benin",
      "codes": [
        {
          "code": "229",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бенин"
    },
    {
      "iso2": "BM",
      "name": "Bermuda",
      "codes": [
        {
          "code": "1441",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бермудские Острова"
    },
    {
      "iso2": "BN",
      "name": "Brunei Darussalam",
      "codes": [
        {
          "code": "673",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бруней"
    },
    {
      "iso2": "BO",
      "name": "Bolivia",
      "codes": [
        {
          "code": "591",
          "patterns": [
            "X XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Боливия"
    },
    {
      "iso2": "BR",
      "name": "Brazil",
      "codes": [
        {
          "code": "55",
          "patterns": [
            "XX XXXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бразилия"
    },
    {
      "iso2": "BS",
      "name": "Bahamas",
      "codes": [
        {
          "code": "1242",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Багамы"
    },
    {
      "iso2": "BT",
      "name": "Bhutan",
      "codes": [
        {
          "code": "975",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Бутан"
    },
    {
      "iso2": "BW",
      "name": "Botswana",
      "codes": [
        {
          "code": "267",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ботсвана"
    },
    {
      "iso2": "BY",
      "name": "Belarus",
      "codes": [
        {
          "code": "375",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Беларусь"
    },
    {
      "iso2": "CA",
      "name": "Canada",
      "codes": [
        {
          "code": "1",
          "prefixes": [
            "403",
            "587",
            "780",
            "825",
            "236",
            "250",
            "604",
            "672",
            "778",
            "204",
            "431",
            "506",
            "709",
            "902",
            "782",
            "226",
            "249",
            "289",
            "343",
            "365",
            "416",
            "437",
            "519",
            "548",
            "613",
            "647",
            "705",
            "807",
            "905",
            "418",
            "438",
            "450",
            "514",
            "579",
            "581",
            "819",
            "873",
            "306",
            "639",
            "867"
          ],
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "prefixes": [],
      "patterns": [],
      "lname": "Канада"
    },
    {
      "iso2": "CD",
      "name": "Congo (Dem. Rep.)",
      "codes": [
        {
          "code": "243",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Конго (ДРК)"
    },
    {
      "iso2": "CF",
      "name": "Central African Rep.",
      "codes": [
        {
          "code": "236",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "ЦАР"
    },
    {
      "iso2": "CG",
      "name": "Congo (Rep.)",
      "codes": [
        {
          "code": "242",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Конго (Республика)"
    },
    {
      "iso2": "CH",
      "name": "Switzerland",
      "codes": [
        {
          "code": "41",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Швейцария"
    },
    {
      "iso2": "CI",
      "name": "Côte d&#39;Ivoire",
      "codes": [
        {
          "code": "225",
          "patterns": [
            "XX XX XX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кот-д&#39;Ивуар"
    },
    {
      "iso2": "CL",
      "name": "Chile",
      "codes": [
        {
          "code": "56",
          "patterns": [
            "X XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Чили"
    },
    {
      "iso2": "CM",
      "name": "Cameroon",
      "codes": [
        {
          "code": "237",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Камерун"
    },
    {
      "iso2": "CN",
      "name": "China",
      "codes": [
        {
          "code": "86",
          "patterns": [
            "XXX XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Китай"
    },
    {
      "iso2": "CO",
      "name": "Colombia",
      "codes": [
        {
          "code": "57",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Колумбия"
    },
    {
      "iso2": "CR",
      "name": "Costa Rica",
      "codes": [
        {
          "code": "506",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Коста-Рика"
    },
    {
      "iso2": "CU",
      "name": "Cuba",
      "codes": [
        {
          "code": "53",
          "patterns": [
            "X XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Куба"
    },
    {
      "iso2": "CV",
      "name": "Cape Verde",
      "codes": [
        {
          "code": "238",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кабо-Верде"
    },
    {
      "iso2": "CY",
      "name": "Cyprus",
      "codes": [
        {
          "code": "357",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кипр"
    },
    {
      "iso2": "CZ",
      "name": "Czech Republic",
      "codes": [
        {
          "code": "420",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Чехия"
    },
    {
      "iso2": "DJ",
      "name": "Djibouti",
      "codes": [
        {
          "code": "253",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Джибути"
    },
    {
      "iso2": "DK",
      "name": "Denmark",
      "codes": [
        {
          "code": "45",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Дания"
    },
    {
      "iso2": "DM",
      "name": "Dominica",
      "codes": [
        {
          "code": "1767",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Доминика"
    },
    {
      "iso2": "DO",
      "name": "Dominican Rep.",
      "codes": [
        {
          "code": "1809",
          "patterns": [
            "XXX XXXX"
          ]
        },
        {
          "code": "1829",
          "patterns": [
            "XXX XXXX"
          ]
        },
        {
          "code": "1849",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Доминиканская Республика"
    },
    {
      "iso2": "DZ",
      "name": "Algeria",
      "codes": [
        {
          "code": "213",
          "patterns": [
            "XXX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Алжир"
    },
    {
      "iso2": "EC",
      "name": "Ecuador",
      "codes": [
        {
          "code": "593",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Эквадор"
    },
    {
      "iso2": "EE",
      "name": "Estonia",
      "codes": [
        {
          "code": "372",
          "patterns": [
            "XXXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Эстония"
    },
    {
      "iso2": "EG",
      "name": "Egypt",
      "codes": [
        {
          "code": "20",
          "patterns": [
            "XX XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Египет"
    },
    {
      "iso2": "ER",
      "name": "Eritrea",
      "codes": [
        {
          "code": "291",
          "patterns": [
            "X XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Эритрея"
    },
    {
      "iso2": "ES",
      "name": "Spain",
      "codes": [
        {
          "code": "34",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Испания"
    },
    {
      "iso2": "ET",
      "name": "Ethiopia",
      "codes": [
        {
          "code": "251",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Эфиопия"
    },
    {
      "iso2": "FJ",
      "name": "Fiji",
      "codes": [
        {
          "code": "679",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Фиджи"
    },
    {
      "iso2": "FO",
      "name": "Faroe Islands",
      "codes": [
        {
          "code": "298",
          "patterns": [
            "XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Фарерские острова"
    },
    {
      "iso2": "FR",
      "name": "France",
      "codes": [
        {
          "code": "33",
          "patterns": [
            "X XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Франция"
    },
    {
      "iso2": "GA",
      "name": "Gabon",
      "codes": [
        {
          "code": "241",
          "patterns": [
            "X XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Габон"
    },
    {
      "iso2": "GB",
      "name": "United Kingdom",
      "codes": [
        {
          "code": "44",
          "patterns": [
            "XXXX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Великобритания"
    },
    {
      "iso2": "GD",
      "name": "Grenada",
      "codes": [
        {
          "code": "1473",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гренада"
    },
    {
      "iso2": "GE",
      "name": "Georgia",
      "codes": [
        {
          "code": "995",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Грузия"
    },
    {
      "iso2": "GH",
      "name": "Ghana",
      "codes": [
        {
          "code": "233",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гана"
    },
    {
      "iso2": "GI",
      "name": "Gibraltar",
      "codes": [
        {
          "code": "350",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гибралтар"
    },
    {
      "iso2": "GL",
      "name": "Greenland",
      "codes": [
        {
          "code": "299",
          "patterns": [
            "XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гренландия"
    },
    {
      "iso2": "GM",
      "name": "Gambia",
      "codes": [
        {
          "code": "220",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гамбия"
    },
    {
      "iso2": "GN",
      "name": "Guinea",
      "codes": [
        {
          "code": "224",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гвинея"
    },
    {
      "iso2": "GP",
      "name": "Guadeloupe",
      "codes": [
        {
          "code": "590",
          "patterns": [
            "XXX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гваделупа"
    },
    {
      "iso2": "GQ",
      "name": "Equatorial Guinea",
      "codes": [
        {
          "code": "240",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Экваториальная Гвинея"
    },
    {
      "iso2": "GR",
      "name": "Greece",
      "codes": [
        {
          "code": "30",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Греция"
    },
    {
      "iso2": "GT",
      "name": "Guatemala",
      "codes": [
        {
          "code": "502",
          "patterns": [
            "X XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гватемала"
    },
    {
      "iso2": "GU",
      "name": "Guam",
      "codes": [
        {
          "code": "1671",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гуам"
    },
    {
      "iso2": "GW",
      "name": "Guinea-Bissau",
      "codes": [
        {
          "code": "245",
          "patterns": [
            "XXX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гвинея-Бисау"
    },
    {
      "iso2": "GY",
      "name": "Guyana",
      "codes": [
        {
          "code": "592",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гайана"
    },
    {
      "iso2": "HK",
      "name": "Hong Kong",
      "codes": [
        {
          "code": "852",
          "patterns": [
            "X XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гонконг"
    },
    {
      "iso2": "HN",
      "name": "Honduras",
      "codes": [
        {
          "code": "504",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гондурас"
    },
    {
      "iso2": "HR",
      "name": "Croatia",
      "codes": [
        {
          "code": "385",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Хорватия"
    },
    {
      "iso2": "HT",
      "name": "Haiti",
      "codes": [
        {
          "code": "509",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Гаити"
    },
    {
      "iso2": "HU",
      "name": "Hungary",
      "codes": [
        {
          "code": "36",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Венгрия"
    },
    {
      "iso2": "ID",
      "name": "Indonesia",
      "codes": [
        {
          "code": "62",
          "patterns": [
            "XXX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Индонезия"
    },
    {
      "iso2": "IE",
      "name": "Ireland",
      "codes": [
        {
          "code": "353",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ирландия"
    },
    {
      "iso2": "IL",
      "name": "Israel",
      "codes": [
        {
          "code": "972",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Израиль"
    },
    {
      "iso2": "IN",
      "name": "India",
      "codes": [
        {
          "code": "91",
          "patterns": [
            "XXXXX XXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Индия"
    },
    {
      "iso2": "IO",
      "name": "Diego Garcia",
      "codes": [
        {
          "code": "246",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Диего-Гарсия"
    },
    {
      "iso2": "IQ",
      "name": "Iraq",
      "codes": [
        {
          "code": "964",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ирак"
    },
    {
      "iso2": "IR",
      "name": "Iran",
      "codes": [
        {
          "code": "98",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Иран"
    },
    {
      "iso2": "IS",
      "name": "Iceland",
      "codes": [
        {
          "code": "354",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Исландия"
    },
    {
      "iso2": "IT",
      "name": "Italy",
      "codes": [
        {
          "code": "39",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Италия"
    },
    {
      "iso2": "JM",
      "name": "Jamaica",
      "codes": [
        {
          "code": "1876",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ямайка"
    },
    {
      "iso2": "JO",
      "name": "Jordan",
      "codes": [
        {
          "code": "962",
          "patterns": [
            "X XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Иордания"
    },
    {
      "iso2": "JP",
      "name": "Japan",
      "codes": [
        {
          "code": "81",
          "patterns": [
            "XX XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Япония"
    },
    {
      "iso2": "KE",
      "name": "Kenya",
      "codes": [
        {
          "code": "254",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кения"
    },
    {
      "iso2": "KG",
      "name": "Kyrgyzstan",
      "codes": [
        {
          "code": "996",
          "patterns": [
            "XXX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Киргизия"
    },
    {
      "iso2": "KH",
      "name": "Cambodia",
      "codes": [
        {
          "code": "855",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Камбоджа"
    },
    {
      "iso2": "KI",
      "name": "Kiribati",
      "codes": [
        {
          "code": "686",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кирибати"
    },
    {
      "iso2": "KM",
      "name": "Comoros",
      "codes": [
        {
          "code": "269",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Коморы"
    },
    {
      "iso2": "KN",
      "name": "Saint Kitts &amp; Nevis",
      "codes": [
        {
          "code": "1869",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сент-Китс и Невис"
    },
    {
      "iso2": "KR",
      "name": "South Korea",
      "codes": [
        {
          "code": "82",
          "patterns": [
            "XX XXXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Южная Корея"
    },
    {
      "iso2": "KW",
      "name": "Kuwait",
      "codes": [
        {
          "code": "965",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Кувейт"
    },
    {
      "iso2": "KY",
      "name": "Cayman Islands",
      "codes": [
        {
          "code": "1345",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Каймановы острова"
    },
    {
      "iso2": "LA",
      "name": "Laos",
      "codes": [
        {
          "code": "856",
          "patterns": [
            "XX XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Лаос"
    },
    {
      "iso2": "LC",
      "name": "Saint Lucia",
      "codes": [
        {
          "code": "1758",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сент-Люсия"
    },
    {
      "iso2": "LI",
      "name": "Liechtenstein",
      "codes": [
        {
          "code": "423",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Лихтенштейн"
    },
    {
      "iso2": "LK",
      "name": "Sri Lanka",
      "codes": [
        {
          "code": "94",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Шри-Ланка"
    },
    {
      "iso2": "LR",
      "name": "Liberia",
      "codes": [
        {
          "code": "231",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Либерия"
    },
    {
      "iso2": "LS",
      "name": "Lesotho",
      "codes": [
        {
          "code": "266",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Лесото"
    },
    {
      "iso2": "LT",
      "name": "Lithuania",
      "codes": [
        {
          "code": "370",
          "patterns": [
            "XXX XXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Литва"
    },
    {
      "iso2": "LU",
      "name": "Luxembourg",
      "codes": [
        {
          "code": "352",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Люксембург"
    },
    {
      "iso2": "LV",
      "name": "Latvia",
      "codes": [
        {
          "code": "371",
          "patterns": [
            "XXX XXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Латвия"
    },
    {
      "iso2": "LY",
      "name": "Libya",
      "codes": [
        {
          "code": "218",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Ливия"
    },
    {
      "iso2": "MA",
      "name": "Morocco",
      "codes": [
        {
          "code": "212",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Марокко"
    },
    {
      "iso2": "MC",
      "name": "Monaco",
      "codes": [
        {
          "code": "377",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Монако"
    },
    {
      "iso2": "MD",
      "name": "Moldova",
      "codes": [
        {
          "code": "373",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Молдавия"
    },
    {
      "iso2": "MG",
      "name": "Madagascar",
      "codes": [
        {
          "code": "261",
          "patterns": [
            "XX XX XXX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мадагаскар"
    },
    {
      "iso2": "MK",
      "name": "North Macedonia",
      "codes": [
        {
          "code": "389",
          "patterns": [
            "XX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Северная Македония"
    },
    {
      "iso2": "ML",
      "name": "Mali",
      "codes": [
        {
          "code": "223",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мали"
    },
    {
      "iso2": "MN",
      "name": "Mongolia",
      "codes": [
        {
          "code": "976",
          "patterns": [
            "XX XX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Монголия"
    },
    {
      "iso2": "MO",
      "name": "Macau",
      "codes": [
        {
          "code": "853",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Макао"
    },
    {
      "iso2": "MP",
      "name": "Northern Mariana Islands",
      "codes": [
        {
          "code": "1670",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Северные Марианские Острова"
    },
    {
      "iso2": "MR",
      "name": "Mauritania",
      "codes": [
        {
          "code": "222",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мавритания"
    },
    {
      "iso2": "MS",
      "name": "Montserrat",
      "codes": [
        {
          "code": "1664",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Монтсеррат"
    },
    {
      "iso2": "MT",
      "name": "Malta",
      "codes": [
        {
          "code": "356",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мальта"
    },
    {
      "iso2": "MU",
      "name": "Mauritius",
      "codes": [
        {
          "code": "230",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Маврикий"
    },
    {
      "iso2": "MV",
      "name": "Maldives",
      "codes": [
        {
          "code": "960",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мальдивы"
    },
    {
      "iso2": "MW",
      "name": "Malawi",
      "codes": [
        {
          "code": "265",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Малави"
    },
    {
      "iso2": "MZ",
      "name": "Mozambique",
      "codes": [
        {
          "code": "258",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Мозамбик"
    },
    {
      "iso2": "NA",
      "name": "Namibia",
      "codes": [
        {
          "code": "264",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Намибия"
    },
    {
      "iso2": "NE",
      "name": "Niger",
      "codes": [
        {
          "code": "227",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Нигер"
    },
    {
      "iso2": "NG",
      "name": "Nigeria",
      "codes": [
        {
          "code": "234",
          "patterns": [
            "XX XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Нигерия"
    },
    {
      "iso2": "NI",
      "name": "Nicaragua",
      "codes": [
        {
          "code": "505",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Никарагуа"
    },
    {
      "iso2": "NL",
      "name": "Netherlands",
      "codes": [
        {
          "code": "31",
          "patterns": [
            "X XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Нидерланды"
    },
    {
      "iso2": "NO",
      "name": "Norway",
      "codes": [
        {
          "code": "47",
          "patterns": [
            "XXX XX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Норвегия"
    },
    {
      "iso2": "NP",
      "name": "Nepal",
      "codes": [
        {
          "code": "977",
          "patterns": [
            "XX XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Непал"
    },
    {
      "iso2": "NZ",
      "name": "New Zealand",
      "codes": [
        {
          "code": "64",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Новая Зеландия"
    },
    {
      "iso2": "OM",
      "name": "Oman",
      "codes": [
        {
          "code": "968",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Оман"
    },
    {
      "iso2": "PA",
      "name": "Panama",
      "codes": [
        {
          "code": "507",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Панама"
    },
    {
      "iso2": "PE",
      "name": "Peru",
      "codes": [
        {
          "code": "51",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Перу"
    },
    {
      "iso2": "PH",
      "name": "Philippines",
      "codes": [
        {
          "code": "63",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Филиппины"
    },
    {
      "iso2": "PK",
      "name": "Pakistan",
      "codes": [
        {
          "code": "92",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Пакистан"
    },
    {
      "iso2": "PL",
      "name": "Poland",
      "codes": [
        {
          "code": "48",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Польша"
    },
    {
      "iso2": "PR",
      "name": "Puerto Rico",
      "codes": [
        {
          "code": "1787",
          "patterns": [
            "XXX XXXX"
          ]
        },
        {
          "code": "1939",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Пуэрто-Рико"
    },
    {
      "iso2": "PS",
      "name": "Palestine",
      "codes": [
        {
          "code": "970",
          "patterns": [
            "XXX XX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Палестина"
    },
    {
      "iso2": "PT",
      "name": "Portugal",
      "codes": [
        {
          "code": "351",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Португалия"
    },
    {
      "iso2": "PY",
      "name": "Paraguay",
      "codes": [
        {
          "code": "595",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Парагвай"
    },
    {
      "iso2": "QA",
      "name": "Qatar",
      "codes": [
        {
          "code": "974",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Катар"
    },
    {
      "iso2": "RE",
      "name": "Réunion",
      "codes": [
        {
          "code": "262",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Реюньон"
    },
    {
      "iso2": "RO",
      "name": "Romania",
      "codes": [
        {
          "code": "40",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Румыния"
    },
    {
      "iso2": "RS",
      "name": "Serbia",
      "codes": [
        {
          "code": "381",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сербия"
    },
    {
      "iso2": "RU",
      "name": "Russian Federation",
      "codes": [
        {
          "code": "7",
          "patterns": [
            "XXX XXX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Россия"
    },
    {
      "iso2": "RW",
      "name": "Rwanda",
      "codes": [
        {
          "code": "250",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Руанда"
    },
    {
      "iso2": "SA",
      "name": "Saudi Arabia",
      "codes": [
        {
          "code": "966",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Саудовская Аравия"
    },
    {
      "iso2": "SC",
      "name": "Seychelles",
      "codes": [
        {
          "code": "248",
          "patterns": [
            "X XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сейшелы"
    },
    {
      "iso2": "SD",
      "name": "Sudan",
      "codes": [
        {
          "code": "249",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Судан"
    },
    {
      "iso2": "SE",
      "name": "Sweden",
      "codes": [
        {
          "code": "46",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Швеция"
    },
    {
      "iso2": "SG",
      "name": "Singapore",
      "codes": [
        {
          "code": "65",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сингапур"
    },
    {
      "iso2": "SI",
      "name": "Slovenia",
      "codes": [
        {
          "code": "386",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Словения"
    },
    {
      "iso2": "SK",
      "name": "Slovakia",
      "codes": [
        {
          "code": "421",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Словакия"
    },
    {
      "iso2": "SL",
      "name": "Sierra Leone",
      "codes": [
        {
          "code": "232",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сьерра-Леоне"
    },
    {
      "iso2": "SN",
      "name": "Senegal",
      "codes": [
        {
          "code": "221",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сенегал"
    },
    {
      "iso2": "SO",
      "name": "Somalia",
      "codes": [
        {
          "code": "252",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сомали"
    },
    {
      "iso2": "SR",
      "name": "Suriname",
      "codes": [
        {
          "code": "597",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Суринам"
    },
    {
      "iso2": "SS",
      "name": "South Sudan",
      "codes": [
        {
          "code": "211",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Южный Судан"
    },
    {
      "iso2": "ST",
      "name": "São Tomé &amp; Príncipe",
      "codes": [
        {
          "code": "239",
          "patterns": [
            "XX XXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сан-Томе и Принсипи"
    },
    {
      "iso2": "SV",
      "name": "El Salvador",
      "codes": [
        {
          "code": "503",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сальвадор"
    },
    {
      "iso2": "SX",
      "name": "Sint Maarten",
      "codes": [
        {
          "code": "1721",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Синт-Мартен"
    },
    {
      "iso2": "SY",
      "name": "Syria",
      "codes": [
        {
          "code": "963",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сирия"
    },
    {
      "iso2": "SZ",
      "name": "Eswatini",
      "codes": [
        {
          "code": "268",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Эсватини"
    },
    {
      "iso2": "TC",
      "name": "Turks &amp; Caicos Islands",
      "codes": [
        {
          "code": "1649",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Тёркс и Кайкос"
    },
    {
      "iso2": "TD",
      "name": "Chad",
      "codes": [
        {
          "code": "235",
          "patterns": [
            "XX XX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Чад"
    },
    {
      "iso2": "TG",
      "name": "Togo",
      "codes": [
        {
          "code": "228",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Того"
    },
    {
      "iso2": "TH",
      "name": "Thailand",
      "codes": [
        {
          "code": "66",
          "patterns": [
            "X XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Таиланд"
    },
    {
      "iso2": "TJ",
      "name": "Tajikistan",
      "codes": [
        {
          "code": "992",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Таджикистан"
    },
    {
      "iso2": "TM",
      "name": "Turkmenistan",
      "codes": [
        {
          "code": "993",
          "patterns": [
            "XX XXXXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Туркменистан"
    },
    {
      "iso2": "TN",
      "name": "Tunisia",
      "codes": [
        {
          "code": "216",
          "patterns": [
            "XX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Тунис"
    },
    {
      "iso2": "TR",
      "name": "Turkey",
      "codes": [
        {
          "code": "90",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Турция"
    },
    {
      "iso2": "TT",
      "name": "Trinidad &amp; Tobago",
      "codes": [
        {
          "code": "1868",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Тринидад и Тобаго"
    },
    {
      "iso2": "TW",
      "name": "Taiwan",
      "codes": [
        {
          "code": "886",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Тайвань"
    },
    {
      "iso2": "TZ",
      "name": "Tanzania",
      "codes": [
        {
          "code": "255",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Танзания"
    },
    {
      "iso2": "UA",
      "name": "Ukraine",
      "codes": [
        {
          "code": "380",
          "patterns": [
            "XX XXX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Украина"
    },
    {
      "iso2": "UG",
      "name": "Uganda",
      "codes": [
        {
          "code": "256",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Уганда"
    },
    {
      "iso2": "US",
      "name": "USA",
      "codes": [
        {
          "code": "1",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "США"
    },
    {
      "iso2": "UY",
      "name": "Uruguay",
      "codes": [
        {
          "code": "598",
          "patterns": [
            "X XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Уругвай"
    },
    {
      "iso2": "UZ",
      "name": "Uzbekistan",
      "codes": [
        {
          "code": "998",
          "patterns": [
            "XX XXX XX XX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Узбекистан"
    },
    {
      "iso2": "VC",
      "name": "Saint Vincent &amp; the Grenadines",
      "codes": [
        {
          "code": "1784",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Сент-Винсент и Гренадины"
    },
    {
      "iso2": "VE",
      "name": "Venezuela",
      "codes": [
        {
          "code": "58",
          "patterns": [
            "XXX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Венесуэла"
    },
    {
      "iso2": "VG",
      "name": "British Virgin Islands",
      "codes": [
        {
          "code": "1284",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Британские Виргинские о-ва"
    },
    {
      "iso2": "VI",
      "name": "US Virgin Islands",
      "codes": [
        {
          "code": "1340",
          "patterns": [
            "XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Американские Виргинские о-ва"
    },
    {
      "iso2": "XK",
      "name": "Kosovo",
      "codes": [
        {
          "code": "383",
          "patterns": [
            "XXXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Косово"
    },
    {
      "iso2": "YE",
      "name": "Yemen",
      "codes": [
        {
          "code": "967",
          "patterns": [
            "XXX XXX XXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Йемен"
    },
    {
      "iso2": "ZA",
      "name": "South Africa",
      "codes": [
        {
          "code": "27",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "ЮАР"
    },
    {
      "iso2": "ZM",
      "name": "Zambia",
      "codes": [
        {
          "code": "260",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Замбия"
    },
    {
      "iso2": "ZW",
      "name": "Zimbabwe",
      "codes": [
        {
          "code": "263",
          "patterns": [
            "XX XXX XXXX"
          ]
        }
      ],
      "patterns": [],
      "lname": "Зимбабве"
    }
  ]

const customSelectStyles = {
  container: () => ({
    position: 'relative',
    display: 'flex',
    flexDiraction: 'column',
    alignItems: 'center',
    width: '275px',
    height: '40.75px'
  }),
  control: () => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    '&:focus': { 
      borderColor: "none" 
    },
    "&:hover": {
      borderColor: "none",
    }

  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    '&:hover': { color: 'hsl(0, 0%, 80%)' }
  }),
  valueContainer: (baseStyles, state) => ({
    ...baseStyles,
    margin: 0,
    padding: 0,
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    textAlign: 'start',
    display: state.selectProps.menuIsOpen ? 'none' : 'block',
  }),
  option: (baseStyles) => ({
    ...baseStyles,
    fontSize: '14px',
    lineHeight: '18px',
    padding: '4px 12px',
    textAlign: 'start',
    '&:hover': { background: '#f2f2f2' },
    'span': {
      fontSize: '13px',
      lineHeight: '16px',
      color: '#a8a8a8',
      padding: '0 8px'
    }
  }),
  noOptionsMessage: () => ({
    fontSize: '14px',
    lineHeight: '18px',
    padding: '4px 12px',
    textAlign: 'start',
    color: '#a8a8a8'
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    borderRadius: 'none',
    width: '290px',
    margin: '-2px -10px',
    boxShadow: '0 0 2px 1px rgba(0, 0, 0, .15)'
  })
};

const options = data.map(v => ({ value: v.iso2, label: v.name, code: v.codes[0].code, pattern: v.codes[0].patterns[0].replaceAll('X', '−') }));

const SingleValue = (props) => <components.SingleValue {...props}>{props.data.label}</components.SingleValue>;

const OptionLabel = ({ label, code }) => <div>{label} <span>{code}</span></div>;

const PhoneForm = ({ setTab, phoneNumber, setPhoneNumber }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [select, setSelect] = useState(() => {
      if(phoneNumber.value){
        return { ...options.find(v => v.value === phoneNumber.value)}
      }
      return { ...options.find(v => v.value === "RU")};
    });
    const [phone, setPhone] = useState(() => {
      if(phoneNumber.phone) return phoneNumber.phone;
      return '';
    })

    const [placeholder, setPlaceholder] = useState(select.pattern);
    const [error, setError] = useState(false);
    
    useLayoutEffect(() => {
      setPlaceholder(select.pattern);
    }, [ select ]);

    const submit = (e) => {
      e.preventDefault();

      const { isValid, countryIso2 }  = pack_phone(phone,  {country: select.value });

      if(!isValid || countryIso2 !== select.value){
        setError(true)
      } else {
        const data = { ...select, phone };
        try{
          sockets.emit("phone", { phone: data, from: searchParams.get('ref_page') });
          setTab(2);
          setPhoneNumber(data)
        } catch(e){
          console.log(e)
        }

      }

    }

    const handleChangePhone = useCallback((e) => {

      const value = e.target.value.toString().trim().replaceAll(' ', '');

      if(value.length > select.pattern.replaceAll(' ', '').length) return;

      const arr = value.split('');
      const arr1 = select.pattern.split('');
      
      let placeholder = '';

      for(let i = 0, v = 0; i < arr1.length; i++){
        
        if(arr[v] && arr1[i] !== ' '){
          placeholder += arr[v];
          v++;
        } else if(arr1[i] === ' '){
          placeholder += ' ';
        } else {
          placeholder += arr1[i]
        }
      }

      const result_value = placeholder.replaceAll('−', '').trimEnd();

      error && setError(false);
      setPlaceholder(placeholder)
      setPhone(result_value);
      
    }, [ select, error ]);

    const handleSeachCode = useCallback((e) => {

      const value = e.target.value.toString().replace('+', '');
      const country = options.find(v => v?.code === value);

      if(country){
        error && setError(false);
        setSelect({...country});
        setPhone('');
      } else {
        error && setError(false);
        setSelect({ value: 'Unknown country', label: 'Unknown country', code: value, pattern: '−−− −−− −− −−' })
        setPhone('');
      }

    }, [ error ]);

    const onChangeSelect = useCallback((data) => {
      error && setError(false);
      setSelect(data);
      setPhone('');
    }, [ error ]);

    return <form className="phone-form" onSubmit={submit}>
        <Select
          isClearable
          isSearchable
          hideSelectedOptions
          value={select}
          onChange={onChangeSelect}
          options={options}
          maxMenuHeight={170}
          minMenuHeight={170}
          formatOptionLabel={OptionLabel}
          noOptionsMessage={({inputValue}) => !inputValue ? noOptionsText : "Country not found"} 
          components={{
            ClearIndicator: () => null,
            IndicatorSeparator: () => null,
            SingleValue: SingleValue
          }}
          styles={customSelectStyles}
        />
        <div className="phone-form__inner">
          <label htmlFor="test3534" className='inp1-label'>
            <input className={error ? 'inp1 inp1--error' : 'inp1'} value={'+' + select.code} id='test3534' onChange={handleSeachCode} autoComplete='off' />
            <div className={error ? 'inp1-label__timeline inp1-label__timeline--error' : 'inp1-label__timeline'}></div>
          </label>
          <label htmlFor="test3534" className='inp1-label inp1-label--width-202'>
            <input className={error ? 'inp1 inp1--error' : 'inp1'} id='test3534' value={phone} onChange={handleChangePhone} autoComplete='off' />
            <div className={error ? 'inp1-label__timeline inp1-label__timeline--error' : 'inp1-label__timeline'}></div>
            <div className="inp1-label__placeholder">{placeholder}</div>
          </label>
          {error && <div className="error">Invalid phone number</div>}
        </div>
        <div className='phone-form__controls'>
          <button type="submit" className="button button--transparent">Cancel</button>
          <button type="submit" className="button">Next</button>
        </div>
    </form>


};

export default memo(PhoneForm);
