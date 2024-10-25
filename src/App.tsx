import { StompProvider } from './components/StompProvider';
import TauriWindowEventListener from './components/TauriWindowEventListener';
import ItemView from './ui-sections/ItemView'
import './App.css'

function App() {

  return (
    <StompProvider>
      <div className="main-content-column">
				<h1 className="main-title">My To-Do App</h1>
				<TauriWindowEventListener />
				<ItemView />
				<div className="bottom-spacer" />
			</div>
    </StompProvider>
  );
	
}

export default App
