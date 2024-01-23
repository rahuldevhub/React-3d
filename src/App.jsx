import { useRef } from "react";
import DisplaySection from "./components/DisplaySection";
import Navbar from "./components/Navbar";
import SoundSection from "./components/SoundSection";
import WebgiViewer from "./components/WebgiViewer";
import Jumbotron from "./components/jumbotron";

function App() {
const webgiviewerRef= useRef();
const contentRef = useRef();

const handlePreview = ()=>{
  webgiviewerRef.current.triggerPreview();
}
  return (
    <div className="App">
      <div ref={contentRef} id="content">
      <Navbar/>
      <Jumbotron/>
      <SoundSection/>
      <DisplaySection triggerPreview={handlePreview}/>
      </div>
      
      <WebgiViewer contentRef={contentRef} ref={webgiviewerRef}/>
    </div>
  );
}

export default App;
