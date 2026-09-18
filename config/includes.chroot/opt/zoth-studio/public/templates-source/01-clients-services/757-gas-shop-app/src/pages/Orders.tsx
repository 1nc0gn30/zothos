import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../types/database';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import LottieWatermark from '../components/LottieWatermark';

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>My Orders | 757 Gas Shop</title>
      </Helmet>

      <section className="hero-watermark-wrap mb-8 rounded-[1.8rem] border border-border bg-card p-5 sm:p-6">
        <LottieWatermark src="/lottie/pickup-pin-pulse.json" className="lottie-watermark--small" />
        <div className="hero-watermark-content">
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track pickup progress and order status.</p>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet.</p>
          <Link 
            to="/shop" 
            className="btn-premium inline-flex items-center justify-center px-8 py-3.5 text-primary-foreground font-bold rounded-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to={`/orders/${order.id}`}
              className="block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Package className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                  <div className="text-right">
                    <div className="font-bold text-lg">{order.total_amount.toFixed(2)}</div>
                    <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
