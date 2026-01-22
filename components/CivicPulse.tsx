
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Users, 
  Bookmark, 
  User, 
  MoreHorizontal,
  MessageCircle, 
  Repeat, 
  Heart, 
  Flag, 
  Image as ImageIcon, 
  MapPin, 
  CheckCircle2,
  Map,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import { DashboardTheme, Ward, PollutionPost, AppView } from '../types';

interface CivicPulseProps {
  theme: DashboardTheme;
  wards: Ward[];
  onNavigate: (v: AppView) => void;
  setTheme: (t: DashboardTheme) => void;
}

const MOCK_POSTS: PollutionPost[] = [
  {
    id: 'p1',
    user: { name: 'Aravind K.', handle: 'aravind_delhi', isVerified: true },
    ward: { id: '13', name: 'Anand Vihar', aqi: 468 },
    content: 'Huge amounts of construction dust flying near the metro station extension. No water sprinkling visible for hours. Residents can hardly breathe. #ConstructionDust #AnandVihar #CleanAirDelhi',
    timestamp: '12m',
    stats: { upvotes: 42, comments: 12, shares: 8 },
    aiConfidence: 'High',
    status: 'Reported'
  },
  {
    id: 'p2',
    user: { name: 'Anonymous Citizen', handle: 'nct_reporter', isVerified: false },
    ward: { id: '1', name: 'Narela', aqi: 342 },
    content: 'Illegal waste burning identified behind the industrial block. Thick black smoke spreading across residential pockets. Urgent inspection needed. @DPCC_Official',
    timestamp: '45m',
    stats: { upvotes: 128, comments: 24, shares: 56 },
    aiConfidence: 'Medium',
    status: 'Acknowledged'
  },
  {
    id: 'p3',
    user: { name: 'Meera Singh', handle: 'meera_env', isVerified: true },
    ward: { id: '158', name: 'Lodhi Road', aqi: 88 },
    content: 'Central Delhi still breathing better, but seeing a slow rise in morning smog levels. Keep the air hubs active. #DelhiPollution #LodhiGarden',
    timestamp: '2h',
    stats: { upvotes: 12, comments: 2, shares: 4 },
    aiConfidence: 'High',
    status: 'Resolved'
  }
];

