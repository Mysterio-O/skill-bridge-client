
import { Montserrat, Prosto_One } from "next/font/google";

export const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

export const prosto = Prosto_One({
    subsets: ["latin"],
    variable: "--font-prosto",
    weight: "400",
});