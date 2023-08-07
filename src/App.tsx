import React, { useEffect } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { getList } from './store/actions';
import { InflowOutFlowContainter } from './sanky-view';
import Inflow_outflow from './add-inflow-ouflow';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Locales } from './type';


const locales: Locales = {
  en: { title: 'English' },
  lv: { title: 'Latviski' },
  es: { title: 'Español' },
};

function App() {
  const dispatch = useDispatch<any>();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    dispatch(getList());
  }, [])
  return (
    <div className="App">
      <ul>
        {Object.keys(locales).map((locale) => (
          <li key={locale}><button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>
            {locales[locale as keyof Locales].title}
          </button></li>
        ))}
      </ul>
      <div id='header-dark'>
        
        <nav>
          <img src="https://assets-global.website-files.com/6463a648616f8cc20543156a/6474babf2abaf5235c359f76_centime-logo-white.svg" width="139" height="59" loading="lazy" alt="" />
        </nav>
      </div>
      <Grid container spacing={1} className='grid'>
        <Grid item xs={6}>
          <Inflow_outflow />
        </Grid>
        <Grid item xs={6}>
          <InflowOutFlowContainter />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
