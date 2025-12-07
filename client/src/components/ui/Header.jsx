import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, usePlaces } from '../../../hooks';
import { useTheme } from '../../providers/ThemeProvider';
import { MapPin, Calendar as CalendarIcon, HelpCircle, User, Users, Crown, Moon, Sun } from 'lucide-react';
import axiosInstance from '../../utils/axios';
import { format } from 'date-fns';

import SearchBar from './SearchBar';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const Header = () => {
  const auth = useAuth();
  const placesContext = usePlaces();
  const { setPlaces, setLoading } = placesContext;
  const location = useLocation();

  const [hasShadow, setHasShadow] = useState(false);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const { user } = auth;
  const { theme, setTheme } = useTheme();

  const handleScroll = () => {
    const shouldHaveShadow = window.scrollY > 0;
    setHasShadow(shouldHaveShadow);
  };

  const handleSearch = async () => {
    // If no destination, maybe fetch all? matching SearchBar behavior isn't strictly necessary but good UX.
    // For now, only search if destination exists, matching current plan.
    if (!destination.trim()) {
      // Optional: Reset to all places if empty? 
      // For now, let's just return to avoid empty queries if backend doesn't handle them gracefully (though searching empty string might return all).
      // Let's try to search empty string to reset if user clears it.
    }

    try {
      setLoading(true);
      // Use the same endpoint as SearchBar
      const { data } = await axiosInstance.get(`/places/search/${destination.trim()}`);
      setPlaces(data);
    } catch (error) {
      console.error("Search failed", error);
      // Optionally toast error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const isHomePage = location.pathname === '/';

  if (!isHomePage) {
    return (
      <header className="fixed top-0 z-50 flex w-full justify-end p-4 transition-colors duration-300 pointer-events-none">
        <div className="flex items-center gap-4 rounded-full bg-background/80 backdrop-blur-md border border-border/40 p-2 shadow-sm pointer-events-auto">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to={user ? '/account' : '/login'}
            className="flex items-center gap-2 rounded-full border border-border py-1 px-3 hover:shadow-md transition-all"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">{user ? user.name : 'Account'}</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Top Utility Bar - Sticky/Fixed */}
      <div className="fixed top-0 z-50 flex w-full justify-center border-b border-border/20 py-2 text-xs md:text-sm text-muted-foreground bg-background/95 backdrop-blur-md transition-all duration-300">
        <div className="flex w-full max-w-screen-xl justify-between px-6 lg:px-10">
          <div className="flex gap-6">
            <Link to="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Find Properties</span>
            </Link>
            <Link to="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Special Offers</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
            </button>
            <Link to="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Help</span>
            </Link>
            <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 hover:text-primary transition-colors">
              <User className="h-3 w-3 md:h-4 md:w-4" />
              <span>{user ? user.name : 'Account'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header & Search - Scrollable (Static Flow) */}
      <header className="flex w-full flex-col bg-background pt-11 transition-colors duration-300">
        <div className="flex w-full justify-center pb-1">
          <div className="flex w-full max-w-screen-xl flex-col px-6 lg:px-10">

            <div className="flex w-full items-center justify-between mb-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                  <Crown className="h-7 w-7 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-tight tracking-wide text-foreground">Holiday</span>
                  <span className="text-xs font-medium tracking-[0.2em] text-yellow-600 uppercase">Inn</span>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex gap-8 lg:gap-12">
                <Link to="#" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Destinations</Link>
                <Link to="#" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Suites</Link>
                <Link to="#" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Experiences</Link>
                <Link to="#" className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Meetings & Events</Link>
              </nav>
            </div>

            {/* New Search Section (Date Section) */}
            <div className="w-full rounded-3xl bg-amber-50 border border-amber-100 p-4 shadow-lg dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="flex flex-col gap-4">

                {/* Inputs Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full">

                  {/* Destination */}
                  <div className="flex-1 flex flex-col gap-1 px-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Destination</label>
                    <div className="h-[50px] flex items-center bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 px-4 focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
                      <input
                        type="text"
                        placeholder="Where to?"
                        className="w-full bg-transparent p-0 m-0 focus:outline-none"
                        style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Check In */}
                  <div className="flex-1 flex flex-col gap-1 px-2 border-l border-gray-200 dark:border-white/10 md:border-l-0">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Check In</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full h-[50px] bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 px-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500/50 flex items-center transition-all">
                          {checkIn ? format(checkIn, 'dd/MM/yyyy') : <span className="text-muted-foreground">Add dates</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Check Out */}
                  <div className="flex-1 flex flex-col gap-1 px-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Check Out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full h-[50px] bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 px-3 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500/50 flex items-center transition-all">
                          {checkOut ? format(checkOut, 'dd/MM/yyyy') : <span className="text-muted-foreground">Add dates</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests */}
                  <div className="flex-1 flex flex-col gap-1 px-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Guests</label>
                    <div className="h-[50px] flex items-center gap-2 bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 px-3 focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        placeholder="2"
                        className="w-full bg-transparent p-0 m-0 focus:outline-none"
                        style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent' }}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      />
                    </div>
                  </div>

                </div>

                {/* Search Button Row */}
                <div className="w-full flex justify-end mt-0 px-2">
                  <button
                    onClick={handleSearch}
                    className="h-[50px] px-8 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/20 transition-all active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Search Luxury Stays
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