const CivicPulse: React.FC<CivicPulseProps> = ({ theme, wards, onNavigate, setTheme }) => {
  const isDark = theme === 'dark';
  const [posts, setPosts] = useState<PollutionPost[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: PollutionPost = {
      id: Date.now().toString(),
      user: { name: 'Citizen Observer', handle: 'me_reporter', isVerified: true },
      ward: { id: '131', name: 'Anand Vihar', aqi: 450 },
      content: newPostContent,
      timestamp: 'Just now',
      stats: { upvotes: 0, comments: 0, shares: 0 },
      aiConfidence: 'High',
      status: 'Reported'
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-[275px_1fr_350px] gap-0 min-h-screen">
      
      {/* LEFT SIDEBAR: X-STYLE NAV */}
      <aside className="hidden md:flex flex-col border-r border-white/10 py-6 sticky top-0 h-screen pr-4">
        <nav className="space-y-1">
          {[
            { label: 'Home', icon: Home, active: true, view: 'pulse' as AppView },
            { label: 'Dashboard', icon: Map, view: 'home' as AppView },
            { label: 'Explore', icon: Search },
            { label: 'Communities', icon: Users },
            { label: 'Bookmarks', icon: Bookmark },
            { label: 'Profile', icon: User },
            { label: 'More', icon: MoreHorizontal },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => item.view && onNavigate(item.view)}
              className={`flex items-center gap-5 px-4 py-3.5 rounded-full w-full transition-all group hover:bg-white/5 ${item.active ? 'font-black' : 'opacity-60 hover:opacity-100'}`}
            >
              <item.icon size={26} className="group-hover:scale-110 transition-transform" />
              <span className="text-lg tracking-tight capitalize">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <button className="mt-6 bg-indigo-600 text-white w-full py-3.5 rounded-full font-black text-base shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
          Post
        </button>

        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="mt-4 flex items-center gap-5 px-4 py-3.5 rounded-full w-full transition-all group hover:bg-white/5 opacity-60 hover:opacity-100"
        >
          {isDark ? <Sun size={26} /> : <Moon size={26} />}
          <span className="text-lg tracking-tight capitalize">{isDark ? 'Light' : 'Dark'} Mode</span>
        </button>

        {/* Mini Profile Footer */}
        <div className="mt-auto mb-4 flex items-center justify-between p-3 rounded-full hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <User size={20} className="text-indigo-400" />
             </div>
             <div className="flex flex-col text-left">
                <span className="text-[14px] font-bold">Admin Node</span>
                <span className="text-[14px] opacity-40">@pureair_admin</span>
             </div>
          </div>
          <MoreHorizontal size={18} className="opacity-40" />
        </div>
      </aside>

      {/* CENTER COLUMN: MAIN FEED */}
      <main className="border-r border-white/10">
        {/* COMPOSER (X-Style) */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <User size={20} className="text-indigo-400" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What pollution issue are you seeing?"
                className="w-full bg-transparent border-none outline-none text-[20px] font-medium resize-none placeholder:opacity-30 pt-1"
                rows={2}
              />
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4 text-indigo-400">
                  <button className="hover:bg-indigo-500/10 p-2 rounded-full transition-all"><ImageIcon size={20} /></button>
                  <button className="hover:bg-indigo-500/10 p-2 rounded-full transition-all"><MapPin size={20} /></button>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handlePost}
                    disabled={!newPostContent.trim() || newPostContent.length > 280}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[15px] font-bold disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEED */}
        <div className="divide-y divide-white/10">
          <AnimatePresence>
            {posts.map((post) => (
              <PulsePost key={post.id} post={post} isDark={isDark} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* RIGHT SIDEBAR: TRENDS */}
      <aside className="hidden lg:flex flex-col py-6 px-6 sticky top-0 h-screen space-y-6">
        <div className="bg-white/[0.03] p-5 rounded-[20px] border border-white/5">
           <h4 className="text-[20px] font-black tracking-tight mb-4">What’s happening</h4>
           <div className="space-y-6">
              {[
                { label: '#ConstructionDust', volume: '1.2k reports', region: 'South Delhi' },
                { label: '#GarbageBurning', volume: '840 reports', region: 'East Delhi' },
                { label: '#CropStubble', volume: '2.4k reports', region: 'NCT Outer' },
                { label: '#TrafficToxic', volume: '560 reports', region: 'Central Hub' }
              ].map((trend, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[13px] opacity-40 uppercase tracking-widest">{trend.region} · Trending</span>
                    <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-40" />
                  </div>
                  <div className="text-[15px] font-bold group-hover:underline transition-colors">{trend.label}</div>
                  <div className="text-[13px] opacity-40 mt-0.5">{trend.volume}</div>
                </div>
              ))}
           </div>
           <button className="text-indigo-400 text-[15px] hover:underline mt-6 block">Show more</button>
        </div>

        <div className="bg-white/[0.03] p-5 rounded-[20px] border border-white/5">
           <h4 className="text-[20px] font-black tracking-tight mb-4">Ailing Wards (24h)</h4>
           <div className="space-y-4">
              {wards.slice(0, 3).map((w, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div>
                    <div className="text-[15px] font-bold group-hover:underline">{w.name}</div>
                    <div className="text-[13px] opacity-40">{w.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-500 text-[14px] font-bold">+{Math.round(w.aqi*0.2)} AQI</div>
                    <div className="text-[11px] opacity-20 font-black uppercase tracking-widest">SPIKE</div>
                  </div>
                </div>
              ))}
           </div>
           <button className="text-indigo-400 text-[15px] hover:underline mt-6 block">Show more</button>
        </div>
      </aside>

      {/* MOBILE FLOATING ACTION */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50">
         <Plus size={28} />
      </button>
    </div>
  );
};

const PulsePost: React.FC<{ post: PollutionPost; isDark: boolean }> = ({ post, isDark }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 hover:bg-white/[0.02] transition-all cursor-pointer flex gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
        <User size={18} className="opacity-20" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-[15px] hover:underline">{post.user.name}</span>
          {post.user.isVerified && <CheckCircle2 size={16} className="text-indigo-400" />}
          <span className="opacity-40 text-[15px]">@{post.user.handle}</span>
          <span className="opacity-40 text-[15px]">· {post.timestamp}</span>
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
            <Map size={10} className="opacity-30" />
            <span className="text-[11px] font-bold uppercase tracking-tight">{post.ward.name}</span>
          </div>
          <div className={`text-[11px] font-black uppercase tracking-tight ${post.ward.aqi > 300 ? 'text-rose-500' : 'text-emerald-500'}`}>
            AQI: {post.ward.aqi}
          </div>
        </div>

        <p className="text-[15px] font-normal leading-normal py-1">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-2 max-w-sm opacity-60">
          <div className="flex items-center gap-2 group/act hover:text-indigo-400 transition-colors">
             <MessageCircle size={18} />
             <span className="text-[13px]">{post.stats.comments}</span>
          </div>
          <div className="flex items-center gap-2 group/act hover:text-emerald-400 transition-colors">
             <Repeat size={18} />
             <span className="text-[13px]">{post.stats.shares}</span>
          </div>
          <div className="flex items-center gap-2 group/act hover:text-rose-400 transition-colors">
             <Heart size={18} />
             <span className="text-[13px]">{post.stats.upvotes}</span>
          </div>
          <div className="flex items-center gap-2 group/act hover:text-indigo-400 transition-colors">
             <Flag size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CivicPulse;
