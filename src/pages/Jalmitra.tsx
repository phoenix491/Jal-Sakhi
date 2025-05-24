import React, { useState, useEffect, useRef } from 'react';
import { useFarmer } from '../contexts/FarmerContext';
import { useSensorData } from '../contexts/SensorDataContext';
import { MessageCircle, Mic, Send, History, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const Jalmitra: React.FC = () => {
  const { farmer } = useFarmer();
  const { usageData, alerts } = useSensorData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock sensor data (replace with API)
  const groundwaterLevel = usageData.groundwaterLevel || 5.2; // meters
  const tds = alerts.find(a => a.type === 'TDS')?.value || 800; // ppm
  const weeklyUsage = usageData.weeklyUsage || 4500; // liters

  const suggestedReplies = [
    'What crop should I sow this month?',
    'How much water did I use last week?',
    'My well’s TDS is high. What can I do?',
    'What is the best time to recharge?',
    'Send tips to my field worker.'
  ];

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: farmer.name,
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage].slice(-5)); // Keep last 5 messages
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, botResponse].slice(-5));
      if (botResponse.text.includes('Tips sent to worker!')) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 500);
  };

  const generateBotResponse = (userText: string): ChatMessage => {
    const lowercaseText = userText.toLowerCase();
    const response: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: 'JalMitra AI',
      text: '',
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (lowercaseText.includes('crop')) {
      response.text = `Based on your region (${farmer.village}) and groundwater level (${groundwaterLevel} meters), sow Bajra or Moong this month. They use less water.`;
    } else if (lowercaseText.includes('water') && lowercaseText.includes('week')) {
      response.text = `Last week, you used ${weeklyUsage} liters of water. This is normal, but drip irrigation can save more.`;
    } else if (lowercaseText.includes('tds')) {
      response.text = `Your well’s TDS is ${tds} ppm, which is high. Collect rainwater and test the soil. Need more help?`;
    } else if (lowercaseText.includes('recharge')) {
      response.text = `Rain is expected this month, so clean your borewell for recharge now. Start next week.`;
    } else if (lowercaseText.includes('worker')) {
      response.text = `Tell your worker: Check the drip system and water every 3 days. I can send tips via SMS.`;
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          user: 'JalMitra AI',
          text: 'Tips sent to worker!',
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }].slice(-5));
      }, 1000);
    } else {
      response.text = `I didn’t understand. Try asking about crops, water, TDS, recharge, or worker tips.`;
    }

    return response;
  };

  const handleSuggestedReply = (reply: string) => {
    setInput(reply);
    handleSend(reply);
  };

  const handleDownloadReport = () => {
    const report = messages.reduce((acc, msg) => {
      return `${acc}${msg.timestamp} - ${msg.user}: ${msg.text}\n`;
    }, `JalMitra AI Report for ${farmer.name} (${farmer.village})\nGroundwater Level: ${groundwaterLevel}m\nWeekly Usage: ${weeklyUsage}L\nTDS: ${tds}ppm\n\n`);
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `JalMitra_Report_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
    // Simulate listening toggle (voice input placeholder)
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      {/* Sidebar for Chat History */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed md:static w-64 bg-white shadow-lg h-full p-4 z-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Chat History</h2>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-sm">Close</span>
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages yet</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-text-primary">{msg.user}</p>
                    <p className="text-xs text-gray-600 truncate">{msg.text}</p>
                    <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-text-primary">JalMitra AI</h1>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 bg-primary text-white rounded-lg"
            >
              <History className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadReport}
              className="p-2 bg-primary text-white rounded-lg"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isBot ? 'bg-primary-light text-white' : 'bg-white text-text-primary'
                  } shadow-sm`}
                >
                  <p className="text-sm font-medium">{message.user}</p>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-wrap gap-2 p-4 bg-white shadow-t-sm">
          {suggestedReplies.map(reply => (
            <motion.button
              key={reply}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestedReply(reply)}
              className="px-3 py-1 bg-gray-100 text-text-primary border border-border rounded-lg text-sm"
            >
              {reply}
            </motion.button>
          ))}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 p-4 bg-white border-t border-gray-200"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about crops, water, or well status... (Voice input coming soon)"
            className="flex-1 p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg ${isListening ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''} ${isListening ? 'text-white' : 'text-text-secondary'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-2 bg-primary text-white rounded-lg"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Jalmitra;