import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, 
  Float, 
  MeshDistortMaterial, 
  Text,
  Text3D,
  Center,
  Sparkles,
  Environment,
  Grid,
  Trail,
  Cloud,
  Line,
  PerspectiveCamera,
  OrbitControls,
  Image as DreiImage,
  useCursor
} from '@react-three/drei';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Music, 
  Calendar, 
  User, 
  ShoppingBag, 
  Mail,
  Play, 
  Pause, 
  X,
  Mic2,
  Disc,
  ExternalLink,
  Shield,
  Plus,
  Trash2,
  LogOut,
  Heart,
  Share2,
  Activity,
  Minus,
  CreditCard,
  Zap,
  Users,
  AlertTriangle,
  Check,
  Palette,
  Globe,
  BarChart3,
  LogIn,
  LayoutDashboard,
  Database,
  Search,
  Bell,
  Printer,
  Download,
  MoreVertical,
  Filter,
  ChevronDown,
  FileText,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Briefcase,
  MessageSquare,
  PieChart,
  RefreshCcw,
  Image as ImageIcon,
  Edit,
  Box,
  Upload
} from 'lucide-react';
import * as THREE from 'three';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError
} from "firebase/auth";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyD4PgzzQnrpqQjRJI8tr-qBLB71b0Flsd4",
  authDomain: "chuma-7d96c.firebaseapp.com",
  databaseURL: "https://chuma-7d96c-default-rtdb.firebaseio.com",
  projectId: "chuma-7d96c",
  storageBucket: "chuma-7d96c.firebasestorage.app",
  messagingSenderId: "585665952166",
  appId: "1:585665952166:web:fdf7801211322b12ffb767",
  measurementId: "G-7Y2TLM5VBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null);

// --- CONSTANTS & DATA ---

const INITIAL_TRACKS = [
  { id: 1, title: "SHE BE", duration: "2:45", plays: "10.4M", type: "Single", year: "2023", link: "https://open.spotify.com/track/1hPrUdO775t6JkI56Cr8Us" },
  { id: 2, title: "SHE BE (Sped Up)", duration: "2:15", plays: "2.5M", type: "Single", year: "2023", link: "https://open.spotify.com/track/2w82JyPaIey14wPUg2E9Fe?si=778698893b9c4867" },
  { id: 3, title: "STEADILY", duration: "3:10", plays: "2.3M", type: "Single", year: "2025", link: "https://open.spotify.com/track/5yayaJ2gEUEoKHMJmwGdUw?si=8b7a637f05f9407e" },
  { id: 4, title: "GROW & HUSTLE", duration: "3:05", plays: "266K", type: "Single", year: "2023", link: "https://open.spotify.com/track/7tIrkhISEZSDSOLM9OmbP2?si=58942ace501b446d" },
  { id: 5, title: "What Else", duration: "3:02", plays: "232K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6iCZyikX0wiDqGIADWXXIL?si=8a9c958247094dd1" },
  { id: 6, title: "Like It", duration: "2:50", plays: "209K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6nRR968dHGVbHkGEGW5qjh?si=92b118aa39b540ff" },
  { id: 7, title: "Jealousy", duration: "3:15", plays: "147K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6nRR968dHGVbHkGEGW5qjh?si=92b118aa39b540ff" },
  { id: 8, title: "Belong", duration: "2:55", plays: "71K", type: "Single", year: "2025", link: "https://open.spotify.com/track/5DxKXoAw39p7z8vIhgHzcA?si=2d3ce919acbf4120" },
  { id: 9, title: "SHE BE (Slowed)", duration: "3:20", plays: "33K", type: "Single", year: "2023", link: "https://open.spotify.com/track/67XBVOvOqCo1ATTZwZhgQg?si=2649d24aafcd4876" },
  { id: 10, title: "Confess", duration: "3:12", plays: "22K", type: "Single", year: "2023", link: "https://open.spotify.com/track/0lNw49uPbyACig39V9GDKZ?si=c4df56ff6adf491a" },
  { id: 11, title: "Hour Glass", duration: "2:58", plays: "20K", type: "Single", year: "2023", link: "https://open.spotify.com/track/2TRIg9sBurbFiMdjaqSxRy?si=bef2f6f7c5ec4c51" },
  { id: 12, title: "RHODA", duration: "3:30", plays: "10K", type: "Single", year: "2025", link: "https://open.spotify.com/track/3s6QoBib2YKMvRzHdPp7VA?si=883ca5caad1f422d" },
  { id: 13, title: "KALI (Radio Edit Mix)", duration: "2:45", plays: "8.4K", type: "Single", year: "2025", link: "https://open.spotify.com/track/2bW51OJbA3JDCriRKIxO4c?si=036b3e90cfa342b4" },
];

const INITIAL_TOUR_DATES = [
  { id: 1, city: "London", venue: "O2 Academy", date: "OCT 12", country: "UK" },
  { id: 2, city: "Lagos", venue: "Eko Hotel", date: "OCT 24", country: "NG" },
  { id: 3, city: "New York", venue: "Brooklyn Mirage", date: "NOV 05", country: "USA" },
  { id: 4, city: "Accra", venue: "Black Star Square", date: "DEC 18", country: "GH" },
];

const driveImg = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

const INITIAL_MERCH = [
  { id: 1, name: "CHUMA HOODIE v1", price: 65, type: "Apparel", category: "merch", img: driveImg("10tCnCgrORd2jp6-4BX-ql0PQT6tWvXXz") },
  { id: 2, name: "VINYL: GOLD EDITION", price: 45, type: "Physical", category: "merch", img: driveImg("1y08Hp2qZk3NOrrfl83n5FUoVjaW49EaM") },
  { id: 3, name: "AFRO-FUSION DRUM KIT", price: 29, type: "Sample Pack", category: "sounds", img: driveImg("1TcrZNb5z8ErvwlCxREHqxHYG6vQ-1dmf") },
  { id: 4, name: "LAGOS VIBES BEAT", price: 150, type: "Exclusive Rights", category: "beats", img: driveImg("1SnMYLsqS-qFtxx2RkAwoWYWbkqlkWIwK") },
];

const INITIAL_WALL_IMAGES = [
  { id: 1, src: driveImg("1ulOoeMRqsIN2G8H4eHBNOH-_tnwr7BFw"), caption: "ICONIC" },
  { id: 2, src: driveImg("1xQpHQgd1zNkyOgnPDLfNUJR06tJiTsZ1"), caption: "VIBES" },
  { id: 3, src: driveImg("1jvJHuZrSTvfQOjqZ3bJaueWl8thA38Hq"), caption: "VISION" },
  { id: 4, src: driveImg("1RtnAPj7Fcln3bdHJDzNKXNFGB6w1Yr08"), caption: "STAGE" },
  { id: 5, src: driveImg("1vY_5CiRXTPe-Ltq1WIGxuOgqRgm1THbG"), caption: "ART" },
  { id: 6, src: driveImg("14aZV2VqBlZ7L8mKZSf7oGIPaXA3nj945"), caption: "ENERGY" },
  { id: 7, src: driveImg("1Kd5gWZ78wS7d8G5ZFKADlbML0au1yHDj"), caption: "FUTURE" },
  { id: 8, src: driveImg("19dSIMeU-cSiXZyCzOEDRopIfzLC-a5up"), caption: "LEGACY" }
];

const INITIAL_ORDERS = [
  { id: "22665541", product: "CHUMA HOODIE v1", qty: 1, color: "Black", customer: "Danial Colins", email: "danial@gmail.com", price: 65, payment: "Credit Card", status: "Pending", statusColor: "bg-orange-500", img: driveImg("10tCnCgrORd2jp6-4BX-ql0PQT6tWvXXz"), date: "2023-10-23" },
  { id: "22665542", product: "VINYL: GOLD EDITION", qty: 1, color: "Gold", customer: "Kristin Watson", email: "kristin@gmail.com", price: 45, payment: "Credit Card", status: "Processing", statusColor: "bg-green-500", img: driveImg("1y08Hp2qZk3NOrrfl83n5FUoVjaW49EaM"), date: "2023-10-22" },
  { id: "22665543", product: "AFRO-FUSION DRUM KIT", qty: 1, color: "Digital", customer: "Jenny Wilson", email: "jennyw@gmail.com", price: 29, payment: "Paypal", status: "Shipped", statusColor: "bg-blue-500", img: driveImg("1TcrZNb5z8ErvwlCxREHqxHYG6vQ-1dmf"), date: "2023-10-21" }
];

// --- UTILITY COMPONENTS ---

const ToastContext = React.createContext({ showToast: (msg: string, icon?: any) => {} });

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{id: number, msg: string, icon: any}[]>([]);

  const showToast = (msg: string, Icon = Check) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, icon: Icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 md:top-24 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-black/80 backdrop-blur border border-[var(--theme-color)] text-white px-3 py-2 md:px-4 md:py-2 rounded shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)] flex items-center gap-2"
            >
              <t.icon size={14} className="text-[var(--theme-color)]" />
              <span className="text-[10px] md:text-xs font-brand tracking-wider">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

const ScrambleText = ({ text, className, active }: { text: string, className?: string, active?: boolean }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  
  useEffect(() => {
    if(active) scramble();
  }, [active]);

  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseEnter={scramble} className={className}>
      {display}
    </span>
  );
};

const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 300], [10, -10]);
  const rotateY = useTransform(x, [0, 300], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(150); y.set(150); }}
      className="relative transform-style-3d w-full"
    >
      {children}
    </motion.div>
  );
};

