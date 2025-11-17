// app/constants/colors.ts
const Colors = {
  transparent: "transparent" as const,
  black: "#000000" as const,
  white: "#FFFFFF" as const,
  primary: "#C4E538" as const,    //  active tab color
  inactive: "gray" as const,       //  inactive tab color
  bg: "#0B0B0B" as const,
  surface: "#121212" as const,
  gray100: "#F5F5F5" as const,
  gray500: "#6B6B6B" as const,


  homeGradientStart: "#f5f5f5" as const, 
  homeGradientEnd: "#000" as const,   
  
  favGradientStart: "#1A0A1E" as const,  
  favGradientEnd: "#4A1A3A" as const,     
  
  profileGradientStart: "#0F0F23" as const,  
  profileGradientEnd: "#1E1E3F" as const,
};

export default Colors;
export type ColorKeys = keyof typeof Colors;
