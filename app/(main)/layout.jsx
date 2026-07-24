import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import ChatLayout from "@/app/ChatLayout" 
import  Footer  from "@/app/Footer/Footer";
import { Toaster } from 'sonner'
import Header from "../Header/Header";


const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <body className="min-h-full flex flex-col">
        
{/* <ChatLayout></ChatLayout>  */}
<Header></Header>
               <Toaster richColors position="top-right" />

        {children}
        
        
        <Footer></Footer>
        </body>
    </html>
  );
}