const LiveTicker = ({ isAdmin }: { isAdmin: boolean }) => {
  const [msg, setMsg] = useState("");
  
  useEffect(() => {
    const salesMsgs = [
        "Someone from Lagos just bought a HOODIE",
        "New ticket sold: LONDON O2",
        "User129 just streamed SHE BE",
        "New listener from TOKYO",
        "Someone from Accra just joined the TRIBE",
        "User88 just bought VINYL: GOLD EDITION"
    ];
    const adminMsgs = [
        "Merch stock running low: GOLD VINYL",
        "Server load at 45%",
        "New support ticket #404 opened"
    ];

    const availableMsgs = isAdmin ? [...salesMsgs, ...adminMsgs] : salesMsgs;

    const interval = setInterval(() => {
      setMsg(availableMsgs[Math.floor(Math.random() * availableMsgs.length)]);
    }, 5000);
    setMsg(availableMsgs[0]);
    return () => clearInterval(interval);
  }, [isAdmin]);

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div 
          key={msg}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-black/60 backdrop-blur border-l-2 border-[var(--theme-color)] pl-3 py-1"
        >
          <p className="text-[10px] font-mono text-[var(--theme-color)] tracking-wider uppercase flex items-center gap-2">
            <Activity size={10} className="animate-pulse" /> LIVE: {msg}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Waveform = ({ isPlaying }) => {
  return (
    <div className="flex gap-[2px] items-end h-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[var(--theme-color)]"
          animate={{ height: isPlaying ? [4, 16, 8, 14, 4] : 4 }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 100) {
      setTimeout(onComplete, 500);
    }
  }, [count, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-6xl font-brand font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--theme-color)] to-black tracking-tighter mb-4">
        CHUMA
      </h1>
      <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden relative">
        <motion.div 
          className="h-full bg-[var(--theme-color)]"
          style={{ width: `${count}%` }}
        />
      </div>
      <p className="mt-2 text-[var(--theme-color)] font-mono text-xs">{count}% LOADED</p>
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };
    const mouseDown = () => setClicked(true);
    const mouseUp = () => setClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 border border-[var(--theme-color)] rounded-full pointer-events-none z-[1000] mix-blend-difference transition-all duration-100 hidden md:block ${clicked ? 'scale-75 bg-[var(--theme-color)]' : 'scale-100'}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-[var(--theme-color)] rounded-full" />
      </div>
    </div>
  );
};

// --- 3D COMPONENTS ---
const ReactiveFloor = ({ vibe, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = -2 + Math.sin(time * 2) * 0.05;
      meshRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 0.5) * 0.01;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
       <Grid 
         args={[20, 20]} 
         cellColor={matrixMode ? "#00ff00" : (vibe === 'fire' ? "#ff0000" : "#ffffff")} 
         sectionColor={matrixMode ? "#00ff00" : (vibe === 'fire' ? "#ff4500" : themeColor)} 
         fadeDistance={15} 
         sectionThickness={1}
         cellThickness={0.5}
       />
       <mesh ref={meshRef} position={[0, 0, -0.1]}>
          <planeGeometry args={[20, 20, 32, 32]} />
          <meshStandardMaterial 
            color="#000" 
            wireframe={matrixMode}
            transparent
            opacity={0.8}
          />
       </mesh>
    </group>
  );
};

const NavHologram = ({ hoveredNav, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  if (!hoveredNav) return null;

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={1}>
      <group position={[0, 1, 4]}>
        <mesh ref={meshRef}>
          {hoveredNav === 'music' && <torusGeometry args={[0.3, 0.1, 16, 32]} />}
          {hoveredNav === 'events' && <icosahedronGeometry args={[0.4, 0]} />}
          {hoveredNav === 'merch' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
          {hoveredNav === 'gallery' && <octahedronGeometry args={[0.4, 0]} />}
          {hoveredNav === 'profile' && <dodecahedronGeometry args={[0.4, 0]} />}
          <meshStandardMaterial 
             color={matrixMode ? "#00ff00" : themeColor} 
             wireframe 
             emissive={matrixMode ? "#00ff00" : themeColor}
             emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight color={themeColor} intensity={2} distance={2} />
      </group>
    </Float>
  );
};

const AbstractAvatar = ({ activeSection, arMode, vibe, partyMode, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
        meshRef.current.rotation.y = Math.cos(time * 0.3) * 0.5;
        const beatMultiplier = vibe === 'fire' || partyMode ? 8 : 2;
        const intensity = vibe === 'fire' ? 0.1 : 0.05;
        const s = 1 + Math.sin(time * beatMultiplier) * intensity;
        const finalScale = arMode ? s * 0.5 : s;
        meshRef.current.scale.set(finalScale, finalScale, finalScale);
    }
    if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.1;
    }
  });

  const color = useMemo(() => {
    if (matrixMode) return "#00ff00";
    if (partyMode) return new THREE.Color().setHSL(Math.random(), 1, 0.5);
    if (activeSection === 'admin') return "#ff0000";
    if (vibe === 'fire') return "#FF4500";
    return themeColor;
  }, [activeSection, vibe, partyMode, matrixMode, themeColor]);

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      <Float speed={vibe === 'fire' ? 6 : 3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial 
            color={color}
            envMapIntensity={2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.9} 
            roughness={0.1}
            distort={vibe === 'fire' || partyMode ? 0.6 : 0.3} 
            speed={vibe === 'fire' || partyMode ? 4 : 2}
            wireframe={matrixMode}
            emissive={matrixMode ? "#00ff00" : "#000"}
          />
        </mesh>
      </Float>
      <mesh rotation={[1, 1, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 64]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[-1, 0.5, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 64]} />
          <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

const TourGlobe = ({ matrixMode, themeColor }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });
  return (
    <group position={[2, 0, -2]}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#111" wireframe emissive={matrixMode ? "#00ff00" : themeColor} emissiveIntensity={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
};

const BackgroundScene = ({ arMode, vibe, partyMode, matrixMode, weather, themeColor }) => {
  const lightColor = matrixMode ? "#00ff00" : (partyMode ? "#00ff00" : (vibe === 'fire' ? "#ff0000" : themeColor));
  if (arMode) {
    return (
      <>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={lightColor} />
      </>
    );
  }
  return (
    <>
      {!matrixMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={vibe === 'fire' || partyMode ? 3 : 1} />}
      {weather === 'dust' && <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} color={themeColor} position={[0, 5, -5]} />}
      {weather === 'rain' && <Sparkles count={1000} scale={[10, 10, 10]} size={2} speed={2} opacity={0.8} color={matrixMode ? "#00ff00" : "#666"} />}
      {weather === 'clear' && <Sparkles count={vibe === 'fire' ? 500 : 200} scale={10} size={vibe === 'fire' ? 5 : 2} speed={0.4} opacity={0.5} color={matrixMode ? "#00ff00" : (partyMode ? "hotpink" : (vibe === 'fire' ? "#ff4500" : themeColor))} />}
      <ambientLight intensity={matrixMode ? 0.2 : 0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color={lightColor} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={matrixMode ? "#003300" : (partyMode ? "cyan" : (vibe === 'fire' ? "#ff4500" : "#8B5CF6"))} />
    </>
  );
};

const CameraController = ({ section, idleMode }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (section === 'gallery') return; // Release control to OrbitControls

    timeRef.current += delta;
    if (idleMode) {
      const x = Math.sin(timeRef.current * 0.2) * 8;
      const z = Math.cos(timeRef.current * 0.2) * 8;
      state.camera.position.lerp(vec.set(x, 2, z), 0.02);
      state.camera.lookAt(0, 0, 0);
      return;
    }
    let targetPos = [0, 0, 6];
    let targetLook = [0, 0, 0];
    switch (section) {
      case 'hero': targetPos = [0, 0, 7]; break;
      case 'music': targetPos = [2, 0, 6]; targetLook = [-1, 0, 0]; break;
      case 'events': targetPos = [0, 0, 7]; break;
      case 'about': targetPos = [3, 0, 5]; break;
      case 'merch': targetPos = [0, 2, 8]; break;
      case 'admin': targetPos = [0, 0, 10]; targetLook = [0, 1, 0]; break;
      case 'profile': targetPos = [0, 0, 6]; break;
      default: targetPos = [0, 0, 6];
    }
    state.camera.position.lerp(vec.set(...targetPos as [number, number, number]), 0.05);
    state.camera.lookAt(...targetLook as [number, number, number]);
  });
  return null;
};

const Hero3DText = ({ vibe, matrixMode, themeColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    }
  });
  return (
    <group position={[0, -0.5, 0]}>
      <Center>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group ref={groupRef}>
             <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={0.8}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
             >
                CHUMA
                <meshStandardMaterial 
                   color={matrixMode ? "#00ff00" : themeColor}
                   emissive={matrixMode ? "#00ff00" : themeColor}
                   emissiveIntensity={0.4}
                   metalness={0.9}
                   roughness={0.1}
                   envMapIntensity={1}
                />
             </Text3D>
          </group>
        </Float>
      </Center>
    </group>
  );
};

const AfroOrbitals = ({ vibe, matrixMode, themeColor }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if(group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });
  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshStandardMaterial color={matrixMode ? "#00ff00" : themeColor} emissive={matrixMode ? "#00ff00" : themeColor} emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
       <mesh rotation={[-Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.01, 16, 100]} />
        <meshStandardMaterial color={matrixMode ? "#00ff00" : themeColor} emissive={matrixMode ? "#00ff00" : themeColor} emissiveIntensity={0.2} transparent opacity={0.2} />
      </mesh>
      <Sparkles count={50} scale={8} size={4} speed={0.4} opacity={0.5} color={themeColor} />
    </group>
  );
}

const VinylRecord = ({ isPlaying, vibe, matrixMode, themeColor }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (isPlaying && ref.current) {
      ref.current.rotation.z -= delta * 2;
    }
  });
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <group ref={ref}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[2, 2, 0.05, 64]} />
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.9, 1.9, 64]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

const MouseSpotlight = ({ themeColor }) => {
  const ref = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    if (ref.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      ref.current.position.set(x, y, 2);
    }
  });
  return <pointLight ref={ref} distance={10} decay={2} intensity={2} color={themeColor} />;
};

const MouseTrail = ({ themeColor }) => {
  const ref = useRef<any>(null);
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    if (ref.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      ref.current.position.set(x, y, 0);
    }
  });
  return (
    <Trail width={1.5} length={6} color={new THREE.Color(themeColor)} attenuation={(t) => t * t}>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color={themeColor} />
      </mesh>
    </Trail>
  );
};

