import Header from "../app/Header/Header";

export default function ChatLayout() {
  return (
    <div className="flex min-h-screen flex-col">
    
    
      <Header
        title="Roadmap for Q3 launch"
        connectionStatus="online"
        user={{
          name: "Mahar",
          email: "mahar@dev.io",
          avatarUrl: "https://placehold.co/64x64",
        }}
        defaultModel="claude-4"
        onNewChat={() => console.log("start new chat")}
        onModelChange={(id) => console.log("switched to", id)}
        onShare={() => console.log("link copied")}
      />






      {/* Sidebar, chat window, and message input go below/beside this */}
    </div>
  );
}