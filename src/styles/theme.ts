import { type ThemeConfig } from "antd";

export const COLORS = {
  orange: "#ff4a01",
  orange2: "#bd3802",
  green: "#01a8a1",
  green2: "#007873",
  emerald: "#2f855a",
  emerald2: "#226141",
  cream: "#f9f7ea",
  red: "#c53030",
  red2: "#9e2424",
  blue: "#0091f7",
  blue2: "#0078cc",
  dark: "#212129",
  dark2: "#141417",
  light: "#fafafa",
};

export const theme: ThemeConfig = {
  token: {
    fontFamily: "Poppins",
    colorBgElevated: COLORS.light,
    colorPrimary: COLORS.dark,
    colorLinkHover: COLORS.blue2,
  },
  components: {
    Select: {
      colorBgElevated: COLORS.light,
      selectorBg: COLORS.cream,
      colorBorder: COLORS.dark,
      optionSelectedBg: COLORS.blue2,
      optionSelectedColor: COLORS.cream,
      optionSelectedFontWeight: 500,
      colorPrimary: COLORS.cream,
      fontSize: 16,
      optionFontSize: 14,
    },
    Layout: {
      headerBg: COLORS.dark,
      siderBg: COLORS.dark,
    },
    Menu: {
      itemSelectedColor: COLORS.orange,
      itemSelectedBg: COLORS.orange,
      itemBg: COLORS.dark,
      itemHoverBg: COLORS.dark2,
      itemActiveBg: COLORS.dark2,
      itemColor: COLORS.cream,
    },
    Table: {
      headerBg: COLORS.dark,
      headerColor: COLORS.cream,
      headerSortHoverBg: COLORS.dark2,
      headerSplitColor: COLORS.cream,
      borderColor: "#e8e8ed",
      headerSortActiveBg: COLORS.orange,
      headerBorderRadius: 6,
      colorBgContainer: COLORS.light,
      cellPaddingBlock: 5,
      rowHoverBg: "#e8e8ed",
    },
  },
};