const Gallery3DItem: React.FC<{ 
  img: any, 
  position: any, 
  rotation: any, 
  dimensions: [number, number],
  themeColor: string, 
  index: number 
}> = ({ img, position, rotation, dimensions, themeColor, index }) => {
  const imageRef = useRef<any>(null); 
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [w, h] = dimensions;
  
  useCursor(hovered);

  useFrame((state, delta) => {
    // Interactive Hover Effects & Parallax
    const hoverScale = hovered ? 1.05 : 1;
    
    if (imageRef.current) {
        // Smooth scale
        imageRef.current.scale.lerp(new THREE.Vector3(hoverScale * w, hoverScale * h, 1), 0.1);
        
        // Material manipulation
        if (imageRef.current.material) {
             imageRef.current.material.grayscale = THREE.MathUtils.lerp(
                 imageRef.current.material.grayscale, 
                 hovered ? 0 : 0.8, // Partial grayscale by default for style
                 0.05
             );
             imageRef.current.material.zoom = THREE.MathUtils.lerp(
                 imageRef.current.material.zoom || 1,
                 hovered ? 1.1 : 1, // Slight zoom in image content
                 0.05
             );
        }
    }
    
    // Frame glow pulsing
    if (frameRef.current) {
        const mat = frameRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(
            mat.emissiveIntensity, 
            hovered ? 2.5 : 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2, 
            0.1
        );
    }

    if(glowRef.current) {
        glowRef.current.scale.lerp(new THREE.Vector3(w + (hovered ? 0.8 : 0.4), h + (hovered ? 0.8 : 0.4), 1), 0.1);
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
            (glowRef.current.material as THREE.MeshBasicMaterial).opacity,
            hovered ? 0.3 : 0.05,
            0.1
        );
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.05} 
      floatIntensity={0.2} 
      position={position} 
      rotation={rotation}
    >
      <group 
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
      >
        {/* Back Glow */}
        <mesh ref={glowRef} position={[0, 0, -0.1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={themeColor} transparent opacity={0.1} />
        </mesh>

        {/* Glowing Frame Background */}
        <mesh ref={frameRef} position={[0, 0, -0.02]}>
           <planeGeometry args={[w + 0.05, h + 0.05]} />
           <meshStandardMaterial color="#050505" emissive={themeColor} emissiveIntensity={0.5} />
        </mesh>
        
        {/* Wireframe Tech Border */}
        <mesh position={[0, 0, 0.01]}>
           <planeGeometry args={[w + 0.1, h + 0.1]} />
           <meshBasicMaterial color={themeColor} wireframe transparent opacity={0.15} />
        </mesh>

        {/* Decorative Corners */}
        <group position={[0, 0, 0.02]}>
            {/* Top Left */}
            <mesh position={[-w/2, h/2, 0]}>
                <boxGeometry args={[0.4, 0.02, 0.02]} />
                <meshBasicMaterial color={themeColor} />
            </mesh>
             <mesh position={[-w/2, h/2, 0]}>
                <boxGeometry args={[0.02, 0.4, 0.02]} />
                <meshBasicMaterial color={themeColor} />
            </mesh>
            {/* Bottom Right */}
            <mesh position={[w/2, -h/2, 0]}>
                <boxGeometry args={[0.4, 0.02, 0.02]} />
                <meshBasicMaterial color={themeColor} />
            </mesh>
             <mesh position={[w/2, -h/2, 0]}>
                <boxGeometry args={[0.02, 0.4, 0.02]} />
                <meshBasicMaterial color={themeColor} />
            </mesh>
        </group>

        <DreiImage
          ref={imageRef}
          url={img.src}
          scale={[w, h]}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </group>
    </Float>
  );
};

const Gallery3D = ({ images, themeColor }: { images: any[], themeColor: string }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
        // Adjust camera position based on screen width to ensure gallery is visible
        const isMobile = window.innerWidth < 768;
        camera.position.set(0, 0, isMobile ? 20 : 12);
        camera.lookAt(0, 0, 0);
    };

    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  // Architectural Grid Layout (Masonry Style)
  const layouts = [
    // Column 1 (Left)
    { pos: [-4, 2, 0], dim: [3, 4] },      // 0: Tall
    { pos: [-4, -2.5, 0], dim: [3, 4] },   // 1: Tall

    // Column 2 (Middle)
    { pos: [-0.2, 2.5, 0], dim: [3.8, 3] }, // 2: Wide
    { pos: [-0.2, -1.5, 0], dim: [3.8, 4] }, // 3: Large Square-ish

    // Column 3 (Right)
    { pos: [3.6, 2, 0], dim: [3, 4] },      // 4: Tall
    { pos: [3.6, -2.5, 0], dim: [3, 4] },   // 5: Tall

    // Wings
    { pos: [-7.5, 0, 1], dim: [2.5, 7] },   // 6: Far Left Wing
    { pos: [7.2, 0, 1], dim: [2.5, 7] },    // 7: Far Right Wing
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Cinematic Lighting */}
      <spotLight position={[0, 10, 10]} angle={0.5} penumbra={1} intensity={2} color={themeColor} />
      <pointLight position={[-10, 0, 5]} intensity={1} color="blue" />
      <pointLight position={[10, 0, 5]} intensity={1} color="purple" />

      {images.map((img, i) => {
        const layout = layouts[i] || { pos: [0, 0, 0], dim: [2, 2] };
        return (
          <Gallery3DItem 
            key={i}
            index={i}
            img={img}
            position={layout.pos}
            rotation={[0, 0, 0]}
            dimensions={layout.dim as [number, number]}
            themeColor={themeColor}
          />
        );
      })}
      
      {/* Enhanced Atmosphere */}
      <Sparkles count={300} scale={[20, 20, 10]} size={4} speed={0.4} opacity={0.4} color={themeColor} noise={0.2} />
      <Sparkles count={100} scale={[15, 15, 5]} size={5} speed={0.1} opacity={0.2} color="#ffffff" />
      <Cloud opacity={0.3} speed={0.2} width={20} depth={2} segments={10} color="#111" position={[0, 0, -5]} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={false}
        minPolarAngle={Math.PI / 2 - 0.4} 
        maxPolarAngle={Math.PI / 2 + 0.4}
        minAzimuthAngle={-Math.PI / 4} 
        maxAzimuthAngle={Math.PI / 4}
        enableRotate={true}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        target={[0, 0, 0]}
      />
    </group>
  );
};

const SalesChart3D = ({ themeColor, active }: { themeColor: string, active: boolean }) => {
  const data = useMemo(() => [40, 65, 30, 85, 50, 95, 70], []);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if(groupRef.current) {
      // If active, pulsate faster and with more amplitude
      const speed = active ? 3 : 0.5;
      const amp = active ? 0.5 : 0.2;
      groupRef.current.position.y = 1 + Math.sin(state.clock.getElapsedTime() * speed) * amp;
      groupRef.current.scale.lerp(new THREE.Vector3(active ? 1.2 : 1, active ? 1.2 : 1, active ? 1.2 : 1), 0.1);
    }
  });
  return (
    <group ref={groupRef} position={[-3, 1, 0]} rotation={[0, 0.3, 0]}>
       {data.map((val, i) => (
         <group key={i} position={[i * 1.2, 0, 0]}>
           <mesh position={[0, (val / 30) / 2, 0]}>
              <boxGeometry args={[0.8, val / 30, 0.8]} />
              <meshStandardMaterial color={themeColor} transparent opacity={0.7} emissive={themeColor} emissiveIntensity={active ? 1.0 : 0.4} wireframe />
           </mesh>
           <mesh position={[0, (val / 30) / 2, 0]}>
              <boxGeometry args={[0.6, val / 30, 0.6]} />
              <meshBasicMaterial color={themeColor} transparent opacity={0.1} />
           </mesh>
           <Text position={[0, -0.8, 0]} fontSize={0.4} color="white" font="https://fonts.gstatic.com/s/oswald/v49/TK3iWkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.ttf">{days[i]}</Text>
           <Text position={[0, (val / 30) + 0.5, 0]} fontSize={0.3} color={themeColor}>{val}k</Text>
         </group>
       ))}
       <Text position={[3.5, 4, 0]} fontSize={0.8} color="white" anchorX="center">WEEKLY VOLUME</Text>
    </group>
  );
};

const LiveActivityGlobe = ({ themeColor, active }: { themeColor: string, active: boolean }) => {
  const globeRef = useRef<THREE.Group>(null);
  const users = useMemo(() => {
    return new Array(40).fill(0).map(() => {
       const phi = Math.acos(-1 + (2 * Math.random()));
       const theta = Math.sqrt(Math.PI * 40) * phi;
       return { pos: new THREE.Vector3().setFromSphericalCoords(2, phi, theta), scale: 0.5 + Math.random() * 0.5 }
    });
  }, []);
  
  useFrame((state) => {
    if(globeRef.current) {
        // Spin faster if active
        globeRef.current.rotation.y += active ? 0.05 : 0.002;
        // Pulse scale
        if (active) {
            const s = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
            globeRef.current.scale.set(s, s, s);
        } else {
            globeRef.current.scale.lerp(new THREE.Vector3(1,1,1), 0.1);
        }
    }
  });
  return (
    <group position={[3, 1, 0]} rotation={[0, -0.5, 0]}>
       <group ref={globeRef}>
          <mesh>
            <sphereGeometry args={[2, 24, 24]} />
            <meshBasicMaterial color="#333" wireframe transparent opacity={0.3} />
          </mesh>
          <mesh>
             <sphereGeometry args={[1.95, 32, 32]} />
             <meshBasicMaterial color="#000" />
          </mesh>
          {users.map((u, i) => (
            <mesh key={i} position={u.pos}>
              <sphereGeometry args={[0.05 * u.scale, 8, 8]} />
              <meshBasicMaterial color={themeColor} />
            </mesh>
          ))}
       </group>
       <Text position={[0, 2.8, 0]} fontSize={0.6} color="white" anchorX="center">LIVE USERS</Text>
    </group>
  );
};

const AdminFloatingPackages = ({ themeColor }: { themeColor: string }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.rotation.x += 0.01;
                child.rotation.y += 0.02;
                child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
            })
        }
    })

    return (
        <group ref={groupRef} position={[0, 0, 2]}>
            <Float floatIntensity={2} speed={3}>
                <mesh position={[-2, 1, 0]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color={themeColor} wireframe />
                </mesh>
                <mesh position={[2, -1, 0]}>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial color={themeColor} wireframe />
                </mesh>
                <mesh position={[0, 2, -1]}>
                    <octahedronGeometry args={[0.4]} />
                    <meshStandardMaterial color="white" wireframe />
                </mesh>
            </Float>
        </group>
    )
}

// --- NEW ADMIN UI COMPONENTS ---

