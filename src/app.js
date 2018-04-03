/* Entry file that index.html points to */
import MainContent from "./main-content.js";

let mainContent = new MainContent({containerId: "main"});
mainContent.render();