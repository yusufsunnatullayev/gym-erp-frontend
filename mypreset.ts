import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      main: '#CB3CFF',
      lightHover: '#d063f7',
      darkHover: '#bc14f7',
    },
    gradient: {
      primary: 'linear-gradient(140deg, #CB3CFF 20%, #7F25FB 68%)',
    },
    secondary: {
      slate: '#0B1739',
      purple: '#8951FF',
      sky: '#21C3FC',
      blue: '#0E43FB',
      yellow: '#FDB52A',
    },
    neutral: {
      800: '#081028',
      700: '#0A1330',
      600: '#0B1739',
      500: '#7E89AC',
      400: '#AEB9E1',
      300: '#D1DBF9',
      200: '#D9E1FA',
      100: '#FFFFFF',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.main}',
          inverseColor: '{secondary.yellow}',
          hoverColor: '{primary.lightHover}',
          activeColor: '{secondary.purple}',
        },
        highlight: {
          background: '{neutral.600}',
          focusBackground: '{neutral.700}',
          color: '{neutral.100}',
          focusColor: '{neutral.100}',
        },
      },
      dark: {
        primary: {
          color: '{primary.main}',
          inverseColor: '{neutral.100}',
          hoverColor: '{primary.darkHover}',
          activeColor: '{secondary.purple}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, 0.08)',
          focusBackground: 'rgba(250, 250, 250, 0.16)',
          color: 'rgba(255, 255, 255, 0.87)',
          focusColor: 'rgba(255, 255, 255, 0.87)',
        },
      },
    },
  },
});

export default Noir;