const AdminStatCard = ({ title, value, subtext, trend, icon: Icon, color, trendColor, bgColor, onHover }: any) => (
  <div onMouseEnter={onHover} className={`${bgColor} backdrop-blur-md border border-white/5 rounded-xl p-4 md:p-5 flex flex-col justify-between h-32 md:h-36 relative overflow-hidden group hover:border-white/10 transition-colors`}>
    <div className="flex justify-between items-start z-10">
      <div className={`p-2 md:p-3 rounded-lg ${color} text-white shadow-lg`}>
        <Icon size={20} className="md:w-6 md:h-6" />
      </div>
      <div className="text-right">
         <p className="text-[10px] md:text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">{title}</p>
         <h3 className="text-xl md:text-2xl font-bold font-brand tracking-wide text-white">{value}</h3>
      </div>
    </div>
    <div className="flex justify-between items-center mt-auto z-10 pt-2 md:pt-4">
       <span className="text-[8px] md:text-[10px] text-gray-500 font-medium">{subtext}</span>
       <span className={`text-[10px] md:text-xs font-bold ${trendColor} flex items-center gap-1 bg-black/30 px-2 py-1 rounded`}>
         {trend} <span className="text-[8px]">▲</span>
       </span>
    </div>
    <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
  </div>
);

const SmoothLineChart = ({ data1, data2 }: { data1: number[], data2: number[] }) => {
  const getPath = (points: number[], width: number, height: number) => {
    if (points.length === 0) return "";
    const stepX = width / (points.length - 1);
    const data = points.map((y, i) => ({ x: i * stepX, y: (1 - y) * height }));
    
    let d = `M ${data[0].x} ${data[0].y}`;
    for (let i = 1; i < data.length; i++) {
       const cp1x = data[i-1].x + stepX / 2;
       const cp1y = data[i-1].y;
       const cp2x = data[i-1].x + stepX / 2;
       const cp2y = data[i].y;
       d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${data[i].x} ${data[i].y}`;
    }
    return d;
  }

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 0.2}} />
            <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 0}} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#10B981', stopOpacity: 0.2}} />
            <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 0}} />
          </linearGradient>
        </defs>
        
        {/* Grid Lines */}
        <line x1="0" y1="40" x2="500" y2="40" stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" />
        <line x1="0" y1="160" x2="500" y2="160" stroke="#333" strokeDasharray="4 4" strokeWidth="0.5" />

        {/* Areas (optional for fill effect) */}
        <path d={`${getPath(data1, 500, 200)} L 500 200 L 0 200 Z`} fill="url(#grad1)" />
        <path d={`${getPath(data2, 500, 200)} L 500 200 L 0 200 Z`} fill="url(#grad2)" />

        {/* Lines */}
        <path d={getPath(data1, 500, 200)} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        <path d={getPath(data2, 500, 200)} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        
        {/* Highlight Point */}
        <circle cx="166" cy="110" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
        <line x1="166" y1="110" x2="166" y2="200" stroke="#3B82F6" strokeDasharray="2 2" />
      </svg>
      
      {/* Tooltip Simulation */}
      <div className="absolute top-[40%] left-[30%] bg-[#1A1A1A] border border-gray-700 p-3 rounded-lg shadow-xl text-xs transform -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:block">
         <p className="text-gray-400 mb-1">Monday | 8:40pm</p>
         <p className="text-white font-bold text-lg flex items-center gap-2">
            $3,201 <span className="text-[10px] text-blue-400 bg-blue-900/30 px-1 rounded">Sale</span>
         </p>
      </div>
      
      {/* Labels X */}
      <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono uppercase">
        <span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
      </div>
    </div>
  )
}

const HappinessChart = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="relative w-32 h-32 md:w-40 md:h-40">
          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#333" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="60 100" strokeDashoffset="0" strokeLinecap="round" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="25 100" strokeDashoffset="-65" strokeLinecap="round" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="10 100" strokeDashoffset="-92" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
             <span className="text-2xl md:text-3xl font-bold font-brand">88%</span>
             <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">Delightful</span>
          </div>
       </div>
    </div>
  )
}

const RecentOrdersTable = ({ orders, filter, onDeleteOrder }: { orders: any[], filter: string, onDeleteOrder: (id: string) => void }) => {
  const filteredOrders = orders.filter(order => 
      order.id.toLowerCase().includes(filter.toLowerCase()) ||
      order.product.toLowerCase().includes(filter.toLowerCase()) ||
      order.customer.toLowerCase().includes(filter.toLowerCase())
  );

  const [visibleActions, setVisibleActions] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-white/10">
            <th className="p-4 font-normal"><input type="checkbox" className="accent-[var(--theme-color)]" /></th>
            <th className="p-4 font-normal">Order ID</th>
            <th className="p-4 font-normal">Product</th>
            <th className="p-4 font-normal">Customer</th>
            <th className="p-4 font-normal">Price</th>
            <th className="p-4 font-normal">Payment</th>
            <th className="p-4 font-normal">Status</th>
            <th className="p-4 font-normal">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-200">
           {filteredOrders.length === 0 && (
             <tr>
               <td colSpan={8} className="p-8 text-center text-gray-500">No orders found.</td>
             </tr>
           )}
           {filteredOrders.map((order, i) => (
             <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
               <td className="p-4"><input type="checkbox" className="accent-[var(--theme-color)] rounded" /></td>
               <td className="p-4 font-mono text-gray-400">#{order.id}</td>
               <td className="p-4">
                 <div className="flex items-center gap-3">
                    <img src={order.img} className="w-10 h-10 rounded bg-gray-800 object-cover" alt={order.product} referrerPolicy="no-referrer" />
                    <div>
                       <p className="font-bold text-white max-w-[150px] truncate">{order.product}</p>
                       <p className="text-[10px] text-gray-500">Qty: {order.qty} Color: {order.color}</p>
                    </div>
                 </div>
               </td>
               <td className="p-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs">{order.customer.charAt(0)}</div>
                     <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-[10px] text-gray-500">{order.email}</p>
                     </div>
                  </div>
               </td>
               <td className="p-4 font-mono">${order.price}</td>
               <td className="p-4 text-xs">{order.payment}</td>
               <td className="p-4">
                 <span className={`px-3 py-1 rounded text-[10px] font-bold text-white ${order.statusColor}`}>{order.status}</span>
               </td>
               <td className="p-4 text-gray-500 relative">
                  <button onClick={() => setVisibleActions(visibleActions === order.id ? null : order.id)} className="hover:text-white cursor-pointer p-2"><MoreVertical size={16} /></button>
                  {visibleActions === order.id && (
                    <div className="absolute right-0 top-10 bg-black/90 border border-white/10 rounded shadow-xl z-50 w-32 flex flex-col">
                      <button className="px-4 py-2 text-xs hover:bg-white/10 text-left w-full">View Details</button>
                      <button onClick={() => onDeleteOrder(order.id)} className="px-4 py-2 text-xs hover:bg-red-900/50 text-red-500 text-left w-full">Delete Order</button>
                    </div>
                  )}
               </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

// ... EXISTING UI COMPONENTS (AuthModal, CartSidebar, etc.) ...

const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[var(--theme-color)] transition-colors"><X size={32} /></button>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-[var(--theme-color)]/30 shadow-[0_0_50px_rgba(var(--theme-rgb),0.15)]">
        <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" title="CHUMA Music Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast("SIGNED IN WITH GOOGLE");
      onClose();
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Google Sign In. Please add it in Firebase Console.");
      } else {
        setError("Failed to sign in with Google.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
       if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
       }
       try {
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         // Note: Actual file upload to storage is skipped as per requirements ("don't save user info").
         // We update profile with name.
         await updateProfile(userCredential.user, { displayName: name });
         showToast(`WELCOME TO THE TRIBE, ${name.toUpperCase()}`);
         onClose();
       } catch (error: any) {
         if (error.code === 'auth/email-already-in-use') {
           setError("User already exists. Sign in?");
         } else {
           console.error(error);
           setError("Registration failed. Try again.");
         }
       }
    } else {
       try {
         await signInWithEmailAndPassword(auth, email, password);
         showToast("WELCOME BACK");
         onClose();
       } catch (error: any) {
         console.error("Login Error:", error.code);
         // Display specific message as requested for any login failure
         setError("Password or Email Incorrect");
       }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="absolute inset-0" onClick={onClose} />
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[var(--theme-color)] transition-colors z-50 pointer-events-auto"><X size={32} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-md bg-black/80 border border-[var(--theme-color)]/30 p-8 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(var(--theme-rgb),0.2)] z-10 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent" />
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-brand font-bold text-white tracking-wider mb-2">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE TRIBE'}</h2>
                    <p className="text-xs text-gray-400 tracking-widest uppercase">{mode === 'login' ? 'ACCESS YOUR DASHBOARD' : 'UNLOCK EXCLUSIVE CONTENT'}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded flex items-center gap-2 text-red-200 text-xs">
                        <AlertTriangle size={14} className="text-red-500" />
                        {error}
                        {error === "User already exists. Sign in?" && (
                            <button onClick={() => { setMode('login'); setError(''); }} className="ml-auto underline font-bold">Sign In</button>
                        )}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                            <div className="flex items-center gap-4 mb-2">
                                <label className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[var(--theme-color)] transition-colors relative overflow-hidden group">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    {photoPreview ? (
                                      <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                      <User size={24} className="text-gray-500 group-hover:text-[var(--theme-color)]" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-white" />
                                    </div>
                                </label>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase">Profile Photo</p>
                                    <p className="text-[10px] text-gray-600">Upload a picture to represent your vibe.</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                                <input placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" />
                            </div>
                        </>
                    )}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                        <input placeholder="EMAIL ADDRESS" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" />
                    </div>
                    <div className="relative group">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                        <input placeholder="PASSWORD" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" />
                    </div>
                    {mode === 'register' && (
                        <div className="relative group">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                            <input placeholder="REPEAT PASSWORD" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" />
                        </div>
                    )}
                    <button type="submit" className="w-full py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors mt-6 clip-path-slant" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>{mode === 'login' ? 'ENTER' : 'REGISTER'}</button>
                </form>

                <div className="my-6 flex items-center justify-between gap-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[10px] text-gray-500 font-mono">OR CONTINUE WITH</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full py-3 bg-white/5 border border-white/10 text-white text-xs font-bold font-brand tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2 rounded">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    GOOGLE
                </button>

                <div className="mt-8 text-center border-t border-white/5 pt-4">
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-xs text-gray-400 hover:text-[var(--theme-color)] tracking-widest transition-colors">{mode === 'login' ? "NEW HERE? CREATE ACCOUNT" : "ALREADY HAVE AN ACCOUNT? LOGIN"}</button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart, onCheckoutSuccess, onOrderComplete }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const { showToast } = useToast();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckedOut(true);
      onCheckoutSuccess();
      onOrderComplete(cart);
      clearCart();
      showToast("ORDER SUCCESSFUL");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 20 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 z-[70] flex flex-col shadow-2xl shadow-[var(--theme-color)]/20">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-brand tracking-widest text-[var(--theme-color)]">YOUR STASH</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 && !checkedOut ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500"><ShoppingBag size={48} className="mb-4 opacity-20" /><p>YOUR CART IS EMPTY</p></div>
              ) : checkedOut ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--theme-color)]">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-[var(--theme-color)] rounded-full flex items-center justify-center text-black mb-6"><Check size={40} /></motion.div>
                  <h3 className="text-2xl font-brand mb-2">ORDER CONFIRMED</h3>
                  <p className="text-gray-400 text-center text-sm max-w-xs">Thank you for supporting CHUMA. Check your email for download links and tracking info.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
                    <img src={item.img} className="w-20 h-20 object-cover rounded bg-gray-800" referrerPolicy="no-referrer" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div><h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4><p className="text-xs text-gray-400">{item.type}</p></div>
                      <div className="flex justify-between items-end">
                        <span className="text-[var(--theme-color)] font-mono">${item.price}</span>
                        <div className="flex items-center gap-3 bg-black/50 rounded-full px-2 py-1 border border-white/10">
                           <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[var(--theme-color)]"><Minus size={12}/></button>
                           <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[var(--theme-color)]"><Plus size={12}/></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 self-start"><X size={16} /></button>
                  </motion.div>
                ))
              )}
            </div>
            {!checkedOut && cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                <div className="flex justify-between items-center mb-6"><span className="text-gray-400 text-sm tracking-widest">TOTAL</span><span className="text-2xl font-brand text-[var(--theme-color)]">${total}</span></div>
                <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full py-4 bg-[var(--theme-color)] hover:bg-white text-black font-bold font-brand tracking-widest flex items-center justify-center gap-2 transition-all">{isCheckingOut ? <span className="animate-pulse">PROCESSING...</span> : <><CreditCard size={18} /> CHECKOUT</>}</button>
                <p className="text-[10px] text-center text-gray-600 mt-3 flex items-center justify-center gap-2">SECURED BY FLUTTERWAVE & STRIPE <Shield size={10} /></p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ... MinimalCatalogue, WallOfFame ...
// (These are purely presentational and unchanged)

const MinimalCatalogue = ({ tracks }) => (
    <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-auto">
      <h4 className="text-[10px] font-brand tracking-widest text-white/30 -rotate-90 absolute -right-12 top-1/2 w-32 text-center">RECENT DROPS</h4>
      {tracks.slice(0, 3).map((track, i) => (
        <div key={i} className="group relative flex items-center justify-end">
          <div className="absolute right-14 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 text-right">
            <p className="text-sm font-bold text-[var(--theme-color)] whitespace-nowrap">{track.title}</p>
            <p className="text-[10px] text-gray-400">{track.type}</p>
          </div>
          <div className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded hover:bg-[var(--theme-color)] hover:border-[var(--theme-color)] transition-all duration-300 cursor-pointer flex items-center justify-center group-hover:scale-110">
            <span className="text-[10px] font-mono text-white/50 group-hover:text-black">{i === 0 ? <Music size={16} /> : i === 1 ? <Disc size={16} /> : <Mic2 size={16} />}</span>
          </div>
        </div>
      ))}
      <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent self-center mt-4"></div>
    </div>
);

const WallOfFame = ({ images, isAdmin, onAdd, onRemove }) => (
    <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-auto z-20">
      <h4 className="text-[10px] font-brand tracking-widest text-white/30 -rotate-90 absolute -left-10 top-1/2 w-32 text-center">WALL OF FAME</h4>
      <div className="flex flex-col -space-y-12 hover:space-y-2 transition-all duration-500 pb-4">
        {images.slice(0, 5).map((img, i) => (
          <motion.div key={img.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} whileHover={{ scale: 1.2, zIndex: 50, rotate: i % 2 === 0 ? 2 : -2 }} className="relative group w-20 h-28 bg-gray-900 border border-white/10 rounded-lg overflow-hidden shadow-2xl transform transition-all origin-left">
            <img src={img.src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" alt={img.caption} referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2"><span className="text-[8px] font-brand text-[var(--theme-color)] tracking-widest truncate">{img.caption}</span></div>
            {isAdmin && <button onClick={(e) => { e.stopPropagation(); onRemove(img.id); }} className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><Trash2 size={8} /></button>}
          </motion.div>
        ))}
      </div>
      {isAdmin && <button onClick={onAdd} className="w-8 h-8 rounded-full bg-[var(--theme-color)]/20 text-[var(--theme-color)] border border-[var(--theme-color)] flex items-center justify-center hover:bg-[var(--theme-color)] hover:text-black transition-all self-center" title="Add Image to Wall"><Plus size={16} /></button>}
    </div>
);

// ... Navigation, HeroContent, MusicSection ...
// (Purely UI and presentation)

const Navigation = ({ active, setActive, user, onHover }) => {
  const navItems = [
    { id: 'hero', icon: Box, label: 'HOME' }, // Changed to Box to differentiate
    { id: 'music', icon: Music, label: 'MUSIC' },
    { id: 'events', icon: Calendar, label: 'TOUR' },
    { id: 'merch', icon: ShoppingBag, label: 'STORE' },
    { id: 'gallery', icon: ImageIcon, label: 'GALLERY' },
    { id: 'contact', icon: Mail, label: 'CONTACT' },
  ];
  
  // Add Profile button if user is logged in
  if (user) navItems.push({ id: 'profile', icon: User, label: 'PROFILE' });
  if (user?.role === 'admin') navItems.push({ id: 'admin', icon: Shield, label: 'ADMIN' });

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[98%] max-w-lg">
      <div className="flex items-center justify-evenly px-2 py-3 md:px-6 md:py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl shadow-purple-900/20">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActive(item.id)} onMouseEnter={() => onHover(item.id)} onMouseLeave={() => onHover(null)} className={`relative flex flex-col items-center justify-center transition-all duration-300 p-1 ${active === item.id ? 'text-[var(--theme-color)] scale-110' : 'text-gray-400 hover:text-white'}`}>
            <item.icon className="w-5 h-5 md:w-5 md:h-5 mb-1" strokeWidth={active === item.id ? 2.5 : 2} fill={active === item.id && item.id === 'gallery' ? 'var(--theme-color)' : 'none'} />
            <span className="text-[8px] md:text-[8px] font-brand tracking-widest opacity-80 hidden sm:block"><ScrambleText text={item.label} className="" active={active === item.id} /></span>
            {active === item.id && <motion.div layoutId="activeTab" className="absolute -bottom-2 w-1 h-1 bg-[var(--theme-color)] rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
};

const HeroContent = ({ onExplore, onGoToStore, tracks, wallImages, isAdmin, onWallImageAdd, onWallImageRemove }) => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <>
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-[15vh] z-10 px-6 md:px-12">
        <div className="absolute bottom-[25vh] md:bottom-[25vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-auto w-full px-4">
            <button onClick={onExplore} className="px-5 py-2 md:px-8 md:py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors clip-path-slant w-auto text-sm md:text-base shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)] hover:shadow-[0_0_25px_rgba(var(--theme-rgb),0.6)]" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>STREAM NOW</button>
            <h2 className="text-[10px] md:text-sm font-light tracking-[0.8em] text-[var(--theme-color)] animate-pulse pointer-events-none whitespace-nowrap">THE SOUND OF THE FUTURE</h2>
        </div>
        <div className="w-full flex justify-center md:justify-end items-end">
           <div className="pointer-events-auto w-full max-w-xs md:w-auto text-center md:text-right">
              <button onClick={onGoToStore} className="w-full md:w-auto px-5 py-2 md:px-8 md:py-3 border border-[var(--theme-color)] text-[var(--theme-color)] font-bold font-brand tracking-widest hover:bg-[var(--theme-color)]/10 transition-colors clip-path-slant text-sm" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>OFFERS</button>
           </div>
        </div>
      </div>
      <MinimalCatalogue tracks={tracks} />
      <WallOfFame images={wallImages} isAdmin={isAdmin} onAdd={onWallImageAdd} onRemove={onWallImageRemove} />
    </>
  );
};

const MusicSection = ({ tracks, toggleFavorite, favorites, isPlayingId, setIsPlayingId }) => {
  const { showToast } = useToast();
  const handleShare = (title) => {
    navigator.clipboard.writeText(`Listen to ${title} by CHUMA!`);
    showToast("LINK COPIED TO CLIPBOARD");
  };
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-end px-4 md:px-20 z-10 pt-24 md:pt-0 pb-24 md:pb-0">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/5 pointer-events-auto max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
        <h3 className="text-2xl md:text-3xl font-brand text-[var(--theme-color)] mb-4 md:mb-6">LATEST RELEASES</h3>
        <div className="space-y-3 md:space-y-4">
          {tracks.map((track, idx) => (
            <div key={idx} className="group flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-b border-white/5" onClick={() => window.open(track.link, '_blank')}>
              <div className="flex items-center gap-3 md:gap-4"><span className="text-gray-500 font-mono text-xs md:text-sm">{idx + 1}</span><div><h4 className="font-bold text-sm md:text-base group-hover:text-[var(--theme-color)] transition-colors">{track.title}</h4><p className="text-[10px] md:text-xs text-gray-400">{track.plays} PLAYS • {track.type}</p></div></div>
              <div className="flex items-center gap-3 md:gap-4">
                <button onClick={(e) => { e.stopPropagation(); handleShare(track.title); }} className="text-gray-500 hover:text-white transition-colors"><Share2 size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite('tracks', track.id); }} className={`text-gray-400 hover:text-[var(--theme-color)] transition-colors ${favorites?.includes(track.id) ? 'text-[var(--theme-color)]' : ''}`}><Heart size={16} fill={favorites?.includes(track.id) ? "var(--theme-color)" : "none"} /></button>
                <span className="text-[10px] md:text-xs text-gray-500">{track.duration}</span>
                <button onClick={(e) => { e.stopPropagation(); setIsPlayingId(isPlayingId === track.id ? null : track.id); }} className="w-8 h-8 rounded-full bg-[var(--theme-color)] text-black flex items-center justify-center hover:scale-110 transition-transform relative">{isPlayingId === track.id ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}</button>
                {isPlayingId === track.id && <Waveform isPlaying={true} />}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/10"><span className="text-xs text-gray-400 tracking-widest">AVAILABLE ON ALL PLATFORMS</span><div className="flex gap-2 text-[var(--theme-color)]"><ExternalLink size={16} /></div></div>
      </div>
    </div>
  );
};

const EventsSection = ({ tourDates }) => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-start px-4 md:px-20 z-10 pt-24 md:pt-0 pb-24 md:pb-0">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/5 pointer-events-auto max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
        <h3 className="text-2xl md:text-3xl font-brand text-[var(--theme-color)] mb-4 md:mb-6">WORLD TOUR</h3>
        <div className="space-y-4 md:space-y-6">
          {tourDates.map((tour, idx) => (
            <div key={idx} className="relative flex items-center gap-4 md:gap-6 p-4 border border-white/10 rounded-lg hover:border-[var(--theme-color)]/50 transition-colors group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-color)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center min-w-[50px] md:min-w-[60px]"><span className="block text-xl md:text-2xl font-bold text-[var(--theme-color)] font-brand">{tour.date.split(' ')[1]}</span><span className="block text-[10px] md:text-xs font-bold text-gray-400">{tour.date.split(' ')[0]}</span></div>
              <div className="flex-1"><h4 className="text-lg md:text-xl font-bold font-brand leading-none mb-1">{tour.city}</h4><p className="text-xs md:text-sm text-gray-400">{tour.venue}, {tour.country}</p></div>
              <button className="px-3 py-2 md:px-4 bg-white/10 hover:bg-[var(--theme-color)] hover:text-black transition-colors rounded text-[10px] md:text-xs font-bold tracking-wider">TICKETS</button>
            </div>
          ))}
        </div>
      </div>
    </div>
);

const MerchSection = ({ merch, addToCart, toggleFavorite, favorites }) => {
  const [filter, setFilter] = useState('all');
  const categories = [{ id: 'all', label: 'ALL' }, { id: 'merch', label: 'MERCH' }, { id: 'beats', label: 'BEATS' }, { id: 'sounds', label: 'PACKS' }];
  const filteredMerch = filter === 'all' ? merch : merch.filter(item => item.category === filter);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-24 md:pt-20">
      <div className="w-full max-w-5xl px-4 pointer-events-auto flex flex-col h-[75vh] md:h-[80vh]">
        <div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setFilter(cat.id)} className={`text-xs md:text-sm font-bold tracking-widest transition-colors relative pb-2 whitespace-nowrap ${filter === cat.id ? 'text-[var(--theme-color)]' : 'text-gray-500 hover:text-white'}`}>
              {cat.label}{filter === cat.id && <motion.div layoutId="catUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--theme-color)]" />}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 overflow-y-auto pb-24 pr-1 md:pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredMerch.map(item => (
              <TiltCard key={item.id}>
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden group hover:border-[var(--theme-color)]/50 transition-all">
                  <div className="relative h-32 md:h-48 overflow-hidden">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 right-2">
                       <button onClick={() => toggleFavorite('merch', item.id)} className={`p-1.5 md:p-2 rounded-full backdrop-blur-sm ${favorites?.includes(item.id) ? 'bg-[var(--theme-color)] text-black' : 'bg-black/30 text-white hover:bg-white hover:text-black'}`}><Heart size={12} className="md:w-[14px] md:h-[14px]" fill={favorites?.includes(item.id) ? "black" : "none"} /></button>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2"><h3 className="font-bold text-sm md:text-lg leading-tight font-brand truncate">{item.name}</h3><span className="text-[var(--theme-color)] font-mono font-bold text-xs md:text-base">${item.price}</span></div>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4">{item.type}</p>
                    <button onClick={() => addToCart(item)} className="w-full py-2 bg-white/5 hover:bg-[var(--theme-color)] hover:text-black text-white border border-white/10 transition-all rounded font-bold tracking-wider flex items-center justify-center gap-2 text-[10px] md:text-xs"><ShoppingBag size={14} /> ADD <span className="hidden md:inline">TO CART</span></button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ... FavoritesSection Removed (Functionality retained via hearts, but page gone) ...
const GallerySectionOverlay = () => {
    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start pt-8 z-10">
            <h2 className="text-4xl md:text-6xl font-brand font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-white/10 tracking-[0.2em] drop-shadow-2xl">GALLERY</h2>
        </div>
    )
}

const ContactSection = () => {
  const { showToast } = useToast();
  const handleSubmit = (e) => { e.preventDefault(); showToast("MESSAGE SENT SUCCESSFULLY"); };
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-20 pb-20 overflow-y-auto">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 pointer-events-auto h-auto">
        <div className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-brand text-[var(--theme-color)] mb-6">GET IN TOUCH</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs text-gray-400 block mb-1">NAME</label><input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white" /></div>
            <div><label className="text-xs text-gray-400 block mb-1">EMAIL</label><input required type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white" /></div>
            <div><label className="text-xs text-gray-400 block mb-1">SUBJECT</label><select className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white"><option>BOOKING</option><option>PRESS / INTERVIEW</option><option>COLLABORATION</option><option>FAN LOVE</option></select></div>
            <div><label className="text-xs text-gray-400 block mb-1">MESSAGE</label><textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white"></textarea></div>
            <button type="submit" className="w-full py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors">SEND MESSAGE</button>
          </form>
        </div>
        <div className="space-y-4 text-center md:text-left">
           <div className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-center">
              <h3 className="text-xl font-brand text-white mb-6">MANAGEMENT</h3>
              <div className="space-y-4 text-gray-400 text-sm">
                <p><strong className="text-white block mb-1">BOOKINGS</strong> chumabooking@gmail.com</p>
                <p><strong className="text-white block mb-1">LABEL</strong> BOMIT RECORDS</p>
              </div>
              <div className="mt-8 flex gap-4 justify-center md:justify-start flex-wrap">
                {['INSTAGRAM', 'TWITTER', 'SPOTIFY', 'YOUTUBE'].map(social => ( <button key={social} className="text-[10px] border border-white/20 px-3 py-1 rounded-full hover:bg-[var(--theme-color)] hover:text-black hover:border-[var(--theme-color)] transition-all">{social}</button> ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ user, onUpdate, onLogout }: any) => {
  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if(user) setName(user.name);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, name });
    setIsEditing(false);
    showToast("PROFILE UPDATED");
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-20 pb-24 md:pt-0 md:pb-0">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 pointer-events-auto shadow-[0_0_50px_rgba(var(--theme-rgb),0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-50" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--theme-color)] to-purple-900 p-[2px] mb-4 shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                        {user?.photoURL ? (
                            <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <User size={40} className="text-white/50" />
                        )}
                    </div>
                </div>
                {/* Decorative orbiting ring */}
                <div className="absolute inset-[-4px] border border-[var(--theme-color)]/30 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '10s' }} />
            </div>

            <h2 className="text-3xl font-brand font-bold text-white mb-1 tracking-wide text-center">{user?.name}</h2>
            <p className="text-xs text-gray-400 font-mono tracking-wider">{user?.email}</p>
            
            <div className="mt-4 flex gap-2">
                <span className="text-[10px] text-[var(--theme-color)] uppercase tracking-widest bg-[var(--theme-color)]/10 px-3 py-1 rounded-full border border-[var(--theme-color)]/20 shadow-[0_0_10px_rgba(var(--theme-rgb),0.1)] flex items-center gap-1">
                    <Shield size={10} /> {user?.role === 'admin' ? 'ADMINISTRATOR' : 'TRIBE MEMBER'}
                </span>
            </div>
        </div>

        <div className="space-y-3 relative z-10">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div>
                        <label className="text-[10px] text-gray-500 mb-1 block uppercase tracking-wider">Display Name</label>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm text-white focus:border-[var(--theme-color)] outline-none font-mono transition-colors" 
                            autoFocus 
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded transition-colors tracking-widest">CANCEL</button>
                        <button type="submit" className="flex-1 py-3 bg-[var(--theme-color)] text-black font-bold text-xs rounded hover:bg-white transition-colors tracking-widest">SAVE</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setIsEditing(true)} className="w-full py-3 bg-white/5 border border-white/10 hover:border-[var(--theme-color)] hover:bg-[var(--theme-color)]/10 text-white font-bold text-xs tracking-widest rounded transition-all flex items-center justify-center gap-2 group">
                    <Edit size={14} className="group-hover:text-[var(--theme-color)] transition-colors" /> EDIT PROFILE
                </button>
            )}
            
            <button onClick={onLogout} className="w-full py-3 bg-red-900/10 border border-red-900/30 hover:bg-red-900/30 hover:border-red-500/50 text-red-500 font-bold text-xs tracking-widest rounded transition-all flex items-center justify-center gap-2">
                <LogOut size={14} /> LOGOUT
            </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminSection = ({ user, onLogout, tracks, onAddTrack, onRemoveTrack, merch, onAddMerch, onRemoveMerch, orders, onDeleteOrder, setHoveredAdminItem }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'content'>('analytics');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { showToast } = useToast();
  const streamData1 = [0.2, 0.4, 0.3, 0.7, 0.5, 0.8, 0.6];
  const streamData2 = [0.1, 0.3, 0.2, 0.4, 0.3, 0.5, 0.4];
  const [trackForm, setTrackForm] = useState({ title: "", duration: "", type: "Single" });
  const [merchForm, setMerchForm] = useState({ name: "", price: "", type: "Apparel", category: "merch", img: "https://lh3.googleusercontent.com/d/1UKAcMbw6_s5G17YysvldO-ZeweAKGwjK" });

  const handleTrackSubmit = (e) => { e.preventDefault(); onAddTrack(trackForm); setTrackForm({ title: "", duration: "", type: "Single" }); showToast("TRACK ADDED"); };
  const handleMerchSubmit = (e) => { e.preventDefault(); onAddMerch(merchForm); setMerchForm({ ...merchForm, name: "", price: "", img: "https://lh3.googleusercontent.com/d/1UKAcMbw6_s5G17YysvldO-ZeweAKGwjK" }); showToast("PRODUCT ADDED"); };

  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.price), 0);
  const totalOrders = orders.length;

  const handlePrint = () => {
    showToast("PREPARING PRINT VIEW...");
    setTimeout(() => window.print(), 500);
  };

  const handleDownload = () => {
    const headers = ["Order ID", "Product", "Customer", "Email", "Price", "Status", "Date"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + orders.map(o => `${o.id},"${o.product}","${o.customer}",${o.email},${o.price},${o.status},${o.date}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chuma_sales_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("REPORT DOWNLOADED");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("DASHBOARD URL COPIED");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-10 pt-20 pb-20 px-4 md:px-8 overflow-y-auto">
      <div className="w-full flex justify-between items-center pointer-events-auto mb-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="relative w-full max-w-xs hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
           <input 
             type="text" 
             placeholder="Search data..." 
             className="w-full bg-[#1A1A1A] border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:border-[var(--theme-color)] outline-none" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
           <button onClick={() => showToast("CALENDAR VIEW: " + currentDate)} className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-[#1A1A1A] px-3 py-2 rounded-lg border border-white/5 hover:bg-white/10 hover:text-white transition-colors"><Calendar size={14} /> <span>{currentDate}</span></button>
           <button onClick={() => showToast("NO NEW MESSAGES")} className="p-2 text-gray-400 hover:text-white relative"><MessageSquare size={18} /></button>
           <button onClick={() => showToast("NOTIFICATIONS CLEARED")} className="p-2 text-gray-400 hover:text-white relative"><Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
           <div className="h-8 w-px bg-white/10 mx-2"></div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[1px]"><img src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop"} className="w-full h-full rounded-full object-cover" alt="Profile" /></div>
              <div className="hidden md:block"><p className="text-sm font-bold text-white leading-none">{user?.name}</p><p className="text-[10px] text-gray-400">Admin</p></div>
              <button onClick={onLogout} className="text-red-500 hover:text-red-400 ml-2" title="Logout"><LogOut size={16} /></button>
           </div>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6 pointer-events-auto overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold tracking-wider transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-[var(--theme-color)] text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}><LayoutDashboard size={16} /> ANALYTICS</button>
        <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold tracking-wider transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-[var(--theme-color)] text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}><Database size={16} /> CMS</button>
      </div>

      {activeTab === 'analytics' && (
          <div className="flex-1 pointer-events-auto space-y-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
               <div><h2 className="text-2xl font-bold font-brand text-white">Analytics</h2><p className="text-xs text-gray-400 mt-1">Full Overview</p></div>
               <div className="flex gap-3 flex-wrap">
                  <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-xs text-gray-300 hover:bg-white/5 transition-colors"><Share2 size={14} /> Share</button>
                  <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-xs text-gray-300 hover:bg-white/5 transition-colors"><Printer size={14} /> Print</button>
                  <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 bg-[#3B82F6] text-white rounded text-xs font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"><Download size={14} /> Download</button>
               </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <AdminStatCard onHover={() => setHoveredAdminItem('stats')} title="Total Order" value={totalOrders} subtext="Lifetime" trend="10%" trendColor="text-[#10B981]" icon={ShoppingBag} color="bg-blue-500" bgColor="bg-[#1A1A1A]/90" />
               <AdminStatCard onHover={() => setHoveredAdminItem('stats')} title="Total User" value="23,345" subtext="450+ this week" trend="10%" trendColor="text-[#10B981]" icon={Users} color="bg-orange-500" bgColor="bg-[#1A1A1A]/90" />
               <AdminStatCard onHover={() => setHoveredAdminItem('stats')} title="Total Visitor" value="45,345" subtext="2.5k+ this week" trend="10%" trendColor="text-[#10B981]" icon={Eye} color="bg-green-500" bgColor="bg-[#1A1A1A]/90" />
               <AdminStatCard onHover={() => setHoveredAdminItem('stats')} title="Total Sales" value={`$${totalSales}`} subtext="Real-time" trend="10%" trendColor="text-[#10B981]" icon={DollarSign} color="bg-yellow-500" bgColor="bg-[#1A1A1A]/90" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[350px]">
               <div onMouseEnter={() => setHoveredAdminItem('revenue')} onMouseLeave={() => setHoveredAdminItem(null)} className="lg:col-span-2 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col min-h-[250px]">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white text-sm">Revenue Growth</h3><button className="flex items-center gap-2 text-xs text-gray-400 bg-black/30 px-3 py-1 rounded border border-white/5">Weekly <ChevronDown size={12} /></button></div>
                  <div className="flex-1 w-full relative"><SmoothLineChart data1={streamData1} data2={streamData2} /></div>
               </div>
               <div onMouseEnter={() => setHoveredAdminItem('happiness')} onMouseLeave={() => setHoveredAdminItem(null)} className="bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col">
                  <h3 className="font-bold text-white text-sm mb-4">Customer Happiness</h3>
                  <div className="flex-1 flex items-center justify-center relative min-h-[150px]"><HappinessChart /></div>
                  <div className="mt-4 space-y-2">
                     <div className="flex justify-between items-center text-xs text-gray-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#3B82F6]"></div> Delightful</span><span className="text-white">18,567</span></div>
                     <div className="flex justify-between items-center text-xs text-gray-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#10B981]"></div> Satisfactory</span><span className="text-white">8,567</span></div>
                     <div className="flex justify-between items-center text-xs text-gray-400"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#FBBF24]"></div> Neutral</span><span className="text-white">2,567</span></div>
                  </div>
               </div>
            </div>
            <div onMouseEnter={() => setHoveredAdminItem('orders')} onMouseLeave={() => setHoveredAdminItem(null)} className="bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-xl p-5">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white text-sm">Recent Orders</h3>
                 <div className="relative">
                   <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 text-xs text-gray-400 bg-black/30 px-3 py-1 rounded border border-white/5 hover:text-white"><Filter size={12} /> Filter: {filterStatus}</button>
                   {showFilterDropdown && (
                     <div className="absolute right-0 top-8 w-32 bg-black border border-white/10 rounded shadow-xl z-50 flex flex-col">
                       {['All', 'Pending', 'Processing', 'Shipped'].map(status => (
                         <button key={status} onClick={() => { setFilterStatus(status); setShowFilterDropdown(false); }} className="px-4 py-2 text-xs text-left hover:bg-white/10 text-gray-300">{status}</button>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
               <RecentOrdersTable orders={filteredOrders} filter={searchTerm} onDeleteOrder={onDeleteOrder} />
            </div>
          </div>
      )}

      {activeTab === 'content' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-auto overflow-y-auto p-1 pb-20">
             <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full">
                 <h3 className="text-xl font-brand text-white mb-4 flex items-center gap-2"><Music size={20} className="text-[var(--theme-color)]" /> MUSIC MANAGER</h3>
                 <form onSubmit={handleTrackSubmit} className="bg-white/5 p-4 rounded-lg mb-6 border border-white/5">
                     <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">ADD NEW RELEASE</h4>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                         <input required placeholder="Title" value={trackForm.title} onChange={e => setTrackForm({...trackForm, title: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] w-full" />
                         <input required placeholder="Duration" value={trackForm.duration} onChange={e => setTrackForm({...trackForm, duration: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] w-full" />
                         <select value={trackForm.type} onChange={e => setTrackForm({...trackForm, type: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2 w-full"><option value="Single">Single</option><option value="EP">EP</option><option value="Album">Album</option></select>
                     </div>
                     <button type="submit" className="w-full py-2 bg-[var(--theme-color)] text-black font-bold text-xs rounded hover:bg-white transition-colors">ADD TRACK</button>
                 </form>
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                     {tracks.map((track) => (
                         <div key={track.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-white/20">
                             <div><p className="font-bold text-sm text-white">{track.title}</p><p className="text-xs text-gray-500">{track.type} • {track.duration}</p></div>
                             <button onClick={() => onRemoveTrack(track.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={14} /></button>
                         </div>
                     ))}
                 </div>
             </div>
             <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full">
                 <h3 className="text-xl font-brand text-white mb-4 flex items-center gap-2"><ShoppingBag size={20} className="text-[var(--theme-color)]" /> STORE MANAGER</h3>
                 <form onSubmit={handleMerchSubmit} className="bg-white/5 p-4 rounded-lg mb-6 border border-white/5">
                     <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">ADD NEW PRODUCT</h4>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                         <input required placeholder="Item Name" value={merchForm.name} onChange={e => setMerchForm({...merchForm, name: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2 w-full" />
                         <input required type="number" placeholder="Price ($)" value={merchForm.price} onChange={e => setMerchForm({...merchForm, price: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] w-full" />
                         <select value={merchForm.category} onChange={e => setMerchForm({...merchForm, category: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] w-full"><option value="merch">Merch</option><option value="beats">Beats</option><option value="sounds">Sound Packs</option></select>
                         <input placeholder="Image URL (optional)" value={merchForm.img} onChange={e => setMerchForm({...merchForm, img: e.target.value})} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2 w-full" />
                     </div>
                     <button type="submit" className="w-full py-2 bg-[var(--theme-color)] text-black font-bold text-xs rounded hover:bg-white transition-colors">ADD PRODUCT</button>
                 </form>
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                     {merch.map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-white/20">
                             <div className="flex items-center gap-3"><img src={item.img} className="w-10 h-10 rounded bg-gray-800 object-cover" referrerPolicy="no-referrer" /><div><p className="font-bold text-sm text-white">{item.name}</p><p className="text-xs text-gray-500 capitalize">{item.category} • ${item.price}</p></div></div>
                             <button onClick={() => onRemoveMerch(item.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={14} /></button>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
      )}
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState({ tracks: [], merch: [] });
  const [user, setUser] = useState(null); 
  const [wallImages, setWallImages] = useState(INITIAL_WALL_IMAGES);
  const [isPlayingId, setIsPlayingId] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [adminHover, setAdminHover] = useState(null); // Track hovered admin section for 3D feedback
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [merch, setMerch] = useState(INITIAL_MERCH);
  const [theme, setTheme] = useState('gold'); 
  const [arMode, setArMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [vibe, setVibe] = useState('chill'); 
  const [weather, setWeather] = useState('clear'); 

  const themeColors = { 
    gold: { hex: '#D4AF37', rgb: '212, 175, 55' }, 
    red: { hex: '#FF3333', rgb: '255, 51, 51' },
    white: { hex: '#FFFFFF', rgb: '255, 255, 255' },
    green: { hex: '#00FF00', rgb: '0, 255, 0' }
  };
  const currentTheme = themeColors[theme];

  const toggleTheme = () => {
      setTheme(prev => {
        if (prev === 'gold') { setVibe('fire'); return 'red'; }
        if (prev === 'red') { setVibe('chill'); return 'white'; }
        if (prev === 'white') { setVibe('chill'); return 'green'; }
        setVibe('chill'); return 'gold';
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            const isAdmin = currentUser.email?.includes('admin') || currentUser.email === 'chuma@official.com';
            setUser({
                name: currentUser.displayName || "User",
                email: currentUser.email,
                role: isAdmin ? 'admin' : 'user',
                uid: currentUser.uid,
                photoURL: currentUser.photoURL
            });
        } else {
            setUser(null);
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Updated developer shortcut name
    const handleKey = (e) => { if (e.ctrlKey && e.key === 'm') setUser(prev => prev ? null : { name: 'Antony Muuo', role: 'admin' }); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlayingId) {
            audioRef.current.volume = 1.0;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) playPromise.catch(error => console.log("Audio playback failed:", error));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlayingId]);

  const handleUpdateUser = async (updatedUser) => { 
      try {
          if (auth.currentUser) {
              await updateProfile(auth.currentUser, { displayName: updatedUser.name });
              setUser(prev => ({...prev, name: updatedUser.name}));
          } else {
              // Fallback for demo mode
              setUser(prev => ({...prev, name: updatedUser.name}));
          }
      } catch (e) {
          console.error("Failed to update profile", e);
      }
  };
  const addToCart = (item) => { setCart(prev => { const exist = prev.find(i => i.id === item.id); if (exist) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i); return [...prev, { ...item, quantity: 1 }]; }); setCartOpen(true); };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, delta) => { setCart(prev => prev.map(item => { if (item.id === id) { const newQ = item.quantity + delta; return newQ > 0 ? { ...item, quantity: newQ } : item; } return item; })); };
  const toggleFavorite = (type, id) => { setFavorites(prev => { const list = prev[type]; if (list.includes(id)) return { ...prev, [type]: list.filter(i => i !== id) }; return { ...prev, [type]: [...list, id] }; }); };
  const handleAddTrack = (newTrack) => { setTracks(prev => [...prev, { ...newTrack, id: Date.now(), plays: '0' }]); };
  const handleRemoveTrack = (id) => { setTracks(prev => prev.filter(t => t.id !== id)); };
  const handleAddMerch = (newItem) => { setMerch(prev => [...prev, { ...newItem, id: Date.now(), type: newItem.type || 'Apparel' }]); };
  const handleRemoveMerch = (id) => { setMerch(prev => prev.filter(m => m.id !== id)); };
  
  const handleOrderComplete = (cartItems) => {
    const newOrders = cartItems.map(item => ({
      id: Math.floor(Math.random() * 10000000).toString(),
      product: item.name,
      qty: item.quantity,
      color: "Standard",
      customer: user ? user.name : "Guest User",
      email: user ? user.email || "guest@email.com" : "guest@email.com",
      price: item.price * item.quantity,
      payment: "Credit Card",
      status: "Pending",
      statusColor: "bg-orange-500",
      img: item.img,
      date: new Date().toISOString().split('T')[0]
    }));
    setOrders(prev => [...newOrders, ...prev]);
  };

  const handleDeleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };
  
  const handleLogout = async () => {
      try {
          await signOut(auth);
          setUser(null);
          setActiveSection('hero');
      } catch (e) {
          console.error(e);
      }
  };

  return (
    <ToastProvider>
      <AnimatePresence>{loading && <Preloader onComplete={() => setLoading(false)} />}</AnimatePresence>
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/25/audio_2456e77894.mp3" loop crossOrigin="anonymous" />
      <div className="w-full h-screen bg-black text-white overflow-hidden select-none" style={{ "--theme-color": currentTheme.hex, "--theme-rgb": currentTheme.rgb } as React.CSSProperties}>
        <CustomCursor />
        <LiveTicker isAdmin={user?.role === 'admin'} />
        <CartSidebar 
           isOpen={cartOpen} 
           onClose={() => setCartOpen(false)} 
           cart={cart} 
           updateQuantity={updateQuantity} 
           removeFromCart={removeFromCart} 
           clearCart={() => setCart([])} 
           onCheckoutSuccess={() => {}}
           onOrderComplete={handleOrderComplete}
        />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <header className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 flex justify-between items-start pointer-events-none">
          <div><h1 className="text-xl md:text-2xl font-bold font-brand tracking-tighter pointer-events-auto cursor-pointer" onClick={() => setActiveSection('hero')}>CHUMA</h1></div>
          <div className="flex gap-4 pointer-events-auto items-center">
            <button onClick={toggleTheme} className="p-2 hover:text-[var(--theme-color)] transition-colors group flex flex-col items-center" title="Toggle Theme">
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center" style={{ backgroundColor: currentTheme.hex }}>
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:text-[var(--theme-color)] transition-colors"><ShoppingBag size={20} />{cart.length > 0 && (<span className="absolute top-0 right-0 w-4 h-4 bg-[var(--theme-color)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">{cart.reduce((a,b) => a + b.quantity, 0)}</span>)}</button>
            {user ? (
               <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                 {user.role === 'admin' && (<div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--theme-color)]/10 border border-[var(--theme-color)] rounded-full"><div className="w-2 h-2 bg-[var(--theme-color)] rounded-full animate-pulse" /><span className="text-[10px] font-bold text-[var(--theme-color)]">ADMIN</span></div>)}
                 <div className="flex items-center gap-2 group relative">
                    <button onClick={() => setActiveSection('profile')} className="flex items-center gap-2 hover:text-[var(--theme-color)] transition-colors">
                        <span className="text-xs font-bold uppercase tracking-widest hidden md:block text-gray-300 group-hover:text-[var(--theme-color)]">{user.name}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 overflow-hidden group-hover:border-[var(--theme-color)] transition-colors">
                            {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" /> : <User size={20} className="w-full h-full p-1 text-gray-400" />}
                        </div>
                    </button>
                    <button onClick={handleLogout} className="hover:text-red-500 transition-colors ml-2" title="Logout"><LogOut size={20} /></button>
                 </div>
               </div>
            ) : (<button onClick={() => setAuthOpen(true)} className="ml-2 text-[10px] md:text-xs font-bold tracking-widest text-black bg-[var(--theme-color)] px-3 py-1.5 md:px-5 md:py-2 hover:bg-white transition-colors clip-path-slant flex items-center gap-2" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}><LogIn size={14} /> LOGIN <span className="hidden md:inline">/ JOIN</span></button>)}
          </div>
        </header>
        <div className="absolute inset-0 z-0">
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 6]} />
              <Environment preset="city" />
              <BackgroundScene arMode={arMode} vibe={vibe} partyMode={isPlayingId !== null} matrixMode={matrixMode} weather={weather} themeColor={currentTheme.hex} />
              <CameraController section={activeSection} idleMode={false} />
              <Center>
                {activeSection === 'hero' && (<group><AbstractAvatar activeSection={activeSection} arMode={arMode} vibe={vibe} partyMode={isPlayingId !== null} matrixMode={matrixMode} themeColor={currentTheme.hex} /><Hero3DText vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} /><AfroOrbitals vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} /><ReactiveFloor vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} /></group>)}
                {activeSection === 'music' && <VinylRecord isPlaying={isPlayingId !== null} vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} />}
                {activeSection === 'events' && <TourGlobe matrixMode={matrixMode} themeColor={currentTheme.hex} />}
                {activeSection === 'merch' && (<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}><mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color={currentTheme.hex} wireframe={true} /></mesh></Float>)}
                {activeSection === 'gallery' && <Gallery3D images={wallImages} themeColor={currentTheme.hex} />}
                {activeSection === 'profile' && (<group><AbstractAvatar activeSection={activeSection} arMode={arMode} vibe={vibe} partyMode={isPlayingId !== null} matrixMode={matrixMode} themeColor={currentTheme.hex} /><Hero3DText vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} /><AfroOrbitals vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} /></group>)}
                {activeSection === 'admin' && (
                    <group>
                        <SalesChart3D themeColor={currentTheme.hex} active={adminHover === 'revenue'} />
                        <LiveActivityGlobe themeColor={currentTheme.hex} active={adminHover === 'stats' || adminHover === 'happiness'} />
                        {adminHover === 'orders' && <AdminFloatingPackages themeColor={currentTheme.hex} />}
                    </group>
                )}
              </Center>
              <NavHologram hoveredNav={hoveredNav} matrixMode={matrixMode} themeColor={currentTheme.hex} />
              <MouseSpotlight themeColor={currentTheme.hex} />
              <MouseTrail themeColor={currentTheme.hex} />
            </Suspense>
          </Canvas>
        </div>
        <AnimatePresence mode="wait">
          {activeSection === 'hero' && (<motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10"><HeroContent onExplore={() => setActiveSection('music')} onGoToStore={() => setActiveSection('merch')} tracks={tracks} wallImages={wallImages} isAdmin={user?.role === 'admin'} onWallImageAdd={() => {}} onWallImageRemove={(id) => setWallImages(prev => prev.filter(i => i.id !== id))} /></motion.div>)}
          {activeSection === 'music' && (<motion.div key="music" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="absolute inset-0 z-10"><MusicSection tracks={tracks} toggleFavorite={toggleFavorite} favorites={favorites.tracks} isPlayingId={isPlayingId} setIsPlayingId={setIsPlayingId} /></motion.div>)}
          {activeSection === 'events' && (<motion.div key="events" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute inset-0 z-10"><EventsSection tourDates={INITIAL_TOUR_DATES} /></motion.div>)}
          {activeSection === 'merch' && (<motion.div key="merch" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} className="absolute inset-0 z-10"><MerchSection merch={merch} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites.merch} /></motion.div>)}
          {activeSection === 'gallery' && (<motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10"><GallerySectionOverlay /></motion.div>)}
          {activeSection === 'contact' && (<motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10"><ContactSection /></motion.div>)}
          {activeSection === 'profile' && (<motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10"><ProfileSection user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} /></motion.div>)}
          {activeSection === 'admin' && (<motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10"><AdminSection user={user} onLogout={handleLogout} tracks={tracks} onAddTrack={handleAddTrack} onRemoveTrack={handleRemoveTrack} merch={merch} onAddMerch={handleAddMerch} onRemoveMerch={handleRemoveMerch} orders={orders} onDeleteOrder={handleDeleteOrder} setHoveredAdminItem={setAdminHover} /></motion.div>)}
        </AnimatePresence>
        <Navigation active={activeSection} setActive={setActiveSection} user={user} onHover={setHoveredNav} />
      </div>
    </ToastProvider>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);