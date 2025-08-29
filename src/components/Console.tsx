import { useState } from "react";
import { 
  Send, 
  Upload, 
  FileText, 
  Database, 
  Zap, 
  Rocket, 
  ClipboardList,
  Brain,
  TrendingUp,
  Settings,
  User,
  MessageCircle,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import logoImage from 'figma:asset/398625c55fb6dbe126f20f9712c64835e9687496.png';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DocumentTree } from "./DocumentTree";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConsoleProps {
  onBackToHero?: () => void;
}

const Console = ({ onBackToHero }: ConsoleProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'How many users can scale with my CRM?',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      type: 'ai',
      content: 'Analyzing your CRM architecture matrix... Based on your current configuration, your system can efficiently scale to support approximately 50,000-75,000 concurrent users with proper load balancing and database optimization.',
      timestamp: new Date(Date.now() - 240000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I\'m analyzing your query and accessing the relevant documents from your knowledge vault...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };



  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Command Center Header */}
      <header className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded overflow-hidden">
                <img
                  src={logoImage}
                  alt="logo"
                  className="h-8 w-8 scale-150 object-cover object-center"
                />
              </div>
              <span className="font-semibold text-foreground">Intelligence Hub</span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackToHero}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button variant="ghost" size="sm">Universe Hub</Button>
              <Button variant="ghost" size="sm">Neural Sync</Button>
              <Button variant="ghost" size="sm">Evolve</Button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Controls
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Knowledge Vault Sidebar - 25% */}
        <aside className="w-1/4 border-r border-border bg-card overflow-hidden flex flex-col">
          {/* Top Section - Neural Library */}
          <div className="px-[21px] py-[15px] m-[0px] flex flex-col flex-1 min-h-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Neural Library</h3>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <DocumentTree />
              </ScrollArea>
            </div>
          </div>

          {/* Bottom Section - Upload and Metrics */}
          <div className="mt-auto p-6 space-y-6">
            <Separator />

            {/* Upload Intelligence */}
            <div>
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Intelligence
              </Button>
            </div>

            <Separator />

            {/* Neural Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Neural Metrics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Insights today</span>
                  <Badge className="bg-primary/10 text-primary">45</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Docs processed</span>
                  <Badge className="bg-primary/10 text-primary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active connections</span>
                  <Badge className="bg-primary/10 text-primary">8</Badge>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Intelligence Core - 75% */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-border px-6 py-4 bg-card">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">AI Conversation Stream</h2>
              <Badge variant="secondary" className="ml-auto">Neural Mode Active</Badge>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Brain className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Card className={`max-w-2xl ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <CardContent className="p-4">
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </CardContent>
                  </Card>
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-border p-6 bg-card">
            <div className="max-w-4xl">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="🎯 Query your project universe..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Powered by your neural library • Ask anything about your uploaded documents
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export { Console };