import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Literata_400Regular } from '@expo-google-fonts/literata/400Regular';
import { Literata_500Medium } from '@expo-google-fonts/literata/500Medium';
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold';
import { Literata_700Bold } from '@expo-google-fonts/literata/700Bold';

import { fonts } from './theme';

/** Per-weight imports keep unused weights out of the bundle. */
export const fontSources = {
  [fonts.serif]: Literata_400Regular,
  [fonts.serifMedium]: Literata_500Medium,
  [fonts.serifSemiBold]: Literata_600SemiBold,
  [fonts.serifBold]: Literata_700Bold,
  [fonts.sans]: Inter_400Regular,
  [fonts.sansMedium]: Inter_500Medium,
  [fonts.sansSemiBold]: Inter_600SemiBold,
};
