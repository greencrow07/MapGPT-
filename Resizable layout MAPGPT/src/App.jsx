import ResizableLayout from './components/ResizableLayout'
import { ReactFlowProvider } from '@xyflow/react';
function App() {
  return (
    <ReactFlowProvider>
      <ResizableLayout/>
    </ReactFlowProvider>
  );
}

export default App;
