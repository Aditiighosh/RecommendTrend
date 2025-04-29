import {Button} from "./components/ui/button";
import {LandingPage} from "./components/landing/page";
import './globals.css';
import { NavBar } from "./components/NavBar/page";
import {About} from "./About/page";
export default function Home() {
  return (
      <main>
       <NavBar/>
       <LandingPage/>
        <About/>
          {/* <div className="flex justify-center items-center h-screen">
            <Button>Click Me</Button>
          </div> */}
       </main>
      
  );
}
