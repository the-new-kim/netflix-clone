// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    color: string;
    textGray: string;
    logoRed: string;
    bgDarkGray: string;
    bgLightGray: string;
    titleShadow: string;
    bgGradient: string;
  }
}
