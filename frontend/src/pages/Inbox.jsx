import React, { useState, useEffect, useRef } from 'react'
import {
    Search, Filter, Send, Paperclip, MoreHorizontal, Phone, Video,
    ChevronRight, MessageSquare, CheckCircle2, Calendar, Clock, Loader,
    UserPlus, UserCheck, X, RefreshCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCounselorActions, useChatActions, useSupportActions } from '../hooks/useCrmMutations'
import useAppStore from '../store/useStore'
import apiClient, { socket } from '../lib/apiClient'

const Inbox = () => {
    const queryClient = useQueryClient()
    const { updateStage, addNote } = useCounselorActions()
    const { sendMessage, clearUnread } = useChatActions()
    const { assignLead, createLead } = useSupportActions()
    const { selectedLeadId, setSelectedLeadId, role } = useAppStore()

    const [messageInput, setMessageInput] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [newNoteInput, setNewNoteInput] = useState('')
    const [isAddingNote, setIsAddingNote] = useState(false)
    const scrollRef = useRef(null)

    // Modals for Support Role
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false)
    const [assignData, setAssignData] = useState({ team: 'Global Operations', counselor: 'Unassigned', priority: 'Medium' })
    const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', country: '', program: '', source: 'Social', assignTo: 'Auto', priority: 'Medium' })

    // Fetch Chats
    const { data: chatsResp = null, isLoading: loadingChats } = useQuery({
        queryKey: ['chats'],
        queryFn: () => apiClient.get('/leads')
    })
    const chats = Array.isArray(chatsResp?.data) ? chatsResp.data : (Array.isArray(chatsResp) ? chatsResp : [])

    const selectedChatId = selectedLeadId || (chats.length > 0 ? chats[0].id : null)

    useEffect(() => {
        if (!selectedLeadId && chats.length > 0) {
            setSelectedLeadId(chats[0].id)
        }
    }, [chats, selectedLeadId, setSelectedLeadId])

    const selectedChat = chats.find(c => c.id === selectedChatId)

    const { data: messagesResp = null, isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', selectedChatId],
        queryFn: () => apiClient.get(`/messages/${selectedChatId}`),
        enabled: !!selectedChatId
    })
    const messages = Array.isArray(messagesResp?.data) ? messagesResp.data : (Array.isArray(messagesResp) ? messagesResp : [])

    // Socket.IO for real-time messages
    useEffect(() => {
        socket.connect();
        
        socket.on('new_message', (newMessage) => {
            if (newMessage.leadId === selectedChatId) {
                queryClient.setQueryData(['messages', selectedChatId], (old = []) => [...old, newMessage]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedChatId, queryClient]);

    // Fetch Notes for the selected lead
    const { data: notesResp, refetch: refetchNotes } = useQuery({
        queryKey: ['lead-notes', selectedChatId],
        queryFn: () => apiClient.get(`/counselor/notes/${selectedChatId}`),
        enabled: !!selectedChatId
    })

    const notes = Array.isArray(notesResp?.data) ? notesResp.data : (Array.isArray(notesResp) ? notesResp : [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!messageInput.trim()) return
        
        try {
            await apiClient.post('/messages', {
                leadId: selectedChatId,
                message: messageInput,
                sender: 'me',
                channel: selectedChat?.channel || 'WhatsApp'
            });
            setMessageInput('');
            queryClient.invalidateQueries(['messages', selectedChatId]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    const handleChatSelect = (id) => {
        setSelectedLeadId(id)
        if (chats.find(c => c.id === id)?.unread > 0) {
            clearUnread.mutate(id)
        }
    }

    const handleSaveNote = () => {
        if (!newNoteInput.trim()) return;
        addNote.mutate({ leadId: selectedChatId, text: newNoteInput }, {
            onSuccess: () => {
                setNewNoteInput('')
                setIsAddingNote(false)
            }
        })
    }

    const handleAssignLead = () => {
        assignLead.mutate({ leadId: selectedChatId, ...assignData }, {
            onSuccess: () => setIsAssignModalOpen(false)
        })
    }

    const handleCreateLead = () => {
        createLead.mutate({ ...newLeadData, sourceMessageId: selectedChatId }, {
            onSuccess: () => {
                setIsCreateLeadModalOpen(false)
                setNewLeadData({ name: '', phone: '', email: '', country: '', program: '', source: 'Social', assignTo: 'Auto', priority: 'Medium' })
            }
        })
    }

    const filteredChats = chats.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.program?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loadingChats) {
        return (
            <div className="h-[calc(100vh-160px)] flex items-center justify-center -m-6 bg-white">
                <div className="flex flex-col items-center gap-4 text-indigo-600">
                    <Loader className="animate-spin" size={32} />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Workspace...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-280px)] bg-white flex overflow-hidden border border-slate-200/60 rounded-[2.5rem] shadow-lg">
            {/* Left Panel: Communication Hub */}
            <div className="w-[260px] lg:w-[280px] 2xl:w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/20 shrink-0">
                <div className="p-5 2xl:p-6 border-b border-slate-100 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Live Traffic</span>
                            </div>
                            <h2 className="text-lg 2xl:text-xl font-black text-slate-900 tracking-tighter uppercase">Comms</h2>
                        </div>
                        <button className="h-8 w-8 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 transition-all active:scale-95">
                            <Filter size={14} />
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                    <AnimatePresence mode='popLayout'>
                        {filteredChats.map((chat) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={chat.id}
                                onClick={() => handleChatSelect(chat.id)}
                                className={cn(
                                    "mx-3 my-1 p-3 2xl:p-4 rounded-xl cursor-pointer transition-all duration-300 flex gap-3 group relative",
                                    selectedChatId === chat.id 
                                        ? "bg-white shadow-lg shadow-indigo-500/5 border border-indigo-100 ring-1 ring-indigo-500/5" 
                                        : "hover:bg-white/60 border border-transparent"
                                )}
                            >
                                <div className="h-9 w-9 2xl:h-10 2xl:w-10 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center font-black text-xs relative shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                                    {chat.name.charAt(0)}
                                    {chat.unread > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[8px] rounded-full flex items-center justify-center border-2 border-white font-black shadow-lg">
                                            {chat.unread}
                                        </span>
                                    )}
                                    <div className={cn(
                                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                                        chat.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
                                    )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={cn(
                                            "text-[10px] 2xl:text-[11px] font-black uppercase tracking-tight truncate transition-colors",
                                            selectedChatId === chat.id ? "text-indigo-600" : "text-slate-900"
                                        )}>
                                            {chat.name}
                                        </h3>
                                        <span className="text-[7px] 2xl:text-[8px] text-slate-400 font-black uppercase tracking-widest">{chat.time}</span>
                                    </div>
                                    <p className="text-[8px] 2xl:text-[9px] text-slate-500 truncate font-medium leading-relaxed italic">
                                        "{chat.lastMsg}"
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[8px] px-2 py-0.5 bg-slate-100 rounded-lg text-slate-400 font-black uppercase tracking-[0.15em] border border-slate-200/50">
                                            {chat.channel}
                                        </span>
                                        {chat.score > 80 && (
                                            <span className="h-1 w-1 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                                        )}
                                    </div>
                                </div>
                                {selectedChatId === chat.id && (
                                    <motion.div 
                                        layoutId="active-chat-indicator"
                                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full shadow-[2px_0_8px_rgba(99,102,241,0.3)]"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredChats.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100 border-dashed">
                                <Search size={20} />
                            </div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero match results</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Panel: Command Interface */}
            <div className="flex-1 flex flex-col bg-slate-50/10 min-w-[400px] overflow-hidden">
                {selectedChat ? (
                    <>
                        <div className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center font-black text-sm">
                                    {selectedChat.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-0.5">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                                        <p className="text-[8px] text-emerald-600 font-black uppercase tracking-[0.2em]">Operational Connection</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex items-center gap-2 mr-4 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[7px] 2xl:text-[8px] font-black text-slate-400 uppercase tracking-widest">Signal:</span>
                                    <span className="text-[8px] 2xl:text-[9px] font-black text-slate-900 uppercase tracking-widest">{selectedChat.channel}</span>
                                </div>
                                <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <button className="h-8 w-8 2xl:h-9 2xl:w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"><Phone size={14} /></button>
                                    <button className="h-8 w-8 2xl:h-9 2xl:w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"><Video size={14} /></button>
                                    <button className="h-8 w-8 2xl:h-9 2xl:w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"><MoreHorizontal size={14} /></button>
                                </div>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar scrolling-touch">
                            {loadingMessages ? (
                                <div className="h-full flex items-center justify-center opacity-50">
                                    <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <AnimatePresence initial={false} mode='popLayout'>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            layout
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn(
                                                "flex flex-col max-w-[90%]",
                                                msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "px-4 py-3 rounded-2xl text-[12px] font-medium shadow-sm leading-relaxed tracking-tight",
                                                msg.sender === 'me'
                                                    ? "bg-[#020617] text-white rounded-tr-none shadow-indigo-900/10 ring-1 ring-slate-800"
                                                    : "bg-white text-slate-900 border border-slate-100 rounded-tl-none"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[7px] text-slate-400 font-black mt-1 uppercase tracking-[0.2em] flex items-center gap-2">
                                                {msg.sender === 'me' && <CheckCircle2 size={10} className="text-indigo-500" />}
                                                {msg.time}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100">
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-200 transition-all shadow-inner">
                                <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-[1.25rem] transition-all"><Paperclip size={16} /></button>
                                <input
                                    type="text"
                                    placeholder="Input transmission protocol..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-[12px] font-medium py-2 placeholder:text-slate-300 px-2"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!messageInput.trim() || sendMessage.isPending}
                                    className="h-9 px-6 bg-[#020617] text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Transmit</span>
                                    <Send size={12} className={sendMessage.isPending ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                        <div className="h-20 w-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center text-slate-200">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Awaiting Uplink Selection</p>
                    </div>
                )}
            </div>

            {/* Right Panel: Intelligence Node */}
            {selectedChat && (
                <div className="w-[260px] lg:w-[280px] 2xl:w-[320px] border-l border-slate-100 bg-slate-50/10 overflow-y-auto no-scrollbar hidden 2xl:flex flex-col shrink-0">
                    <div className="p-8 text-center bg-white border-b border-slate-100 shadow-sm shrink-0">
                        <div className="relative inline-block mb-4">
                            <div className="h-20 w-20 rounded-[1.75rem] bg-slate-50 text-indigo-600 flex items-center justify-center font-black text-2xl mx-auto border border-slate-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                                {selectedChat.name.charAt(0)}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl border border-slate-100 shadow-lg flex items-center justify-center text-indigo-500">
                                <UserCheck size={18} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">{selectedChat.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedChat.country}</span>
                        </div>

                        {role !== 'Customer Support' && (
                            <div className="flex justify-center gap-3 mt-8">
                                <div className="px-5 py-2.5 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex flex-col items-center">
                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Score Matrix</span>
                                    <span className="text-sm font-black text-indigo-600">{selectedChat.score || '0'}%</span>
                                </div>
                                <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100/50 rounded-2xl flex flex-col items-center">
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Thermal Stat</span>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase">
                                        {selectedChat.score > 80 ? 'Ultra Hot' : 'Nominal'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 space-y-10 flex-1 bg-white xl:bg-transparent">
                        {role === 'Customer Support' ? (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Identity Profile</h4>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        { label: 'Identifier', value: selectedChat.name },
                                        { label: 'Comms Vector', value: '+1 (555) 019-2834' },
                                        { label: 'Source Origin', value: selectedChat.channel },
                                        { label: 'Lifecycle', value: selectedChat.status }
                                    ].map((item) => (
                                        <div key={item.label} className="p-4 bg-white/60 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all cursor-default group">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{item.label}</p>
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <>
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Intelligence Data</h4>
                                    </div>
                                    <div className="grid gap-3">
                                        {[
                                            { label: 'Target Program', value: selectedChat.program || 'Pending Isolation' },
                                            { label: 'Origin Channel', value: selectedChat.channel },
                                            { label: 'Queue Depth', value: `${selectedChat.unread} Priority Signals` }
                                        ].map((item) => (
                                            <div key={item.label} className="p-4 bg-white/60 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all cursor-default group">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{item.label}</p>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Lifecycle Stage</h4>
                                    </div>
                                    <div className="relative group">
                                        <select
                                            value={selectedChat.status === 'Active' ? 'New' : selectedChat.status}
                                            onChange={(e) => updateStage.mutate({ leadId: selectedChatId, stage: e.target.value })}
                                            className="w-full pl-6 pr-12 py-5 bg-white border border-slate-100 rounded-[1.75rem] text-[11px] font-black text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 shadow-sm transition-all hover:bg-slate-50 uppercase tracking-widest"
                                        >
                                            <option>New</option>
                                            <option>Contacted</option>
                                            <option>Pending</option>
                                            <option>Qualified</option>
                                            <option>Converted</option>
                                            <option>Lost</option>
                                        </select>
                                        <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Comms Log</h4>
                                        </div>
                                        <button onClick={() => setIsAddingNote(!isAddingNote)} className="h-8 px-4 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">+ New Log</button>
                                    </div>

                                    <AnimatePresence>
                                        {isAddingNote && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="mb-6"
                                            >
                                                <textarea
                                                    value={newNoteInput}
                                                    onChange={(e) => setNewNoteInput(e.target.value)}
                                                    placeholder="Log details..."
                                                    className="w-full text-xs p-5 bg-white border border-slate-100 rounded-2xl resize-none outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 shadow-inner mb-3 min-h-[100px]"
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => setIsAddingNote(false)} className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Abort</button>
                                                    <button
                                                        onClick={handleSaveNote}
                                                        disabled={addNote.isPending || !newNoteInput.trim()}
                                                        className="px-6 py-2 bg-[#020617] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-95"
                                                    >
                                                        {addNote.isPending && <RefreshCcw size={12} className="animate-spin" />} Commit Log
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-4">
                                        {notes.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Empty Log Sector</p>
                                            </div>
                                        ) : (
                                            notes.map((note) => (
                                                <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                    <p className="text-xs text-slate-600 font-medium leading-[1.6]">{note.text}</p>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <span className="text-[8px] text-slate-300 font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                                                            <Calendar size={12} /> {note.date || 'Active Cycle'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    <div className="mt-auto p-8 border-t border-slate-100 bg-white">
                        {role === 'Customer Support' ? (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    className="h-16 bg-[#020617] text-white rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/40 active:scale-95 uppercase tracking-[0.2em] ring-1 ring-slate-800"
                                >
                                    <UserCheck size={18} /> 
                                    <span>Delegate Lead</span>
                                </button>
                                <button
                                    onClick={() => setIsCreateLeadModalOpen(true)}
                                    className="h-16 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black hover:border-slate-400 transition-all active:scale-95 uppercase tracking-[0.2em]"
                                >
                                    <UserPlus size={18} /> 
                                    <span>Establish Identity</span>
                                </button>
                            </div>
                        ) : (
                            <button className="h-16 bg-[#020617] text-white rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/40 active:scale-95 uppercase tracking-[0.2em] ring-1 ring-slate-800">
                                <Phone size={18} /> 
                                <span>Initiate Uplink</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modals: Transactional Overlays */}
            <AnimatePresence>
                {/* Assign Lead Modal */}
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAssignModalOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Protocol Assignment</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Delegate</h2>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded-xl bg-white border border-slate-200 active:scale-90 transition-all"><X size={18} /></button>
                            </div>
                            <div className="p-10 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operational Division</label>
                                    <select value={assignData.team} onChange={(e) => setAssignData({ ...assignData, team: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 appearance-none shadow-inner transition-all">
                                        <option>Global Operations</option>
                                        <option>Admissions South</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Asset</label>
                                    <select value={assignData.counselor} onChange={(e) => setAssignData({ ...assignData, counselor: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 appearance-none shadow-inner transition-all">
                                        <option>John Doe (Ready)</option>
                                        <option>Sarah Johnson (Standby)</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button onClick={handleAssignLead} disabled={assignLead.isPending} className="w-full h-16 bg-[#020617] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-black transition-all flex justify-center items-center gap-4 shadow-2xl shadow-slate-900/30 disabled:opacity-50 ring-1 ring-slate-800">
                                        Confirm {assignLead.isPending && <RefreshCcw size={16} className="animate-spin" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Create Lead Modal */}
                {isCreateLeadModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateLeadModalOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Protocol Synthesis</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Establish</h2>
                                </div>
                                <button onClick={() => setIsCreateLeadModalOpen(false)} className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"><X size={22} /></button>
                            </div>
                            <div className="p-10 grid grid-cols-2 gap-8">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identity Qualifier</label>
                                    <input type="text" value={newLeadData.name} onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="Enter Full Name" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Objective</label>
                                    <input type="text" value={newLeadData.program} onChange={(e) => setNewLeadData({ ...newLeadData, program: e.target.value })} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="Program Identifier" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Comm Link</label>
                                    <input type="text" value={newLeadData.phone} onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="Frequency (+1...)" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Digital Node</label>
                                    <input type="email" value={newLeadData.email} onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="email@protocol.com" />
                                </div>
                                <div className="col-span-2 pb-2">
                                    <button onClick={handleCreateLead} disabled={createLead.isPending || !newLeadData.name} className="w-full h-16 mt-4 bg-[#020617] text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/40 hover:bg-black transition-all flex justify-center items-center gap-4 active:scale-[0.98] ring-1 ring-slate-800">
                                        Initialize Profile {createLead.isPending && <RefreshCcw size={18} className="animate-spin" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Inbox
