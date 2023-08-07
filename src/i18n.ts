import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    returnEmptyString: false,
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          main: {
            "header": "Welcome to the app!",
            "addExpenditure" :"Add Expenditure"
          }
        }
      },
      es :{
        translation: {
          main: {
            "header": "¡Bienvenido/a a la app!",
            "addExpenditure" :" Añadir gasto"
          }
        }
      },
      lv : {
          translation: {
            main: {
              "header": "Laipni lūdzam lietotnē!",
              "addExpenditure" :"Pievienot izdevumus"
            }
          }
        
      }
    },
  });

export default i18n;