import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Package, MessageSquare, Send, AlertCircle, Clock, Navigation, Sparkles, Download, Wand2, ImageIcon, ExternalLink, Leaf, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem, OrderMeetup, OrderMessage } from '../types/database';
import { AIGeneration } from '../types/ai';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

// Map Imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const VA_BEACH_TOWN_CENTER = { lat: 36.8430, lng: -76.1320 };

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuthStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [meetup, setMeetup] = useState<OrderMeetup | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [aiGenerations, setAIGenerations] = useState<AIGeneration[]>([]);
  const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set());
  const [imageRetryCount, setImageRetryCount] = useState<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [includeLogo, setIncludeLogo] = useState(true);
  
  // Timer states
  const [minutesWaiting, setMinutesWaiting] = useState(0);
  const [showConcern, setShowConcern] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails();
      // Subscribe to realtime messages and capture cleanup
      const unsubscribe = subscribeToMessages();
      subscriptionRef.current = unsubscribe || null;

      return () => {
        // Clean up realtime subscription
        if (subscriptionRef.current) {
          subscriptionRef.current();
          subscriptionRef.current = null;
        }
      };
    }
  }, [user, id]);

  // Calculate waiting time from order.created_at — stops when order is completed
  useEffect(() => {
    if (!order?.created_at || order?.status === 'completed') {
      if (order?.status === 'completed') {
        const placedAt = new Date(order.created_at).getTime();
        const completedMinutes = Math.floor(Math.max(0, Date.now() - placedAt) / 60000);
        setMinutesWaiting(completedMinutes);
      }
      return;
    }

    const calculateMinutes = () => {
      const placedAt = new Date(order.created_at).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - placedAt);
      const diffMinutes = Math.floor(diffMs / 60000);
      setMinutesWaiting(diffMinutes);
    };

    calculateMinutes();
    const timer = setInterval(calculateMinutes, 60000);
    return () => clearInterval(timer);
  }, [order?.created_at, order?.status]);



  // Show concern message after 15 minutes
  useEffect(() => {
    if (minutesWaiting >= 15) {
      setShowConcern(true);
    }
  }, [minutesWaiting]);

  const fetchOrderDetails = async () => {
    if (!user || !id) return;

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Fetch meetup details
      const { data: meetupData, error: meetupError } = await supabase
        .from('order_meetups')
        .select('*')
        .eq('order_id', id)
        .maybeSingle();

      if (meetupError) throw meetupError;
      setMeetup(meetupData);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Fetch AI generations
      const { data: aiData, error: aiError } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      if (aiError) {
        console.warn("AI generations not available for this order (table may not exist or order is legacy)", aiError);
        setAIGenerations([]);
      } else {
        setAIGenerations(aiData || []);
      }

    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!id) return;

    const subscription = supabase
      .channel('order-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as OrderMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newMessage.trim()) return;

    setSending(true);
    
    try {
      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: id,
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      scrollToBottom();

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const generateAIAsset = async () => {
    if (!user || !id || !order || generatingAI) return;

    setGeneratingAI(true);
    
    try {
      const productNames = items.map(item => item.product_name).join(', ');
      const defaultPrompt = `a premium cannabis-themed digital collectible featuring ${productNames}. Rich, vibrant, artistic, high quality digital art with cannabis culture aesthetic, artistic composition, no text, no watermark.`;
      const prompt = aiPrompt.trim() || defaultPrompt;

      const response = await fetch('/api/ai-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: id,
          prompt,
          style: 'abstract',
          provider: 'pollinations',
          user_id: user.id,
          include_logo: includeLogo,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.details || err.error || 'Failed to generate asset');
      }

      const result = await response.json();
      
      // Refresh AI generations
      const { data: aiData, error: aiError } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      if (aiError) {
        console.warn("AI generations not available for this order", aiError);
        setAIGenerations([]);
      } else {
        setAIGenerations(aiData || []);
        // Mark latest generation as not-yet-loaded so spinner shows
        if (aiData && aiData.length > 0) {
          const latest = aiData[0];
          setLoadedImageIds(prev => {
            const next = new Set(prev);
            next.delete(latest.id);
            return next;
          });
        }
      }

    } catch (error: any) {
      console.error('Error generating AI asset:', error);
      // Show inline error by refreshing generations (failed status will be visible)
      const { data: aiData } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });
      setAIGenerations(aiData || []);
      if (aiData && aiData.length > 0) {
        const latest = aiData[0];
        setLoadedImageIds(prev => {
          const next = new Set(prev);
          next.delete(latest.id);
          return next;
        });
      }
    } finally {
      setGeneratingAI(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Order not found</h2>
          <p className="mt-2 text-muted-foreground">This order doesn't exist or you don't have permission to view it.</p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Helmet>
        <title>Order #{order.id.slice(-8)} - 757 Gas Shop</title>
      </Helmet>

      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/orders"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex-1" />
        {order?.status !== 'completed' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Waiting: {minutesWaiting} minutes
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Details */}
        <div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                <p className="font-mono text-sm">{order.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="capitalize">{order.status}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Total</label>
                <p className="text-2xl font-bold">{order.total_amount.toFixed(2)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Placed</label>
                <p>{format(new Date(order.created_at), 'PPP p')}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-bold">Items</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × {item.price_at_purchase.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {(item.quantity * item.price_at_purchase).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generation Section */}
          {order.status === 'completed' && (
            <div className="mt-6 card-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Digital Asset</h3>
                  <p className="text-xs text-muted-foreground">AI-generated collectible from your order</p>
                </div>
              </div>

              {/* Loading state */}
              {generatingAI && (
                <div className="rounded-xl border border-border/50 bg-muted/20 p-8 text-center">
                  <div className="relative mx-auto mb-4 w-16 h-16">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Wand2 className="h-7 w-7 text-primary animate-spin" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Creating your digital collectible...</p>
                  <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds</p>
                </div>
              )}

              {/* No generation yet — show customize + generate form */}
              {!generatingAI && aiGenerations.length === 0 && (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 p-6 space-y-5">
                  {/* Logo toggle */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIncludeLogo(v => !v)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        includeLogo
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      <Leaf className="h-3 w-3" />
                      Include 757 Gas Shop branding
                    </button>
                  </div>

                  {/* Custom prompt */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Pencil className="h-3 w-3" />
                      Custom prompt (optional)
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={`e.g. A cosmic cannabis garden with purple buds glowing under neon lights...`}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Leave blank for a cannabis-themed collectible based on your order items.
                    </p>
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={generateAIAsset}
                    className="w-full inline-flex items-center justify-center gap-2 btn-premium text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold"
                  >
                    <Wand2 className="h-4 w-4" />
                    Generate your asset
                  </button>
                </div>
              )}

              {/* Show generations */}
              {!generatingAI && aiGenerations.length > 0 && (
                <div className="space-y-4">
                  {aiGenerations.map((generation) => (
                    <div key={generation.id} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                      {generation.status === 'generating' && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          <p className="text-sm font-medium text-muted-foreground">Generating...</p>
                        </div>
                      )}

                      {generation.status === 'completed' && generation.generated_asset_url && (
                        <div className="space-y-4">
                          <div className="relative rounded-xl overflow-hidden border border-border bg-zinc-900 min-h-48 flex items-center justify-center">
                            {!loadedImageIds.has(generation.id) && (
                              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/80">
                                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
                                <p className="text-sm font-medium text-muted-foreground">Rendering image... Come back in a couple minutes!</p>
                              </div>
                            )}
                            <img
                              src={generation.generated_asset_url}
                              alt="Generated digital asset"
                              className={`w-full h-auto object-contain max-h-96 transition-opacity duration-500 ${loadedImageIds.has(generation.id) ? 'opacity-100' : 'opacity-0'}`}
                              loading="eager" referrerPolicy="no-referrer"
                              onLoad={() => {
                                setLoadedImageIds(prev => new Set(prev).add(generation.id));
                              }}
                              onError={() => {
                                const retries = imageRetryCount[generation.id] || 0;
                                if (retries < 3) {
                                  setImageRetryCount(prev => ({ ...prev, [generation.id]: retries + 1 }));
                                  setTimeout(() => {
                                    // Force re-render by toggling loaded state off briefly
                                    setLoadedImageIds(prev => {
                                      const next = new Set(prev);
                                      next.delete(generation.id);
                                      return next;
                                    });
                                  }, 100);
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={generation.generated_asset_url}
                              download
                              className="inline-flex items-center gap-2 btn-premium text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                            <button
                              onClick={() => window.open(generation.generated_asset_url, '_blank')}
                              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View
                            </button>
                          </div>
                        </div>
                      )}

                      {generation.status === 'failed' && (
                        <div className="text-center py-4">
                          <p className="text-sm text-destructive mb-3">
                            {generation.error_message || 'Generation failed'}
                          </p>
                          <button
                            onClick={generateAIAsset}
                            className="inline-flex items-center gap-2 btn-premium text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold"
                          >
                            <Wand2 className="h-4 w-4" />
                            Try again
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map and Chat */}
        <div>
          {/* Meetup Location */}
          {meetup ? (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pickup Location
              </h3>

              <div className="h-64 rounded-lg overflow-hidden mb-4">
                <MapContainer
                  center={[meetup.latitude, meetup.longitude]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[meetup.latitude, meetup.longitude]}>
                    <Popup>
                      <div>
                        <strong>Pickup Location</strong>
                        <br />
                        {meetup.label || 'Your order pickup point'}
                        {meetup.note && (
                          <>
                            <br />
                            {meetup.note}
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {meetup.label && (
                <p className="font-medium">{meetup.label}</p>
              )}
              {meetup.note && (
                <p className="text-sm text-muted-foreground">{meetup.note}</p>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${meetup.latitude},${meetup.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </a>
            </div>
          ) : order.status === 'completed' ? (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Complete
              </h3>
              <p className="text-muted-foreground">
                Your order has been completed. A pickup location was not assigned.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Processing
              </h3>
              <p className="text-muted-foreground">
                Your order is being processed. Pickup location will be available soon.
              </p>
              {showConcern && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertCircle className="h-4 w-4 text-yellow-600 inline mr-2" />
                  <span className="text-yellow-700 text-sm">
                    Been waiting a while? Feel free to message us below.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Chat */}
          <div className="mt-6 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Order Chat
            </h3>

            <div className="h-48 overflow-y-auto mb-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No messages yet. Start a conversation!
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-3 py-2 ${
                          message.user_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.user_id === user?.id
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {format(new Date(message.created_at!), 'p')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
