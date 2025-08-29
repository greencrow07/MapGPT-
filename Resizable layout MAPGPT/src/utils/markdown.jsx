 const MarkdownRenderer = ({ content }) => {
  const renderMarkdown = (text) => {
    // Basic markdown parsing - you can enhance this or use a proper markdown library
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br>');
    
    return { __html: html };
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={renderMarkdown(content)}
    />
  );
};
export default MarkdownRenderer; 