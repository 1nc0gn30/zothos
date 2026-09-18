import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Package, MessageSquare, Send, AlertCircle, Clock, Navigation, Sparkles, Download } from 'lucide-react';
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
  const { user } = useAuthStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [meetup, setMeetup] = useState<OrderMeetup | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [aiGenerations, setAIGenerations] = useState<AIGeneration[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  // Timer states
  const [minutesWaiting, setMinutesWaiting] = useState(0);
  const [showConcern, setShowConcern] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails();
      subscribeToMessages();
      
      // Start timer for waiting time
      const timer = setInterval(() => {
        setMinutesWaiting(prev => prev + 1);
      }, 60000);
      
      return () => {
        clearInterval(timer);
        // Clean up realtime subscription if needed
      };
    }
  }, [user, id]);

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

      if (aiError) throw aiError;
      setAIGenerations(aiData || []);

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
      // Create a prompt based on order items
      const productNames = items.map(item => item.product_name).join(', ');
      const prompt = `Create a digital asset representing: ${productNames}. Style: abstract, colorful, geometric patterns.`;

      const response = await fetch('/api/ai-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: id,
          prompt,
          style: 'abstract',
          dimensions: { width: 512, height: 512 }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI asset');
      }

      const result = await response.json();
      
      // Refresh AI generations
      const { data: aiData, error: aiError } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      if (aiError) throw aiError;
      setAIGenerations(aiData || []);

    } catch (error) {
      console.error('Error generating AI asset:', error);
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Waiting: {minutesWaiting} minutes
        </div>
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
                <p className="text-2xl font-bold">${order.total_amount.toFixed(2)}</p>
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
                      Qty: {item.quantity} × ${item.price_at_purchase.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.quantity * item.price_at_purchase).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generation Section */}
          {order.status === 'completed' && (
            <div className="mt-6 rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Digital Assets
                </h3>
                <button
                  onClick={generateAIAsset}
                  disabled={generatingAI}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {generatingAI ? 'Generating...' : 'Generate Asset'}
                </button>
              </div>

              <div className="space-y-4">
                {aiGenerations.length === 0 ? (
                  <p className="text-muted-foreground">
                    No digital assets generated yet. Click above to create a unique AI-generated asset from your order.
                  </p>
                ) : (
                  aiGenerations.map((generation) => (
                    <div key={generation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">
                          {generation.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(generation.created_at), 'PPp')}
                        </span>
                      </div>

                      <p className="text-sm mb-3">{generation.prompt}</p>

                      {generation.status === 'completed' && generation.generated_asset_url && (
                        <div className="flex items-center gap-2">
                          <img
                            src={generation.generated_asset_url}
                            alt="Generated asset"
                            className="w-20 h-20 rounded object-cover"
                          />
                          <a
                            href={generation.generated_asset_url}
                            download
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </a>
                        </div>
                      )}

                      {generation.status === 'failed' && (
                        <p className="text-sm text-destructive">
                          Failed: {generation.error_message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
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
