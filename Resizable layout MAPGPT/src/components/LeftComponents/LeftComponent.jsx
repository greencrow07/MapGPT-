import { useState, useRef, useEffect } from 'react';
import CollapsibleSearchBar from './CollapsibleSearchBar';
import Chat from './Chat';

const LeftComponent = ({ handleAddNode, nodes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  // ✅ Only trigger on first keystroke when bar is closed
  

  return (
    <div className="flex-1 p-2 text-white">
      <div className="relative flex flex-col h-full w-full">

        {/* Chat Section */}
        <div className="flex-1 p-2 overflow-hidden">
          <Chat nodes={nodes} onChatScroll={() => setIsOpen(false)} />
        </div>

        {/* Fixed Search Bar at Bottom */}
        <div className="sticky bottom-0 bg-inherit p-2 z-10">
          <CollapsibleSearchBar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            value={value}
            setValue={setValue}
            inputRef={inputRef}
            handleAddNode={handleAddNode}
            nodes={nodes}
          />
        </div>

      </div>
    </div>
  );
};

export default LeftComponent;
